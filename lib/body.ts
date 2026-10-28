export type Body = "sedan" | "hatch" | "coupe" | "suv" | "pickup" | "minivan" | "van" | "truck";

export const BODY_NAME: Record<Body, string> = {
  sedan: "Sedan",
  hatch: "Hatchback or wagon",
  coupe: "Coupe or convertible",
  suv: "SUV or crossover",
  pickup: "Pickup truck",
  minivan: "Minivan",
  van: "Van",
  truck: "Commercial truck",
};

// Checked in order against "Make Model"; the first match wins and anything left is a sedan.
// Models sold in more than one body style get the most common one.
const RULES: [Body, RegExp][] = [
  ["truck", /F-[67]50|W[45]500|Tiltmaster|Forward|Volvo V[HNT]|Silverado [456]500/],
  ["van", /Express|Savana|\bE-\d|Transit|Sprinter|ProMaster|\bNV\d|BrightDrop/],
  ["minivan", /Sienna|Odyssey|Caravan|Town & Country|Pacifica|Voyager|Sedona|Carnival|Quest|Routan|Entourage|Mazda 5$|Orlando|Rondo/],
  ["pickup", /F-\d50|Ranger|Maverick|Silverado|Sierra|Colorado|Canyon|Tacoma|Tundra|Frontier|TITAN|Ram \d|Dakota|Gladiator|Ridgeline|Santa Cruz|Avalanche|EXT|Sport Trac|H3T|Equator|Mazda B\d/],
  [
    "suv",
    /4Runner|MDX|RDX|ADX|Highlander|RAV4|Sequoia|Land Cruiser|FJ Cruiser|Venza|C-HR|Corolla Cross|Crown Signia|bZ4X|CR-V|HR-V|Pilot|Passport|Element|Crosstour|Explorer|Expedition|Escape|Edge|Bronco|EcoSport|Flex|Mach-E|Utility|Tahoe|Suburban|Equinox|Traverse|Trailblazer|Trax|Blazer|Captiva|Yukon|Acadia|Terrain|Enclave|Encore|Envision|Escalade|ESCALADE|XT[456]|SRX|VISTIQ|Navigator|Aviator|Nautilus|Corsair|MK[CTX]|Cherokee|Wrangler|Compass|Renegade|Patriot|Liberty|Commander|Wagoneer|Durango|Journey|Nitro|Hornet|Santa Fe|Tucson|Palisade|Kona|Venue|Veracruz|Nexo|Ioniq 5|Telluride|Sorento|Sportage|Seltos|Niro|Borrego|EV[69]|Outback|Forester|Crosstrek|Ascent|Tribeca|Solterra|Rogue|Murano|Pathfinder|Armada|Kicks|Juke|Qashqai|Xterra|ARIYA|Outlander|Eclipse Cross|Endeavor|RVR|CX-|Tribute|Tiguan|Atlas|Touareg|Taos|Countryman|\bS?Q[2-8]\b|Audi e-tron(?! GT)|Q\d e-tron|\bX[1-7]\b|XB7|\bGL[ABCEKS]?\d|\bML\d|\bG(500|550|580|55|63|65)\b|\bR350|\b[RNUGLT]X\d|\bRZ\d|\bQX\d|\bFX\d|EX3[57]|JX|\bGV\d|\bXC\d|EX[34]0|EC40|Volvo C40|[EFI]-Pace|Discovery|LR[24]|Range Rover|Bentayga|Levante|Grecale|Stelvio|Tonale|Cayenne|Macan|Eletre|Model Y|\bVF\d|Vue|Mariner|Mountaineer|Grand Vitara|H3|Lexus TX/,
  ],
  [
    "coupe",
    /Corvette|Camaro|Mustang|Challenger|Viper|\b86\b|BRZ|FR-S|Supra|MX-5|RX-8|Spider|F-Type|\bXK|\bR8|\bTT|Z4|\bi8|\bM[2468]\b|\b[2468]\d\di|M[28]\d\di|GR86|Gran Coupe|Alpina B6|1 Series M|AMG GT|\bSL|\bCL\d|Ferrari|Lamborghini|Aston Martin|Wraith|Dawn|Bentley Continental|911|Boxster|Cayman|Coupe|Koup|CR-Z|\btC\b|Eclipse$|Sky|\bLC5|\bRC|SC430|Q60|Cascada|C70|Eos|LFA|NSX|370Z| Z$|GT-R/,
  ],
  [
    "hatch",
    /Fit$|C-Max|GR Corolla|Yaris$|Prius|Golf|GTI|Fiesta|Focus|Sonic|Spark|Aveo5|HHR|Bolt|Volt|LEAF|Versa Note|Micra|Cube|Soul|Rio5|Forte5|Cooper|Fiat 500|Mazda 2$|Mazda 3 Sport|Matrix|Vibe|\biM\b|\bx[BD]\b|\biQ\b|Fortwo|Elantra GT|Veloster|Ioniq$|Mirage$|\bi3|CT200h|Volvo C30|Volvo V\d|Sportback|allroad|i-MiEV|\bB(200|250| Electric)|Caliber|PT Cruiser|Beetle|SX4/,
  ],
];

export const bodyOf = (make: string, model: string): Body =>
  RULES.find(([, re]) => re.test(`${make} ${model}`))?.[0] ?? "sedan";
