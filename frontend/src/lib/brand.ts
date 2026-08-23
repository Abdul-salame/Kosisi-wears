export const BRAND = {
  name: "Kosisi Wears",
  short: "KOSISI",
  tagline: "Premium clothing, made to be worn proudly.",
  // NOTE: the logo asset is currently available in /public/kosisi.jpeg.
  // Update this path if you later add a different branded logo file.
  logo: "/kosisi.jpeg",
  whatsapp: "2348000000000",
  instagram: "kosisiwears",
  email: "hello@kosisiwears.com",
};

export const whatsappLink = (message: string) =>
  `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
