"""Merge raw sources into data/vehicles.json (what the site reads).

Sources:
  rainx   data/raw/rainx/<Make>/<Model>/<year>.json   US fitment, driver/passenger/rear (base list of vehicles)
  uk_acp  data/raw/uk_acp/<handle>.json               wiperblades.co.uk collection text, front sizes for UK models
  autofiles data/raw/autofiles/<make>/<model>.json   autofiles.com per-year US sizes (driver, passenger, rear, attach)
  oximo   data/raw/oximo/<make>/<model>/<variant>.json  oximo.pl (European wiper maker) per-generation sizes in mm
  manual  data/manual/checks.csv                      sizes checked by hand (AutoPadre and others via search), one row per year range

A vehicle-year is `verified` when two sources vote for the same (driver, passenger) pair.
The rear blade is shown from Rain-X; `rearVerified` is set only when a second source also states it.
Usage: python _tools/build_data.py
"""
import csv, html, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw"
MANUAL = ROOT / "data" / "manual" / "checks.csv"
OUT = ROOT / "data" / "vehicles.json"
YEARS = range(2010, 2027)

# Commercial chassis makes Rain-X lists; nobody searches their wiper size
COMMERCIAL = {"IC Corporation", "UD", "Sterling", "Ottawa", "Kalmar", "Mitsubishi Fuso", "Nissan Diesel", "Blue Bird", "Thomas"}

