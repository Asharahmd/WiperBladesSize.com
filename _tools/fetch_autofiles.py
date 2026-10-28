"""Fetch US wiper sizes from autofiles.com (independent US source).

Each model page /wipers/<make>/<model>/ lists every year as
'2012 Nissan Altima | Driver - 28 inch | Passenger - 17 inch | Rear - 12 inch | Attach - Hook (9x3)'.
Parsed rows go to data/raw/autofiles/<make>/<model>.json; existing files are skipped.
Usage: python _tools/fetch_autofiles.py
"""
import html, json, re, time, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw" / "autofiles"
SITE = "https://autofiles.com/wipers"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36"
DELAY = 1.0


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(3):
        try:
            return urllib.request.urlopen(req, timeout=30).read().decode("utf8", "ignore")
        except OSError:
            time.sleep(10 * (attempt + 1))
    return None


def flat(page):
    s = re.sub(r"<script.*?</script>|<style.*?</style>", "", page, flags=re.S)
    s = html.unescape(re.sub(r"<[^>]+>", "|", s))
    return re.sub(r"(\|\s*)+", "|", re.sub(r"\s+", " ", s))


def parse(page):
    rows = []
    s = flat(page)
    blocks = re.split(r"\|(?=(?:19|20)\d\d [^|]+\|Driver - )", s)
    for b in blocks[1:]:
        m = re.match(r"((?:19|20)\d\d) ([^|]+)\|Driver - \|--> (\d+) inch", b)
        if not m:
            continue
        p = re.search(r"Passenger - \|--> (\d+) inch", b)
        r = re.search(r"Rear - \|--> (\d+) inch", b)
        a = re.search(r"Attach - ([^|]+?)\s*\|", b)
        rows.append({"year": int(m.group(1)), "name": m.group(2).strip(), "driver": int(m.group(3)),
                     "passenger": int(p.group(1)) if p else None, "rear": int(r.group(1)) if r else None,
                     "attach": a.group(1).strip() if a else None})
    return rows


def main():
    index = get(f"{SITE}/") or ""
    makes = sorted(set(re.findall(r'href="(?:https://autofiles.com)?/wipers/([a-z0-9-]+)/"', index)))
    jobs = []
    for mk in makes:
        page = get(f"{SITE}/{mk}/") or ""
        jobs += [(mk, md) for md in sorted(set(re.findall(rf'href="(?:https://autofiles.com)?/wipers/{mk}/([a-z0-9-]+)/"', page)))]
        time.sleep(DELAY)
    print(len(makes), "makes,", len(jobs), "models", flush=True)

    def one(job):
        mk, md = job
        out = RAW / mk / f"{md}.json"
        if out.exists():
            return
        page = get(f"{SITE}/{mk}/{md}/")
        if page:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(json.dumps(parse(page)), encoding="utf8")
        time.sleep(DELAY)

    with ThreadPoolExecutor(2) as pool:
        list(pool.map(one, jobs))
    print("done", flush=True)


if __name__ == "__main__":
    main()
