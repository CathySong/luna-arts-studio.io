// Google Review AI Generator — Luna Art Studio

export const GOOGLE_MAPS_PLACE_URL =
  "https://www.google.com/maps/place/Luna+Art+Studio/@40.6402417,-74.8187645,11z/data=!4m10!1m2!2m1!1sluna+art+studio!3m6!1s0x89c3bd22b8364165:0xa7c7a6c28adcc289!8m2!3d40.6402417!4d-74.5138939!15sCg9sdW5hIGFydCBzdHVkaW9aESIPbHVuYSBhcnQgc3R1ZGlvkgEKYXJ0X2NlbnRlcpoBRENpOURRVWxSUVVOdlpFTm9kSGxqUmpsdlQyNUNTVTVGU2paalJtTjBXa2RTZDFWWE9VeE9WbEpJVTBSa1ZsUlZSUkFC4AEA-gEFCLABEEA!16s%2Fg%2F11zfnqn0z_?entry=ttu&g_ep=EgoyMDI2MDgwMy4wIKXMDSoASAFQAw%3D%3D";

export const STUDIO_INFO = {
  name: "Luna Art Studio",
  address: "258 King George Rd, 2nd Floor, Warren, NJ 07059",
  locality: "Warren, NJ",
  region: "New Jersey",
} as const;

/** Experience options that steer SEO / GEO keywords into the review */
export const reviewExperienceOptions = [
  {
    id: "creative",
    label: "Creative Class",
    labelZh: "创意课",
    keywords: [
      "creative art class",
      "kids art class Warren NJ",
      "mixed media art class",
      "art studio for children",
    ],
  },
  {
    id: "drawing",
    label: "Drawing Class",
    labelZh: "素描课",
    keywords: [
      "drawing class Warren NJ",
      "sketching lessons",
      "fine art drawing class",
      "art lessons for kids and adults",
    ],
  },
  {
    id: "oil-painting",
    label: "Oil Painting",
    labelZh: "油画课",
    keywords: [
      "oil painting class Warren NJ",
      "oil painting lessons New Jersey",
      "beginner oil painting class",
      "fine art painting studio",
    ],
  },
  {
    id: "handcraft",
    label: "Handcraft Class",
    labelZh: "手工课",
    keywords: [
      "handcraft class Warren NJ",
      "sewing and fiber arts class",
      "hands-on art workshop",
      "craft class for kids",
    ],
  },
  {
    id: "summer-camp",
    label: "Summer Art Camp",
    labelZh: "暑期艺术营",
    keywords: [
      "summer art camp Warren NJ",
      "kids art camp New Jersey",
      "summer creative camp",
      "art day camp for children",
    ],
  },
  {
    id: "general",
    label: "Studio Visit / Other",
    labelZh: "到访 / 其他",
    keywords: [
      "art studio Warren NJ",
      "best art classes near Warren",
      "fine art studio New Jersey",
      "art lessons near me",
    ],
  },
] as const;

export type ReviewExperienceId =
  (typeof reviewExperienceOptions)[number]["id"];

export type ReviewLanguage = "en" | "zh" | "bilingual";

/** Local / GEO phrases to weave in naturally (not spam) */
export const geoKeywordPool = [
  "Luna Art Studio",
  "Warren NJ",
  "Warren New Jersey",
  "art classes in Warren",
  "art studio near Bridgewater",
  "Somerset County art classes",
  "kids art classes New Jersey",
  "fine art classes NJ",
] as const;
