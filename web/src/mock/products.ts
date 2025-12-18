import type { Product } from "@/types/product";

const COLORS = ["Đen", "Trắng", "Xanh", "Be", "Nâu"];
const SIZES = ["S", "M", "L", "XL"];
const BRANDS = ["Acme", "Contoso", "Umbra", "Nova"];

const CUSTOM_NAMES = [
  "알마 BB (Alma BB)",
  "Quần jeans slim",
  "Giày sneaker basic",
  "Túi tote canvas",
  "Mũ lưỡi trai",
  "Áo sơ mi kẻ",
  "Váy midi",
  "Áo khoác gió",
];

export const PRODUCTS: Product[] = Array.from({ length: 40 }, (_, i) => {
  const n = i + 1;
  const title = CUSTOM_NAMES[i] ?? `Sản phẩm #${n}`; 
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
  return {
    _id: `p${n}`,
    title,
    slug,
    price: 99000 + n * 10000,
    images: [`/anh/${ i + 1 <=30 ? i + 1:"placeholder"}.avif`],
    stock: n % 7 === 0 ? 0 : ((n * 3) % 21) + 1,
    rating: (n % 5) + 1,
    brand: BRANDS[n % BRANDS.length],
    variants: [{ color: COLORS[n % COLORS.length], size: SIZES[n % SIZES.length] }],
    description: "Mô tả ngắn cho sản phẩm.",
    category: n % 2 ? "fashion" : "accessories",
  } satisfies Product;
});