POSITIONS = {"Driver": "driver", "Passenger": "passenger", "Rear": "rear"}
# the audience is US drivers, so when one source has to stand alone, US sources come before the UK list
US_FIRST = ["manual", "autofiles", "manual_extra", "oximo", "uk_acp"]
# UK handle prefixes that differ from Rain-X make names
MAKE_ALIASES = {"vw": "volkswagen", "mercedes": "mercedesbenz", "mercedes-benz": "mercedesbenz", "citroen": "citroen"}
# Same car sold under another name in the UK: (make, US model) -> (UK make, UK model, first shared model year)
MODEL_TWINS = {
    ("Nissan", "Rogue"): ("Nissan", "x-trail", 2014),
    ("Ford", "Escape"): ("Ford", "kuga", 2013),
    ("Buick", "Encore"): ("Vauxhall", "mokka", 2013),
    ("Buick", "Regal"): ("Vauxhall", "insignia", 2011),
    ("Buick", "Cascada"): ("Vauxhall", "cascada", 2016),
}
BODY_WORDS = {"hatchback", "saloon", "sedan", "estate", "wagon", "coupe", "convertible", "cabriolet", "suv", "mpv", "4x4",
              "tourer", "sportback", "pickup", "pick-up", "van", "crossover", "roadster", "liftback", "fastback",
              "double", "cab", "single", "crew", "5", "3", "door", "japanese", "uk", "build", "hybrid", "electric", "ev"}


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def norm(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


def inches(size):
    # Rain-X writes fronts as 26" and rears as 12-A / 14-B (the letter is its rear-arm code)
    m = re.match(r"\s*(\d{1,2})", size or "")
    return int(m.group(1)) if m else None


def connector(arm):
    a = (arm or "").lower()
    if "hook" in a:
        return "j-hook"
    for key in ("push button", "pinch tab", "side pin", "bayonet", "top lock", "slider"):
        if key in a:
            return key.replace(" ", "-")
    return None


# ---------- Rain-X ----------

def from_rainx(path):
    try:
        d = json.loads(path.read_text(encoding="utf8"))
    except json.JSONDecodeError:
        return None
    rec = {"driver": set(), "passenger": set(), "rear": set(), "arms": {}}
    for r in (d.get("globalSize") or []) if isinstance(d, dict) else []:
        pos = POSITIONS.get(r.get("position"))
        n = inches(r.get("size"))
        if not pos or not n:
            continue
        rec[pos].add(n)
        rec["arms"].setdefault(pos, r.get("arm_type") or "")
    # kept even without front sizes: Rain-X still lists the vehicle, and other sources can supply the sizes
    return rec


# ---------- UK (wiperblades.co.uk) ----------

def parse_uk(path):
    """-> dict(make_model_norm parts, years, driver, passenger, rear) or None."""
    h = path.stem
    m = re.match(r"(.+)-(\d{4})-to-(\d{4})-windscreen-wiper-blades$", h)
    if not m:
        return None
    name, y0, y1 = m.group(1), int(m.group(2)), int(m.group(3))
    try:
        desc = html.unescape(json.loads(path.read_text(encoding="utf8"))["collection"].get("description") or "")
    except (json.JSONDecodeError, KeyError):
        return None
    desc = desc.replace("”", '"').replace("″", '"').replace("''", '"')
    desc = re.sub(r"<[^>]+>", " ", desc)

    def size_for(word):
        # '26" wiper blade on the drivers side' or 'driver's side blade should be 24"'; never across , or .
        m = re.search(rf'(\d{{2}})\s*"[^",.]{{0,60}}?\b{word}', desc, re.I) or \
            re.search(rf'\b{word}[^",.]{{0,60}}?(\d{{2}})\s*"', desc, re.I)
        return int(m.group(1)) if m else None

    both = re.search(r'(\d{2})\s*"[^",.]{0,60}?\bboth\b[^",.]{0,30}?driver', desc, re.I)
    d, p = (int(both.group(1)),) * 2 if both else (size_for("driver"), size_for("passenger"))
    if not (d and p):
        return None
    rr = re.search(r'(\d{2})\s*"[^"]{0,40}?\brear\b', desc, re.I)
    return {"name": name, "y0": y0, "y1": y1, "driver": d, "passenger": p, "rear": int(rr.group(1)) if rr else None, "handle": h}


def uk_model_names(make, model):
    """UK names a Rain-X model can appear under -> whether any trailing words are allowed.

    The UK site groups premium cars by series (bmw-3-series-saloon, audi-a4-s4-rs4-avant,
    mercedes-benz-c-class-estate, lexus-rx-series-rx-450h) where Rain-X lists variants (328i, A4 Quattro, C300, RX350).
    """
    m, mk = model.lower().replace(" quattro", "").replace(" xdrive", ""), norm(make)
    out = {model: False}
    if mk == "bmw" and re.match(r"\d{3}", m):
        out[f"{m[0]}-series"] = True
    elif mk == "mercedesbenz" and re.match(r"[a-z]{1,3}\d{3}", m):
        cls = re.match(r"[a-z]+", m).group(0)
        out.update({f"{cls}-class": True, cls: True, f"{cls}-series": True})
    elif mk == "audi" and re.match(r"[as]\d", m):
        n = m[1]
        out.update({f"a{n}-s{n}-rs{n}": True, f"a{n}-s{n}": True, f"a{n}": True})
    elif mk == "audi" and re.match(r"s?q\d", m):
        n = m[m.index("q") + 1]
        out.update({f"q{n}-sq{n}-rsq{n}": True, f"q{n}-sq{n}": True, f"q{n}": False})
    elif mk == "lexus" and re.match(r"[a-z]{2}\s?\d{3}", m):
        out[f"{m[:2]}-series"] = True
    elif mk == "infiniti" and re.match(r"q", m):
        out[f"q-{m}"] = False
    elif mk == "mazda" and m.startswith("mx-5"):
        out["mx-5"] = False
    return out


def uk_matches(uk, make, model, year):
    if not (uk["y0"] <= year <= uk["y1"]):
        return False
    mk = MAKE_ALIASES.get(slug(make), norm(make))
    parts = uk["name"].split("-")
    names = uk_model_names(make, model)
    for i in range(1, len(parts)):
        if MAKE_ALIASES.get("-".join(parts[:i]), norm("".join(parts[:i]))) != mk:
            continue
        rest = parts[i:]
        # the model may span several words; what is left must be body-style words, unless the name is a series
        for j in range(1, len(rest) + 1):
            for name, any_tail in names.items():
                if norm("".join(rest[:j])) == norm(name) and (any_tail or all(w in BODY_WORDS for w in rest[j:])):
                    return True
    return False


# ---------- autofiles.com ----------

def load_autofiles():
    """-> {(make norm, model norm): {year: [rows]}} from data/raw/autofiles/<make>/<model>.json"""
    idx = {}
    for f in (RAW / "autofiles").glob("*/*.json"):
        try:
            rows = json.loads(f.read_text(encoding="utf8"))
        except json.JSONDecodeError:
            continue
        by_year = idx.setdefault((norm(f.parent.name), norm(f.stem)), {})
        for r in rows:
            by_year.setdefault(r["year"], []).append(r)
    return idx


def af_names(make, model):
    """Normalised autofiles slugs a Rain-X model can appear under (BMW 328i xDrive -> 328, Mazda 3 -> mazda3)."""
    m = re.sub(r"\s+(quattro|xdrive|awd|4matic)\b", "", model, flags=re.I)
    out = {norm(model), norm(m)}
    if norm(make) == "bmw":
        g = re.match(r"(\d{3})(?:i|d|is|li|e)?(\s+gt)?$", m, re.I)
        if g:
            out.add(g.group(1) + ("granturismo" if g.group(2) else ""))
    if norm(make) == "mazda" and re.fullmatch(r"\d", m.split()[0]):
        out.add("mazda" + m.split()[0])
    return out


# ---------- oximo.pl ----------

OX_MAKES = {"mercedes": "mercedesbenz", "vw": "volkswagen"}


def ox_year(date, start):
    # production dates -> model years: cars built from about April on are sold as next year's model
    y, m = int(date[:4]), int(date[5:7])
    return y + 1 if start and m >= 4 else y


def load_oximo():
    """-> {(make norm, model norm): [(first MY, last MY, driver, passenger, rear)]} from data/raw/oximo."""
    idx = {}
    for f in (RAW / "oximo").glob("*/*/*.json"):
        try:
            d = json.loads(f.read_text(encoding="utf8"))
        except json.JSONDecodeError:
            continue
        dates = re.findall(r"\d{4}-\d{2}-\d{2}", f.stem)
        if not (dates and d.get("driver_mm") and d.get("passenger_mm")):
            continue
        mk = OX_MAKES.get(f.parent.parent.name, norm(f.parent.parent.name))
        # model slugs carry noise: klasa-c-mercedes-benz, ram-1500-crew-cab, neon-dodge
        md = re.sub(r"^klasa-", "", f.parent.name)
        md = re.sub(rf"-({f.parent.parent.name}|(crew|extended|standard|extended-crew)-cab|cab-chasis)$", "", md)
        inch = lambda mm: round(mm / 25.4) if mm else None
        y1 = ox_year(dates[1], False) if len(dates) > 1 else max(YEARS)
        idx.setdefault((mk, norm(md)), []).append(
            (ox_year(dates[0], True), y1, inch(d["driver_mm"]), inch(d["passenger_mm"]), inch(d.get("rear_mm"))))
    return idx


def ox_names(make, model):
    """Normalised oximo model slugs a Rain-X model can appear under (C300 -> c, RX350 -> rx, 328i -> 3, A4 Quattro -> a4)."""
    out = af_names(make, model) | {norm(n) for n in uk_model_names(make, model)}
    m, mk = model.lower(), norm(make)
    if mk == "bmw" and re.match(r"\d{3}", m):
        out.add(m[0] + ("gt" if " gt" in m else "grancoupe" if "gran coupe" in m else ""))
    if mk in ("mercedesbenz", "lexus", "infiniti"):
        g = re.match(r"([a-z]{1,3})\d", m)
        if g:
            out.add(g.group(1))
    if mk == "ram":
        out.add("ram" + norm(m))
    return out


# ---------- manual checks ----------

def load_manual():
    if not MANUAL.exists():
        return []
    with MANUAL.open(encoding="utf8") as f:
        return [r for r in csv.DictReader(f) if r.get("make")]


def main():
    uk = [u for u in (parse_uk(p) for p in sorted((RAW / "uk_acp").glob("*.json"))) if u]
    uk_cache = {}

    def uk_for(make):
        if make not in uk_cache:
            prefixes = {slug(make)} | {k for k, v in MAKE_ALIASES.items() if v == norm(make)}
            uk_cache[make] = [u for u in uk if any(u["name"].startswith(p + "-") for p in prefixes)]
        return uk_cache[make]

    manual = load_manual()
    autofiles = load_autofiles()
    oximo = load_oximo()

    vehicles = []
    for f in sorted((RAW / "rainx").glob("*/*/*.json")):
        if f.parent.parent.name == "_models":
            continue
        make, model, year = f.parent.parent.name, f.parent.name, int(f.stem)
        if year not in YEARS or make in COMMERCIAL:
            continue
        if make == "Tesla" and len(model) == 1:  # Rain-X lists "3", people search "Model 3"
            model = f"Model {model}"
        rec = from_rainx(f)
        if not rec:
            continue
        driver, passenger, rear = sorted(rec["driver"]), sorted(rec["passenger"]), sorted(rec["rear"])

        # Each source votes for one (driver, passenger) pair; Rain-X only votes when it lists a single size per side.
        votes = []  # (source, (driver, passenger), rear or None, ref)
        if len(driver) == len(passenger) == 1:
            votes.append(("rainx", (driver[0], passenger[0]), rear[0] if len(rear) == 1 else None, None))

        twin = MODEL_TWINS.get((make, model))
        uk_make, uk_model = (twin[0], twin[1]) if twin and year >= twin[2] else (make, model)
        uk_hits = [u for u in uk_for(uk_make) if uk_matches(u, uk_make, uk_model, year)]
        if len({(u["driver"], u["passenger"]) for u in uk_hits}) == 1:  # body styles that disagree don't vote
            u = uk_hits[0]
            votes.append(("uk_acp", (u["driver"], u["passenger"]), u["rear"], u["handle"]))

        af = next((autofiles[(norm(make), n)][year] for n in af_names(make, model)
                   if year in autofiles.get((norm(make), n), {})), [])
        pairs = {(r["driver"], r["passenger"]) for r in af if r["driver"] and r["passenger"]}
        if len(pairs) == 1:  # trims that disagree don't vote
            rears = {r["rear"] for r in af}
            votes.append(("autofiles", pairs.pop(), rears.pop() if len(rears) == 1 else None,
                          f"https://autofiles.com/wipers/{slug(make)}/{slug(model)}/"))

        ox_make = "dodge" if make == "Ram" else norm(make)
        ox = [o for n in ox_names(make, model) for o in oximo.get((ox_make, n), []) + oximo.get((norm(make), n), [])
              if o[0] <= year <= o[1]]
        if len({(o[2], o[3]) for o in ox}) == 1:  # generations or body styles that disagree don't vote
            rears = {o[4] for o in ox}
            votes.append(("oximo", (ox[0][2], ox[0][3]), rears.pop() if len(rears) == 1 else None, "https://www.oximo.pl/en/wiper-car/"))

        domains = set()  # one vote per website, so a second hand-checked site can settle a tie
        for r in manual:
            dom = re.sub(r"^(www\.|cdn\.)", "", r["source_url"].split("/")[2])
            if (dom not in domains and norm(r["make"]) == norm(make) and norm(model) in {norm(x) for x in r["model"].split("|")}
                    and int(r["year_from"]) <= year <= int(r["year_to"])):
                votes.append(("manual" if not domains else "manual_extra", (int(r["driver"]), int(r["passenger"])),
                              int(r["rear"]) if r.get("rear", "").isdigit() else None, r["source_url"]))
                domains.add(dom)

        tally = {}
        for v in votes:
            tally.setdefault(v[1], []).append(v)
        best = max(tally.values(), key=len, default=[])
        verified = len(best) >= 2
        if verified:
            driver, passenger = [best[0][1][0]], [best[0][1][1]]
            if not any(v[0] == "rainx" for v in best):
                print(f"OVERRIDE rainx: {year} {make} {model} -> {driver}/{passenger} by {[v[0] for v in best]}")
        elif len(tally) > 1:
            print(f"CONFLICT {year} {make} {model}: " + ", ".join(f"{v[0]} {v[1]}" for v in votes))
        has_rainx = bool(driver and passenger)
        if not verified and not has_rainx:
            # Rain-X has no front sizes here (newer cars outside its silicone line): show the best US source, unverified
            if not votes:
                continue
            best = [min(votes, key=lambda v: US_FIRST.index(v[0]))]
            driver, passenger = [best[0][1][0]], [best[0][1][1]]
        agreeing = best if verified or not has_rainx else [("rainx", None, None, None)]
        sources = [v[0] for v in agreeing]
        refs = [v[3] for v in agreeing if v[3]]
        if not rear:  # Rain-X sometimes omits the rear blade; fall back to what the other sources say
            others = [v[2] for v in votes if v[2] is not None]
            if others:
                rear = [max(set(others), key=others.count)]
        rear_ok = sum(1 for v in votes if v[2] is not None and [v[2]] == rear) >= 2

        front_arm = (rec["arms"].get("driver") or rec["arms"].get("passenger")
                     or next((r["attach"] for r in af if r.get("attach")), None))
        vehicles.append({
            "make": make, "makeSlug": slug(make),
            "model": model, "modelSlug": slug(model),
            "year": year,
            # sorted lists: more than one value means body styles differ (e.g. sedan vs coupe)
            "driver": driver, "passenger": passenger, "rear": rear,
            "connector": connector(front_arm),
            "armType": front_arm,
            "rearArmType": rec["arms"].get("rear"),
            "sources": sources,
            "refs": refs,
            "verified": verified,
            "rearVerified": rear_ok,
        })

    # Rain-X lists some makes under two spellings (Infiniti / INFINITI): keep one name and one record per year
    from collections import Counter
    names = Counter(v["make"] for v in vehicles)
    canon = {}
    for v in vehicles:
        best = canon.get(v["makeSlug"])
        if best is None or names[v["make"]] > names[best]:
            canon[v["makeSlug"]] = v["make"]
    seen, unique = set(), []
    for v in sorted(vehicles, key=lambda v: not v["verified"]):
        key = (v["makeSlug"], v["modelSlug"], v["year"])
        if key not in seen:
            seen.add(key)
            unique.append({**v, "make": canon[v["makeSlug"]]})
    vehicles = sorted(unique, key=lambda v: (v["makeSlug"], v["modelSlug"], v["year"]))

    assert all(8 <= s <= 40 for v in vehicles for p in ("driver", "passenger", "rear") for s in v[p]), "size out of range"
    OUT.write_text(json.dumps(vehicles, indent=1), encoding="utf8")
    ok = sum(v["verified"] for v in vehicles)
    print(f"{len(vehicles)} vehicle-years, {ok} verified ({ok * 100 // max(1, len(vehicles))}%), UK entries parsed: {len(uk)}")


if __name__ == "__main__":
    main()
