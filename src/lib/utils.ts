import type { Product } from "./types";

export const money = (n: number) =>
  `${Math.round(n).toLocaleString("en-US")} EGP`;

export function priceInfo(p: Product) {
  const hasDiscount =
    typeof p.priceAfterDiscount === "number" && p.priceAfterDiscount < p.price;
  return {
    current: hasDiscount ? (p.priceAfterDiscount as number) : p.price,
    old: hasDiscount ? p.price : undefined,
    percent: hasDiscount
      ? Math.round(((p.price - (p.priceAfterDiscount as number)) / p.price) * 100)
      : 0,
  };
}

export function decodeJwt(token: string): { id?: string; name?: string } | null {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(part));
  } catch {
    return null;
  }
}

export const isEgyptPhone = (v: string) => /^01[0125][0-9]{8}$/.test(v);
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
