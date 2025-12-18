export type MinProduct = {
    slug: string;
    title: string;
    price: number;
    image: string;
    stock: number;
};

export const MIN_PRODUCTS: MinProduct[] = [
    { slug: "sp-1", title: "Áo thun cổ tròn", price: 129000, image: "skirk.webp", stock: 12 },
    { slug: "sp-2", title: "Quần jeans slim", price: 459000, image: "skirk.webp", stock: 0 },
    { slug: "sp-3", title: "Giày sneaker basic", price: 799000, image: "skirk.webp", stock: 5 },
    { slug: "sp-4", title: "Túi tote canvas", price: 99000, image: "skirk.webp", stock: 20 },
    { slug: "sp-5", title: "Mũ lưỡi trai", price: 69000, image: "skirk.webp", stock: 3 },
    { slug: "sp-6", title: "Áo sơ mi kẻ", price: 259000, image: "skirk.webp", stock: 8 },
    { slug: "sp-7", title: "Váy midi", price: 349000, image: "skirk.webp", stock: 2 },
    { slug: "sp-8", title: "Áo khoác gió", price: 559000, image: "skirk.webp", stock: 15 },
];
