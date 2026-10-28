"""Fetch UK fitment text from wiperblades.co.uk (source 2, All Car Parts Ltd).

windscreenwipers.co.uk belongs to the same company and shows the same data, so it does not
count as a separate source. Each vehicle collection's public Shopify .json has a description like
'requires a 26" wiper blade on the drivers side with a 16" for the passengers side ... Standard Hook'.
Raw JSON goes to data/raw/uk_acp/<handle>.json; existing files are skipped.
Usage: python _tools/fetch_uk.py
"""
import json, re, time, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw" / "uk_acp"
SITE = "https://www.wiperblades.co.uk"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36"
DELAY = 1.0


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(3):
        try:
            return urllib.request.urlopen(req, timeout=30).read().decode()
        except (urllib.error.URLError, TimeoutError):
            time.sleep(5 * (attempt + 1))
    return None


def handles():
    index = get(f"{SITE}/sitemap.xml") or ""
    out = []
    for sm in re.findall(r"<loc>([^<]+sitemap_collections[^<]+)</loc>", index):
        xml = get(sm.replace("&amp;", "&")) or ""
        out += re.findall(r"/collections/([a-z0-9-]+-\d{4}-to-\d{4}-windscreen-wiper-blades)</loc>", xml)
        time.sleep(DELAY)
    return sorted(set(out))


def main():
    RAW.mkdir(parents=True, exist_ok=True)
    hs = handles()
    print(len(hs), "vehicle collections", flush=True)
    def one(h):
        out = RAW / f"{h}.json"
        if not out.exists():
            body = get(f"{SITE}/collections/{h}.json")
            if body:
                out.write_text(body, encoding="utf8")
            time.sleep(DELAY)

    from concurrent.futures import ThreadPoolExecutor
    with ThreadPoolExecutor(3) as pool:  # about 2 requests a second given the round-trip time
        list(pool.map(one, hs))
    print("done", flush=True)

if __name__ == "__main__":
    main()
