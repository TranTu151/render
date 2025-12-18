export type CartItemInput = { slug: string; quantity: number };

const BASE_SHIP_FEE = 15000;
const FREE_SHIP_THRESHOLD = 300000;
const REMOTE_SURCHARGE = 10000;

function isRemote(address = "") {
  const s = address.toLowerCase();
  return /đảo|dao|truong sa|trường sa|hoang sa|hoàng sa|phu quoc|phú quốc/.test(s);
}

export function calcShipping(subtotal: number, address: string) {
  if (subtotal <= 0) return 0;
  let fee = subtotal >= FREE_SHIP_THRESHOLD ? 0 : BASE_SHIP_FEE;
  if (fee > 0 && isRemote(address)) fee += REMOTE_SURCHARGE;
  return fee;
}

export function calcTotals(items: { price: number; quantity: number }[], address: string) {
  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const shippingFee = calcShipping(subtotal, address);
  const total = subtotal + shippingFee;
  return { subtotal, shippingFee, total };
}