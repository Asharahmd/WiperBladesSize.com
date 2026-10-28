"""Fetch wiper sizes from Rain-X's public blade-finder JSON (source 1).

Walks every make and model Rain-X lists for each year 2010-2026.
Raw responses go to data/raw/rainx/<Make>/<Model>/<year>.json; existing files are skipped, so it resumes.
Usage: python _tools/fetch_rainx.py
"""
import http.client, json, time, urllib.parse, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw" / "rainx"
API = "https://www.rainx.com/wp-json/rainxapi/v1"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36"
YEARS = range(2010, 2027)
DELAY = 0.3
# Commercial chassis makes: not passenger vehicles, nobody searches their wiper size
SKIP_MAKES = {"Freightliner", "International", "Hino", "Mack", "Peterbilt", "Kenworth", "Workhorse", "Blue Bird",
              "Thomas", "Western Star", "Autocar", "Capacity", "Advance Mixer", "Airstream", "Isuzu",
              "IC Corporation", "UD", "Sterling", "Ottawa", "Kalmar", "Mitsubishi Fuso", "Nissan Diesel"}


def seg(s):
    # Rain-X's own finder sends spaces as "---"; other characters are URL-encoded
    return urllib.parse.quote(s.replace(" ", "---"), safe="-_&")


def get(path):
    req = urllib.request.Request(f"{API}/{path}", headers={"User-Agent": UA})
    for attempt in range(3):
        try:
            return json.loads(urllib.request.urlopen(req, timeout=30).read().decode())
        except (OSError, http.client.HTTPException, json.JSONDecodeError):  # dropped connections, timeouts, bad JSON
            time.sleep(10 * (attempt + 1))
    return None


def safe(name):
    return name.replace("/", "_").replace("\\", "_").replace(":", "_").strip()


def fetch_make_year(y, mk):
    cache = RAW / "_models" / f"{y}-{safe(mk)}.json"
    if cache.exists():
        models = json.loads(cache.read_text(encoding="utf8"))
    else:
        models = [m["model"] for m in (get(f"getModels/{y}/{seg(mk)}/x") or []) if isinstance(m, dict)]
        cache.parent.mkdir(parents=True, exist_ok=True)
        cache.write_text(json.dumps(models), encoding="utf8")
        time.sleep(DELAY)
    for md in models:
        out = RAW / safe(mk) / safe(md) / f"{y}.json"
        if out.exists():
            continue
        d = get(f"productSearchSiliconSize/{y}/{seg(mk)}/{seg(md)}/all")
        if d is not None:  # failures are left unwritten so the next run retries them
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(json.dumps(d), encoding="utf8")
        time.sleep(DELAY)
    print(y, mk, len(models), flush=True)


def main():
    from concurrent.futures import ThreadPoolExecutor
    jobs = []
    for y in YEARS:
        jobs += [(y, m["value"]) for m in (get(f"getMakesAjax/{y}/Make") or []) if m["value"] not in SKIP_MAKES]
    # 4 workers: 6 got connections dropped by the server
    with ThreadPoolExecutor(4) as pool:
        list(pool.map(lambda j: fetch_make_year(*j), jobs))


if __name__ == "__main__":
    main()
