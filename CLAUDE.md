# wiperbladessize.com: project context

Read this first in every new chat. **Keep it current:** whenever something new is added or decided (a page, a data source, a design change, a plan change), update the matching section here and add a line to the changelog at the bottom.

The owner talks in Roman Urdu and wants short replies with few tool calls.

## What the site is

A lookup site for wiper blade sizes. The user picks Year, Make and Model and gets the driver, passenger and rear blade sizes, plus the connector type and buy links.

- **Domain:** wiperbladessize.com (double "s"). wiperbladesize.com is someone else's, so some type-in traffic will leak there.
- **Market:** US first, then Canada and Australia. The UK has strong retailers, so it comes later or never.
- **Scope:** top 20 brands, model years 2010–2026.
- **Deadline:** launch before January, because wiper sales peak from November to February.
- **Money:** Amazon Associates links on every vehicle page, then display ads (Ezoic or Journey first, Mediavine or Raptive later). For Australia, UNIWIPER at 15%; for the UK, wiperblades.co.uk on Awin.
- **Competitor:** wiperfinder.com (strongest: 9,895 car URLs back to 1926, year-range pages like `/wiper-size/toyota/rav4/2019` with single years redirecting to the range, blade brand pages, 94 "X vs Y" compare pages and a "best for snow and ice" ranking built from counted Reddit/forum owner reports). CarPartSizes, a new free US lookup that launched on Product Hunt. Bosch, Rain-X and AutoZone lookups run on JS, so they don't rank for "2020 rav4 wiper size" type queries. That is the gap.
- **Later expansion:** headlight bulb, tire and battery sizes, using the same structure with new data.

## Stack

