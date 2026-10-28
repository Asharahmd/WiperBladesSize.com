# wiperbladessize.com

Wiper blade sizes by year, make and model. Next.js static export, deployed to Cloudflare Pages.

## Commands

```
python _tools/fetch_rainx.py   # pull raw source data into data/raw/rainx (skips files already fetched)
npm run data                   # merge data/raw into data/vehicles.json
npm run dev                    # local dev server
npm run build                  # static site in out/
```

Cloudflare Pages settings: build command `npm run build`, output directory `out`.

## Data rules

- Each source keeps its raw responses under `data/raw/<source>/`. `_tools/build_data.py` turns them into `data/vehicles.json`.
- A vehicle-year is `verified` only when two independent sources agree on driver, passenger and rear sizes.
- Unverified pages render with `noindex` and stay out of the sitemap.

## Routes

| Route | Page |
|---|---|
| `/` | Finder, popular vehicles, makes |
| `/[make]/` | Models for a make |
| `/[make]/[model]/` | Sizes for every year, grouped into runs of identical sizes |
| `/[make]/[model]/[year]/` | Main page: gauge, buy links, steps, FAQ schema |
| `/sizes/[n]-inch/` | Reverse lookup: cars that take a blade length |
| `/wiper-blade-size-chart/` | Every vehicle in one table |
| `/connectors/` | Connector types |
