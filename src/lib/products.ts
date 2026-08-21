export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt?: number;
  category: "Jerseys" | "Hoodies" | "Sweatshirts" | "Varsity Jackets" | "Uniforms" | "Kaftans" | "Caps";
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  /** Optional: when a product is photographed per-color, map color name -> that color's image set.
   *  Falls back to `images` when a color has no entry here. */
  variantImages?: Record<string, string[]>;
  rating: number;
  reviews: number;
  tag?: "New" | "Bestseller" | "Featured" | "Sale";
  description: string;
  inStock: boolean;
};

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const categories = [
  { name: "Hoodies", image: img("photo-1556821840-3a63f95609a7") },
  { name: "Sweatshirts", image: img("photo-1620799140408-edc6dcb6d633") },
  { name: "Varsity Jackets", image: img("photo-1591047139829-d91aecb6caea") },
  { name: "Uniforms", image: img("photo-1516762689617-e1cffcef479d") },
  { name: "Kaftans", image: img("photo-1594938291221-94f18cbb5660") },
  { name: "Caps", image: "/products/caps/k1-navy.jpg" },
] as const;

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  { name: "Onyx", hex: "#0a0a0a" },
  { name: "Ivory", hex: "#f5f0e6" },
  { name: "Charcoal", hex: "#2a2a2a" },
  { name: "Gold", hex: "#c9a24a" },
  { name: "Bone", hex: "#e8e2d4" },
  { name: "Sand", hex: "#c9b99a" },
];

const IMAGES = [
  "photo-1620799140408-edc6dcb6d633",
  "photo-1556821840-3a63f95609a7",
  "photo-1591047139829-d91aecb6caea",
  "photo-1521572163474-6864f9cf17ab",
  "photo-1588850561407-ed78c282e89b",
  "photo-1516762689617-e1cffcef479d",
  "photo-1517466787929-bc90951d0974",
  "photo-1503341504253-dff4815485f1",
  "photo-1542291026-7eec264c27ff",
  "photo-1552374196-1ab2a1c593e8",
  "photo-1512436991641-6745cdb1723f",
  "photo-1523381210434-271e8be1f52b",
  "photo-1489987707025-afc232f7ea0f",
  "photo-1544022613-e87ca75a784a",
  "photo-1479064555552-3ef4979f8908",
  "photo-1434389677669-e08b4cac3105",
  "photo-1521223890158-f9f7c3d5d504",
  "photo-1618354691373-d851c5c3a990",
  "photo-1495105787522-5334e3ffa0ef",
  "photo-1583743814966-8936f5b7be1a",
  "photo-1602293589930-45aad59ba3ab",
  "photo-1580657018950-c7f7d6a6d990",
  "photo-1523398002811-999ca8dec234",
  "photo-1596755094514-f87e34085b2c",
];

const cats: Product["category"][] = [
  "Jerseys",
  "Hoodies",
  "Sweatshirts",
  "Varsity Jackets",
  "Uniforms",
  "Kaftans",
];

const names: Record<Product["category"], string[]> = {
  Jerseys: [],
  Hoodies: ["Monogram Heavy Hoodie", "Gold Crest Pullover", "Ivory Oversized Hoodie", "Charcoal Zip Hoodie"],
  Sweatshirts: ["Atelier Crewneck", "Cashmere Blend Sweat", "Embroidered Crest Sweatshirt"],
  "Varsity Jackets": ["Heritage Varsity Jacket", "Gilded Wool Varsity", "Onyx Letterman"],
  Uniforms: ["Signature Suit Set", "Two-Piece Studio Uniform", "Team Uniform Kit"],
  Kaftans: ["Royal Embroidered Kaftan", "Gold Crest Kaftan", "Ivory Linen Kaftan", "Onyx Senator Kaftan"],
  Caps: ["Gold Emblem Cap", "Onyx Baseball Cap", "Suede Six-Panel"],
};

