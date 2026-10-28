export const SITE = {
  name: "WiperBladesSize",
  url: "https://wiperbladessize.com",
  // Amazon Associates tag goes here once the account is approved; links work without it.
  amazonTag: "",
};

// Launch phase (owner's call, 2026-10-28): only the home page and the section hubs are indexed. Every other page inherits
// noindex, follow from the root layout. To release a page type, give it robots: { index: true, follow: true } and add it to the sitemap.
export const INDEXED = ["/", "/makes/", "/wiper-blade-size-chart/", "/sizes/", "/connectors/", "/guides/"];
export const INDEX = { index: true, follow: true };
export const NOINDEX = { index: false, follow: true };
