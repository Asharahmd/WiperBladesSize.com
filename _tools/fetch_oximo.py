"""Fetch wiper sizes from oximo.pl (OXIMO wiper maker's fitment database, independent of the UK and US sources).

Each generation page /en/wiper-car/<make>/<model>/<variant>/ lists 'Driver side: WUS600 / Passenger side: WUS350'
(the digits are the blade length in mm) and 'Rear: 350 mm'. The variant slug ends with its production dates,
e.g. sedan-2010-09-01 or suv-a4-2012-12-01-2018-11-01. URLs come from the car_models sitemaps; robots.txt allows them.
Only makes that Rain-X lists are fetched. Parsed rows go to data/raw/oximo/<make>/<model>/<variant>.json; existing files are skipped.
Usage: python _tools/fetch_oximo.py
"""
import html, json, re, time, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw" / "oximo"
SITE = "https://www.oximo.pl"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36"
DELAY = 1.0


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(3):
        try:
            return urllib.request.urlopen(req, timeout=30).read().decode("utf8", "ignore")
        except urllib.error.HTTPError as e:
            if e.code < 500:  # the sitemaps still list some removed pages
                return ""
            time.sleep(10 * (attempt + 1))
        except OSError:
            time.sleep(10 * (attempt + 1))
    return None


def norm(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


def parse(page):
    s = re.sub(r"<script.*?</script>|<style.*?</style>", "", page, flags=re.S)
    s = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s)))
    # the first front block is OXIMO's recommended blade; the mm length is the number at the end of the code
    # vehicle-specific sets read 'Driver: 600 mm' instead
    d = re.search(r"Driver side: [A-Z*]+?(\d{3})\b", s) or re.search(r"Driver: (\d{3}) mm", s)
    p = re.search(r"Passenger side: [A-Z*]+?(\d{3})\b", s) or re.search(r"Passenger: (\d{3}) mm", s)
    r = re.search(r"Rear: (\d{3}) mm", s)
    return {"driver_mm": int(d.group(1)) if d else None, "passenger_mm": int(p.group(1)) if p else None,
            "rear_mm": int(r.group(1)) if r else None}


def main():
    makes = {norm(p.name) for p in (ROOT / "data" / "raw" / "rainx").iterdir() if p.is_dir() and p.name != "_models"}
    makes |= {"mercedes", "vw"}
    jobs = []
    for i in [""] + [str(n) for n in range(2, 30)]:
        xml = get(f"{SITE}/car_models-sitemap{i}.xml")
        if not xml or "<loc>" not in xml:
            break
        for u in re.findall(r"<loc>([^<]+)</loc>", xml):
            m = re.match(rf"{SITE}/wycieraczki-do-szyb/([a-z0-9-]+)/([a-z0-9-]+)/([a-z0-9-]+)/?$", u)
            if m and norm(m.group(1)) in makes:
                jobs.append(m.groups())
        time.sleep(DELAY)
    print(len(jobs), "variant pages", flush=True)

    def one(job):
        mk, md, var = job
        out = RAW / mk / md / f"{var}.json"
        if out.exists():
            return
        page = get(f"{SITE}/en/wiper-car/{mk}/{md}/{var}/")
        if page is not None:  # a removed page is saved empty so reruns skip it
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(json.dumps(parse(page)), encoding="utf8")
        time.sleep(DELAY)

    with ThreadPoolExecutor(3) as pool:
        list(pool.map(one, jobs))
    print("done", flush=True)


if __name__ == "__main__":
    main()