const tags: Product["tag"][] = ["New", "Bestseller", "Featured", "Sale", undefined];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function seeded(n: number) {
  let x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

const generatedProducts: Product[] = (() => {
  const list: Product[] = [];
  let idx = 0;
  for (const cat of cats) {
    for (const n of names[cat]) {
      const s = seeded(idx + 1);
      const price = Math.round((90 + s * 320) / 5) * 5;
      const hasSale = s > 0.6;
      const compareAt = hasSale ? Math.round(price * 1.35 / 5) * 5 : undefined;
      const tag = tags[Math.floor(seeded(idx + 7) * tags.length)];
      const imgs = [
        img(IMAGES[idx % IMAGES.length]),
        img(IMAGES[(idx + 3) % IMAGES.length]),
        img(IMAGES[(idx + 7) % IMAGES.length]),
        img(IMAGES[(idx + 11) % IMAGES.length]),
      ];
      list.push({
        id: `p-${idx + 1}`,
        name: n,
        slug: `${slugify(n)}-${idx + 1}`,
        price,
        compareAt,
        category: cat,
        sizes: SIZES.slice(0, 4 + Math.floor(seeded(idx + 3) * 3)),
        colors: [COLORS[idx % COLORS.length], COLORS[(idx + 2) % COLORS.length], COLORS[(idx + 4) % COLORS.length]],
        images: imgs,
        rating: Math.round((3.6 + seeded(idx + 5) * 1.4) * 10) / 10,
        reviews: 20 + Math.floor(seeded(idx + 9) * 380),
        tag: hasSale ? "Sale" : tag,
        description:
          "Cut from premium heavyweight fabric with reinforced stitching and a tailored silhouette. Designed in-house and finished with signature gold embroidery — built for daily luxury.",
        inStock: s > 0.1,
      });
      idx++;
    }
  }
  return list;
})();

/* ---------- Real Caps catalog (photographed product, real colorways) ---------- */

const capImg = (file: string) => `/products/caps/${file}`;

type CapColorway = { name: string; hex: string; file: string };

function makeCapProduct(opts: {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  tag?: Product["tag"];
  colorways: CapColorway[];
}): Product {
  const colors = opts.colorways.map((c) => ({ name: c.name, hex: c.hex }));
  const variantImages: Record<string, string[]> = {};
  for (const c of opts.colorways) variantImages[c.name] = [capImg(c.file)];
  return {
    id: opts.id,
    name: opts.name,
    slug: opts.slug,
    price: opts.price,
    category: "Caps",
    sizes: ["One Size"],
    colors,
    images: variantImages[opts.colorways[0].name],
    variantImages,
    rating: 4.7,
    reviews: 34,
    tag: opts.tag,
    description: opts.description,
    inStock: true,
  };
}

export const capProducts: Product[] = [
  makeCapProduct({
    id: "cap-k1",
    name: "K1 Classic Cap",
    slug: "k1-classic-cap",
    price: 95,
    tag: "Bestseller",
    description:
      "Our signature 6-panel curved-brim cap with a structured crown and the Kosisi emblem patch up front. Clean, everyday luxury built to hold its shape.",
    colorways: [
      { name: "Olive", hex: "#5b5c34", file: "k1-olive.jpg" },
      { name: "Navy", hex: "#14141f", file: "k1-navy.jpg" },
      { name: "Royal Blue", hex: "#1f3a6b", file: "k1-royal.jpg" },
      { name: "White", hex: "#f2f2f0", file: "k1-white.jpg" },
      { name: "Burgundy", hex: "#7a1a3d", file: "k1-burgundy.jpg" },
    ],
  }),
  makeCapProduct({
    id: "cap-k1-net",
    name: "K1 Net Trucker Cap",
    slug: "k1-net-trucker-cap",
    price: 105,
    tag: "New",
    description:
      "The K1 silhouette with a breathable mesh back panel — a trucker cut for warmer days without giving up the structured front profile.",
    colorways: [
      { name: "Olive", hex: "#5b5c34", file: "k1net-olive.jpg" },
      { name: "Navy", hex: "#181f30", file: "k1net-navy.jpg" },
      { name: "Royal Blue", hex: "#293a5c", file: "k1net-royal.jpg" },
      { name: "White", hex: "#f2f2f0", file: "k1net-white.jpg" },
      { name: "Red", hex: "#b91c2c", file: "k1net-red.jpg" },
    ],
  }),
  makeCapProduct({
    id: "cap-k2",
    name: "K2 Two-Tone Cap",
    slug: "k2-two-tone-cap",
    price: 130,
    tag: "Featured",
    description:
      "Contrast crown-and-brim styling across seven colorways, from heather-textured mixes to bold two-tone pairings. Same structured 6-panel build, more character.",
    colorways: [
      { name: "Navy / White", hex: "#1b2a4a", file: "k2-navy-white.jpg" },
      { name: "Khaki / Heather Navy", hex: "#c2b280", file: "k2-khaki-navy.jpg" },
      { name: "Forest / Heather Grey", hex: "#1f3d2e", file: "k2-forest-grey.jpg" },
      { name: "Cream / Teal", hex: "#ece3d0", file: "k2-cream-teal.jpg" },
      { name: "Green / Navy", hex: "#3d5c34", file: "k2-green-navy.jpg" },
      { name: "Grey / Black", hex: "#808080", file: "k2-grey-black.jpg" },
      { name: "Black / Red", hex: "#16181c", file: "k2-black-red.jpg" },
    ],
  }),
  makeCapProduct({
    id: "cap-k3",
    name: "K3 Performance Cap",
    slug: "k3-performance-cap",
    price: 150,
    tag: "New",
    description:
      "Laser-perforated side panels for airflow on the move. A lighter, athletic take on the Kosisi cap — built for training as much as travel.",
    colorways: [
      { name: "Khaki", hex: "#c7b696", file: "k3-khaki.jpg" },
      { name: "Forest", hex: "#14432c", file: "k3-forest.jpg" },
      { name: "Rust", hex: "#b6431c", file: "k3-rust.jpg" },
      { name: "Navy", hex: "#171b2c", file: "k3-navy.jpg" },
      { name: "White", hex: "#f4f4f0", file: "k3-white.jpg" },
    ],
  }),
];

export const products: Product[] = [...generatedProducts, ...capProducts];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const featured = products.filter((p) => p.tag === "Featured" || p.tag === "Bestseller").slice(0, 8);
export const newArrivals = products.slice(-8);
export const bestSellers = products.filter((p) => p.tag === "Bestseller" || p.rating >= 4.6).slice(0, 8);

export const testimonials = [
  { name: "Amaka O.", role: "Stylist, Lagos", quote: "The tailoring is next level — like wearing armor cut for a runway." },
  { name: "David K.", role: "Creative Director", quote: "Understated, expensive-feeling, unmistakable. My go-to varsity jacket." },
  { name: "Zara M.", role: "Model", quote: "I've worn every hoodie in my closet — this one doesn't leave the rotation." },
];
/* ---------- Badges & variant stock ---------- */

export type ProductBadge = "New" | "Sale" | "Best Seller" | "Limited Edition" | "Out of Stock";

export function productBadges(p: Product): ProductBadge[] {
  const badges: ProductBadge[] = [];
  if (!p.inStock) badges.push("Out of Stock");
  if (p.compareAt) badges.push("Sale");
  if (p.tag === "New") badges.push("New");
  if (p.tag === "Bestseller" || p.rating >= 4.7) badges.push("Best Seller");
  if (p.price >= 300) badges.push("Limited Edition");
  return badges.slice(0, 2);
}

export const isNewArrival = (p: Product) => newArrivals.some((n) => n.id === p.id) || p.tag === "New";
export const isBestSeller = (p: Product) => p.tag === "Bestseller" || p.rating >= 4.7;

/** Deterministic mock stock for a size + color variant. */
export function variantStock(p: Product, size: string, color: string): number {
  if (!p.inStock) return 0;
  const key = `${p.id}-${size}-${color}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 9973;
  const v = h % 14;
  return v === 0 ? 0 : v;
}

export const variantLabel = (stock: number) =>
  stock === 0 ? "Sold out" : stock <= 3 ? `Only ${stock} left` : "In stock";