- Next.js 16 with `output: "export"` and `trailingSlash: true`. React 19, TypeScript, **plain CSS** (no Tailwind).
- Hosting: **Cloudflare Workers (static assets)**, project `wiperbladessize-com`, built from GitHub. Build command `npm run build`, deploy command `npx wrangler deploy`; `wrangler.jsonc` points assets at `out/` with `auto-trailing-slash` and `404-page`.
- **File limit:** a free Workers deploy takes at most 20,000 files. `next build` writes ~34k (4 RSC `.txt` payloads per page), so `npm run build` runs `_tools/strip_rsc.mjs` afterwards, which deletes every `.txt` in `out/` except `robots.txt` (leaves ~6.9k files). Links still work and fall back to full page loads. If the page count grows past ~19k files, move to the $5 Workers plan (100k files) instead of stripping more.
- Repo: https://github.com/Asharahmd/WiperBladesSize.com (branch `main`). Commit as `git -c user.name=Asharahmd -c user.email=321442295+Asharahmd@users.noreply.github.com commit ...`.
- This Next version has breaking changes. Read `node_modules/next/dist/docs/` before using an API you are unsure of. Page props use the global `PageProps<"/route">` and `params` is a Promise.
- Commands:
  - `npm run dev` starts the dev server (http://localhost:3000).
  - `npm run build` writes the static site to `out/` and strips the RSC `.txt` files.
  - `python _tools/fetch_rainx.py` fetches raw data. It is resumable and skips files it already has.
  - `npm run data` (or `python _tools/build_data.py`) rebuilds `data/vehicles.json`.

## Files

| Path | What it is |
|---|---|
| `lib/data.ts` | Loads `data/vehicles.json` and holds all helpers: `runs()` groups consecutive years with the same sizes, `sizeIndex()`, `amazonUrl()`, the `CONNECTORS` text, `connName()` and `mm()` |
| `lib/site.ts` | Site name, URL and `amazonTag` (empty until Associates is approved) |
| `components/ui.tsx` | Icons (inline SVG, no emoji), `Crumbs`, `JsonLd`, `Figure` (local image in a figure, lazy unless `preload`), `Gauge` (the size boxes: Driver, Passenger and Rear only when a rear size exists, each with a to-scale bar) |
| `components/Chrome.tsx` | Header and Footer |
| `components/Finder.tsx` | Client-side Year → Make → Model finder, built from an index made on the home page |
| `lib/products.ts` | Product lines and `bladeTabs()`, which builds the picker tabs and cards on the server. No prices (Amazon rules); real product photos need PA-API after Associates approval |
| `components/BladePicker.tsx` | Client tabs and product cards on the year page; blade art is inline SVG drawn to scale |
| `lib/body.ts` | `bodyOf(make, model)` maps every model to one of 8 body types with ordered regex rules (default sedan). Check new models land in the right group |
| `components/CarIcon.tsx` | Side-view SVG per body type, used in the "Your vehicle" bar |
| `components/TextPage.tsx` | Wrapper for simple text pages |
| `lib/guides.tsx` | Guide content (slug, title, h1, description, `cover` + `coverAlt`, JSX body with inline `Figure`s). Add a guide by adding an entry; index, page, sitemap and nav pick it up |
| `public/images/` | 25 WebP images (spec in `IMAGES.md`). `next.config.ts` sets `images: { unoptimized: true }` for the static export; use `next/image` with real width/height, and `preload` (not the deprecated `priority`) above the fold |
| `app/globals.css` | Every design token is on `:root`. Use tokens, never literal colors |
| `_tools/` | Python data scripts |
| `data/raw/<source>/<Make>/<Model>/<year>.json` | Raw source responses, never edited by hand |
| `data/vehicles.json` | Generated file. Don't hand-edit it; change the scripts instead |

## Routes

| Route | Page |
|---|---|
| `/` | **Main SEO target.** H1 "What size windshield wipers do I need?", finder, then: popular vehicles table, most common size pairs, sizes by vehicle type, three ways to find your size, buying the right blade (3 image cards), how to install (photo section + connector tiles), types of wiper blades (photo section, 6 tiles), where to buy (Amazon, parts stores, big-box; names only, no retailer logos), browse by make, how we check sizes (live counts), guides, FAQ (FAQPage + WebSite schema). Every number is computed from verified data at build time |
| `/[make]/` | Models for a make, showing the newest year's sizes |
| `/[make]/[model]/` | Table of runs (model years that share sizes) and a year grid |
| `/[make]/[model]/[year]/` | **Money page:** "Your vehicle" bar (body-type car icon, name, Sizes verified / 1 source badge, Change vehicle → `/#finder`), answer sentence, size boxes ("Your wiper sizes"), verification status, facts (connector, same-size years, blades to buy), `BladePicker` tabs (front & rear sets, front pairs, rear blade) with product cards: blade drawing, Key features and Sizes dropdowns, Amazon search buttons (Bosch ICON, Rain-X Latitude, Michelin Stealth Ultra, Rain-X Weatherbeater; rear: Bosch, Rain-X, Trico), replacement steps, sizes-by-year table, FAQ with FAQPage and BreadcrumbList schema, aside with other years and same-size cars |
| `/sizes/` and `/sizes/[n]-inch/` | Reverse lookup: which cars take a given blade length |
| `/wiper-blade-size-chart/` | Every vehicle in one table, aimed at the head term |
| `/makes/`, `/connectors/` | Indexes |
| `/guides/` and `/guides/[slug]/` | 6 guides: measure, change by connector, beam vs conventional vs hybrid, how often to replace, winter, rear. Article schema. Linked from header, footer and every year page |
| `/about/`, `/methodology/`, `/affiliate-disclosure/`, `/privacy/`, `/contact/` | Trust pages. The contact email hello@wiperbladessize.com does **not exist yet** |
| `robots.ts`, `sitemap.ts` | The sitemap lists only the `INDEXED` paths from `lib/site.ts` |

## Indexing (launch phase, owner's call 2026-10-28)

- Only the home page and the section hubs are indexed: `/`, `/makes/`, `/wiper-blade-size-chart/`, `/sizes/`, `/connectors/`, `/guides/` (the `INDEXED` list in `lib/site.ts`).
- The root layout sets `noindex, follow`; those pages opt back in with `robots: INDEX`. Make, model, year and size pages set `robots: NOINDEX` explicitly: in this Next version a `robots: undefined` key wipes the layout default and leaves no robots tag at all (found in the 2026-10-28 build). Make, model, year, size, guide and trust pages are all noindex for now.
- To release vehicle pages later (in batches, verified only), change their `robots` to `INDEX` when `verified` and add them to the sitemap.
- Home keyword targets, from findmywipers.com's Ahrefs data (their home ranks #1–2 with ~417 words): "what size windshield wipers do i need" (10K), "what windshield wipers do i need" (2.8K), "wiper blade size" (2.6K), "wiper blade size finder" (1.5K), "wipers for my car" (1.2K).

## Data rules (most important)

- The owner chose to **verify with free sources** and, where a source is missing, to **research manually**. PCFitment's paid CSV is the fallback.
- **Voting:** each source votes for one (driver, passenger) pair per vehicle-year. A pair with **two or more votes** is published as `verified: true`, even when it overrides Rain-X (the script prints `OVERRIDE`). With no agreement, the page shows Rain-X's sizes, renders `noindex, follow` and stays out of the sitemap (the script prints `CONFLICT`).
- `rearVerified` is true only when two sources state the same rear size. Otherwise the page warns that the rear size comes from one source. When Rain-X has no rear blade, the most common rear size from the other sources is shown instead.
- Pipeline: `python _tools/fetch_rainx.py` → `python _tools/fetch_uk.py` → `python _tools/fetch_autofiles.py` → `python _tools/fetch_oximo.py` → append rows to `data/manual/checks.csv` → `python _tools/build_data.py` → `data/vehicles.json`. Logs go to `_tools/*.log`. Every fetcher is resumable and skips files it already has.

### Source 1: Rain-X (US base list, `data/raw/rainx/`)
- **Endpoint:** `GET https://www.rainx.com/wp-json/rainxapi/v1/productSearchSiliconSize/{year}/{Make}/{Model}/all`, which returns `globalSize[]` with `position`, `size` and `arm_type`.
- **Lists:** makes come from `getMakesAjax/{year}/Make`, models from `getModels/{year}/{Make}/x`. Model lists are cached in `data/raw/rainx/_models/`.
- **Spaces** in make or model names are sent as `---`, which is what Rain-X's own JS does (`Grand---Cherokee`).
- **Load:** 4 worker threads. With 6, the server started dropping connections. Failed requests are not written, so a rerun retries them.
- **Data quirks:**
  - Tesla models come as `3`, `S`, `Y`; the build renames them to `Model 3` etc. (URL `/tesla/model-3/`). Manual rows list both names (`Model 3|3`).
  - Rear blades are sometimes missing, so a missing rear shows "Not listed".
  - Rears look like `12-A`; the letter is Rain-X's arm code.
  - Some years list two lengths for one position. These don't vote, and the page shows both lengths.
  - Makes appear in two spellings (Infiniti and INFINITI). The build merges them by slug and keeps one record per year.
  - Commercial makes (IC Corporation, UD and others) are skipped.

### Source 2: wiperblades.co.uk (UK, `data/raw/uk_acp/`)
- **Data:** the public Shopify `/collections/<handle>.json` for each vehicle collection in the sitemap (about 2,528 handles). The description text reads like 'requires a 26" … drivers side … 16" … passengers side … Standard Hook'. `parse_uk()` reads about 94% of them; the rest are single-wiper or UK-only cars.
- **Same company:** windscreenwipers.co.uk is the **same company** (All Car Parts Ltd), so it does **not** count as a separate source and isn't fetched.
- **Name matching:**
  - Twins: `MODEL_TWINS` maps US names to their UK names (Rogue → X-Trail, Escape → Kuga, Buick Encore → Vauxhall Mokka, and so on).
  - Series names: `uk_model_names()` maps premium variants to UK series names (BMW 328i → 3-series, Mercedes C300 → c-class, Audi A4 Quattro → a4-s4-rs4, Lexus RX350 → rx-series).
  - Body styles: if UK body styles disagree on sizes, that vehicle gets no UK vote.
- **Limits:** UK cars can differ from US cars (the Euro Accord, for example). This is safe because a UK value only counts when it matches another source.

### Source 3: autofiles.com (US, `data/raw/autofiles/`)
- **Data:** static pages at `/wipers/<make>/<model>/` that list every year as "2012 Nissan Altima | Driver - 28 inch | Passenger - 17 inch | Rear - 12 inch | Attach - Hook (9x3)". robots.txt allows these pages and there is no Cloudflare challenge. `fetch_autofiles.py` saves the parsed rows (not the HTML) as JSON, using 2 workers with a 1 s delay.
- **Matching:** Rain-X vehicles are matched on `norm(make)` + `norm(model)` against the page slugs. Trims within one year that disagree don't vote.
- **Coverage:** this is the best US tie-breaker for ±1" disagreements between Rain-X and AutoPadre. It covers years up to about 2022.

### Source 5: oximo.pl (Polish wiper maker, `data/raw/oximo/`)
- **Data:** generation pages `/en/wiper-car/<make>/<model>/<variant>/` read 'Driver side: WUS600 / Passenger side: WUS350' (the digits are mm) and 'Rear: 350 mm'. The variant slug ends with production dates. URLs come from the `car_models-sitemap*.xml` files; robots.txt allows them. 3 workers, 1 s delay. All 3,079 pages fetched (2026-10-27). Removed pages are saved empty so reruns skip them.
- Independent of the UK and US sources. Mostly European-market data, so like the UK source it only counts when it matches another source.

### Source 4: manual checks (`data/manual/checks.csv`)
- **Columns:** `make,model,year_from,year_to,driver,passenger,rear,source_url,note`.
- **One vote per website:** each distinct `source_url` domain votes separately. The first site is labelled `manual`, any further site `manual_extra`. So a second independent site (YouCanIC, an OEM parts catalog such as hondapartsnow.com, notateslaapp) can settle a tie with AutoPadre. eBay, Walmart and other seller listings are not used. `model` can list several names separated by `|` (for example `328i|328i xDrive`). Names must match Rain-X names; the match ignores case, spaces and punctuation.
- **How to research:** run WebSearch with `allowed_domains: ["autopadre.com"]` and the query "<Make> <Model> wiper size driver passenger rear". It returns AutoPadre's generation table. Record only the ranges it states clearly, and never infer a range (an unsourced F-350 row was removed for this reason).
- autopadre.com is behind a Cloudflare challenge, so never fetch it directly; only search snippets are used.
- **Already researched (2026-10-25):**
  - Toyota: Tacoma, Tundra, Camry, RAV4, Sienna, Highlander, 4Runner, Corolla, Prius, Sequoia, Avalon, C-HR, Venza
  - Honda: Accord, Civic, CR-V, Odyssey, Pilot, HR-V, Ridgeline, Fit
  - Ford: F-150, F-250 SD, Explorer, Escape, Edge, Expedition, Fusion, Ranger, Mustang, Bronco Sport, Focus, Fiesta, Flex, Taurus, Maverick, EcoSport
  - Chevrolet: Silverado 1500/2500 HD, Equinox, Tahoe, Traverse, Malibu, Colorado, Suburban, Cruze, Impala, Trax, Blazer, Camaro, Spark, Sonic, Trailblazer, Bolt
  - GMC: Sierra 1500, Yukon, Acadia, Terrain, Canyon
  - Nissan: Altima, Sentra, Pathfinder, Frontier, Rogue, Rogue Sport, Murano, Titan, Versa, Maxima, Armada, Kicks, Leaf, 370Z
  - Jeep: Grand Cherokee, Wrangler, Cherokee, Compass, Gladiator, Renegade
  - Ram and Dodge: Ram 1500/2500, Charger, Challenger, Grand Caravan, Durango, Journey
  - Hyundai: Elantra, Sonata, Santa Fe, Tucson, Palisade, Kona, Accent, Veloster, Venue, Ioniq
  - Kia: Telluride, Sorento, Sportage, Forte, Soul, K5, Optima, Sedona, Carnival, Niro, Seltos, Stinger
  - Subaru: Outback, Forester, Crosstrek, Impreza, Ascent
  - Tesla Model 3; Mazda CX-5, CX-9
  - Buick: Enclave, Encore, Envision
  - Lexus: RX, ES, NX, GX
  - Chrysler: Pacifica, 300
  - VW: Passat, Jetta, Tiguan, Atlas
  - Acura: MDX, RDX, TLX, ILX
  - Cadillac: XT4, XT5, XT6, Escalade, CTS, ATS, SRX, CT5
  - Lincoln: Navigator, Aviator, Nautilus, Corsair, MKZ, MKC, MKX
  - INFINITI: QX60, QX80, G37, Q50, QX56, FX35, EX35, JX35
  - Mitsubishi Outlander Sport
  - BMW: 328i, 330i, X3, X5
  - Mercedes: C300, GLC300, GLE, GLS
  - Audi: A4, Q5, Q7
  - Added 2026-10-26: F-350/F-450 SD, E-350/E-450 SD (2015+), Yaris 2019–2020, Forte5, Rondo, Passport, Yukon XL, C-Max, Santa Fe XL 2019, Santa Cruz 2022, Ram 3500 2011, Ram 5500, Silverado/Sierra 3500 HD 2023–24, LS500, IS350 2022–23, LX570, Caprice, NV1500, TLX (YouCanIC), Elantra GT 2018–19, HR-V 2023 (OEM catalog).
  - Searched with no usable answer (don't repeat): Atlas Cross Sport, Corolla Cross, Grand Cherokee L, Kona Electric, Mach-E, GR Supra, Acura RLX, F-550, Express 2500/3500, NV2500/3500, Ram 4500, Chrysler Voyager 2020+.

- **Tie-breaks done:** Acura TSX; Buick Verano; Transit Connect; Insight; Prius C; Rogue / Rogue Select; Land Cruiser; Santa Fe Sport; GLK350; BMW 530i.
- **Still conflicting (need a source that settles them):** Acura TL; Kia Forte, Forte5 2016–2018 and Forte Koup 2014–2016; Nissan Versa 2011–2019; Mirage and Mirage G4; Elantra 2011–2016 and Elantra GT 2013–2017; BMW 328i and 540i; Explorer 2024+ (the UK match is the EV, a different car); Bronco Sport (Rain-X 24, AutoPadre 22); Santa Cruz (Rain-X 26, AutoPadre 24); Ram 5500 2020+; and 2023+ Grand Cherokee, HR-V 2024+, Pathfinder, Prius, RX350, QX60, where the UK car differs. For the current list, run `python _tools/build_data.py | grep CONFLICT`.

### Blocked or rejected sources (don't retry)
- **Trico:** the finder needs a form_key POST, which auto-mode blocked as bot-check circumvention.
- **Meijer-hosted Trico 2020 PDF:** returns 403.
- **autopadre.com and wiperbladesusa.com direct:** Cloudflare challenge. Use them only through search snippets.
- **Bosch:** boschwiperblades.com only has UK and EU markets and needs a token.
- **wiperfinder.com (checked 2026-10-28):** a direct US competitor, not a source. It aggregates "published blade fitment data" (likely the same Rain-X/Trico lists), so a vote from it would not be independent, and copying a competitor's database is off limits. Use it for ideas only.

## Design

- **Inspiration:** wiperblades.co.uk and windscreenwipers.co.uk, which the owner likes. Both use a navy base (#031B3F), a cyan highlight, a yellow accent, a vehicle finder at the top and a trust row.
- **Our version:** navy `--navy #0a2240` with an amber CTA `--accent #ffc21a` (navy text on it) and a teal link color `--link #0a6f80`. Light theme only, because people look this up in daylight in a parking lot or a store.
- **Fonts:** Barlow for headings and numbers (road-sign feel), Figtree for body text.
- **Signature:** the `Gauge` size boxes (big inch number, mm under it, a bar drawn to scale against 32"). The owner asked for boxes on 2026-10-28; the rear box is hidden when no rear size is listed.
- Design rules come from the impeccable, hallmark, ui-ux-pro-max and ponytail skills:
  - tokens only
  - no `transition: all`
  - `:focus-visible` on every control
  - a reduced-motion fallback
  - `overflow-x: clip` on html and body
  - no eyebrow labels, no emoji icons, no invented stats or testimonials
  - 44px or larger touch targets
  - the smallest code that does the job
- **Writing:** plain, specific sentences (humanizer rules). Avoid "not X but Y", one-line closers and filler.

## Not done yet / next steps

1. Fetches are done (2026-10-26). Keep researching the models that are still unverified, mainly by finding second US sites for the conflicts listed above (run `build_data.py` and read the CONFLICT lines plus the unverified list).
3. Amazon Associates: add the tag in `lib/site.ts`, then map sizes to real ASINs (about 20 sizes × 3–4 brands).
4. Guides: 6 done. Ideas from wiperfinder.com still to build: blade compare pages ("Bosch ICON vs Rain-X Latitude") and a "best wiper blades for snow and ice" page, both based on owner reports counted from Reddit (Arctic Shift API, see the reddit.py tool in cicadacoffeebar-content/_tools) with real counts only; blade brand pages; single-blade Amazon buttons (driver only, passenger only).
5. Create the contact email, finish the Cloudflare Workers deploy (connect the GitHub repo), add the domain and Search Console. The git repo is done.
6. Launch in batches of verified pages, not thousands at once.

## Changelog

- 2026-10-28: Cloudflare Workers deploy setup: `wrangler.jsonc`, and `_tools/strip_rsc.mjs` in the build script to get under the 20k-file limit (34,358 → 6,914 files).

- 2026-10-28: Home gets three sections modelled on findmywipers.com: How to install (full-width photo, connector tiles moved here), Types of wiper blades (photo, 6 tiles) and Where to buy. `.photo` sections take the image through a `--bg` CSS variable. Silicone section added to the blade types guide.

- 2026-10-28: Project pushed to github.com/Asharahmd/WiperBladesSize.com as Asharahmd (13,182 files, including data/raw).

- 2026-10-28: Owner's 25 images wired in: hero photo under a navy wash, default share image (og + twitter large card), home cards and connector tiles, connector page figures (alt text in `CONNECTORS`), guide covers (top of page, tiles, share image, Article schema) and 9 inline guide figures. The images are AI illustrations: don't call the top-lock picture "the GM arm", and don't use the measuring photo as a reading of a real length.

- 2026-10-28: Launch indexing: only home and section hubs indexed, everything else noindex, follow (see Indexing). Home page expanded with data-driven sections and FAQ, retargeted at "what size windshield wipers do i need". Hero sample bars moved to the `.size-bar` style.

- 2026-10-28: Size gauge rebuilt as boxes (owner's request). `IMAGES.md` lists the 25 images the owner will make (site-wide, home, connectors, guides) with paths under `public/images/`; wire them in once the files arrive.

- 2026-10-28: oximo.pl documented as source 5 (rebuild: 5850 vehicle-years, 4180 verified, 71%). Six guides under `/guides/` linked from nav, footer, sitemap and year pages. Year pages now say what the old blade should measure in inches and mm. wiperfinder.com reviewed: ideas only, no data taken. Build passes.

- 2026-10-26: "Your vehicle" bar with body-type car icons on year pages. No "guaranteed to fit" claim; the badge follows `verified`. Real car photos (Wikimedia, credited) planned for top models after launch.
- 2026-10-26: Year page buy section replaced by `BladePicker` (tabs + product cards, like wiperblades.co.uk). Data rebuild now shows 5820 vehicle-years, 3810 verified (65%).
- 2026-10-26: All fetches finished. Manual research batch 2 (see list above), one vote per website in manual checks, Tesla renamed to Model 3/S/Y. Verified went from 3554 to 3686 of 5348 (68%). Site build passes.
- 2026-10-25: Full data pipeline: Rain-X for all makes, wiperblades.co.uk as a second source, manual AutoPadre checks, voting merge. Methodology page and source labels made accurate.
- 2026-10-25: Project created. Plan, seed data (Rain-X, 240 vehicle-years), all routes, navy and amber design. Moved to `C:\Users\fuf\Downloads\wiperbladessize`.
