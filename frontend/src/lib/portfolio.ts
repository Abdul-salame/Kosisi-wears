export type PortfolioCategory = "Club Kits" | "Corporate" | "Events";

export type PortfolioPiece = {
  id: string;
  title: string;
  category: PortfolioCategory;
  image: string;
  blurb: string;
};

/**
 * Showcase-only gallery of custom work produced for real clubs, companies, and events.
 * These pieces carry a client's own crest/branding and are NOT sold directly — they exist
 * to demonstrate range and craftsmanship. The CTA on this page routes to /contact so a
 * visitor can inquire about a similar custom commission.
 */
export const portfolio: PortfolioPiece[] = [
  {
    id: "hooped-trio",
    title: "Hooped Club Kits",
    category: "Club Kits",
    image: "/portfolio/hooped-trio.jpg",
    blurb: "Classic hooped silhouette produced in three club colorways — pink & black, green & white, blue & white.",
  },
  {
    id: "pixel-camo-trio",
    title: "Pixel Camo Kits",
    category: "Club Kits",
    image: "/portfolio/pixel-camo-trio.jpg",
    blurb: "Digital pixel-fade panelling across three club crests, each finished with matching shorts.",
  },
  {
    id: "chevron-trio",
    title: "Chevron Stripe Kits",
    category: "Club Kits",
    image: "/portfolio/chevron-trio.jpg",
    blurb: "Sharp chevron striping in white, crimson, and gold — same template, distinct club identities.",
  },
  {
    id: "diagonal-stripe-duo",
    title: "Diagonal Stripe Kits",
    category: "Club Kits",
    image: "/portfolio/diagonal-stripe-duo.jpg",
    blurb: "Fine diagonal stripe pattern rendered in two club colorways with contrast collar trim.",
  },
  {
    id: "sky-blue-solo",
    title: "Textured Sky Blue Kit",
    category: "Club Kits",
    image: "/portfolio/sky-blue-solo.jpg",
    blurb: "Subtle tonal texture with embroidered club crest and sponsor placement.",
  },
  {
    id: "swirl-mono-solo",
    title: "Monochrome Swirl Kit",
    category: "Club Kits",
    image: "/portfolio/swirl-mono-solo.jpg",
    blurb: "Bold tribal swirl print in white and navy, carried through into the shorts.",
  },
  {
    id: "tribal-ice-solo",
    title: "Tribal Ice Blue Kit",
    category: "Club Kits",
    image: "/portfolio/tribal-ice-solo.jpg",
    blurb: "Geometric tribal print in ice blue and navy, produced for a club's home fixture kit.",
  },
  {
    id: "grey-chevron-solo",
    title: "Grey Chevron Kit",
    category: "Club Kits",
    image: "/portfolio/grey-chevron-solo.jpg",
    blurb: "Two-tone chevron panelling in heather grey and black with a custom club emblem.",
  },
  {
    id: "hall7-crewneck",
    title: "Hall 7 Real Estate Crewneck",
    category: "Corporate",
    image: "/portfolio/hall7-crewneck.jpg",
    blurb: "Branded corporate crewneck produced for Hall 7 Real Estate Limited, with a custom hem graphic.",
  },
  {
    id: "oilgas-games-duo",
    title: "Nigeria Oil & Gas Industry Games Kit",
    category: "Events",
    image: "/portfolio/oilgas-games-duo.jpg",
    blurb: "Official kit produced for the 20th Edition Nigeria Oil and Gas Industry Games.",
  },
];

export const portfolioCategories: PortfolioCategory[] = ["Club Kits", "Corporate", "Events"];
