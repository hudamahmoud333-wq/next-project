import type {
  Address, AuthResponse, Brand, Cart, CartItem, Category, ListResponse, Order,
  Product, ProductFilters, Review, ShippingAddress, SubCategory, User,
} from "./types";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://ecommerce.routemisr.com";

export const TOKEN_KEY = "fc_token";
export const USER_KEY = "fc_user";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;

async function request<T = Json>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { method = "GET", body, auth = false } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  // The Route API expects the JWT in a header called `token` (not `Authorization`).
  if (auth) {
    const token = getToken();
    if (token) headers.token = token;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data: Json = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }
  if (!res.ok) {
    const msg =
      data?.message ??
      data?.errors?.msg ??
      (res.status === 401 ? "Please sign in again" : "Something went wrong");
    throw new ApiError(String(msg), res.status);
  }
  return data as T;
}

const qs = (params: Record<string, string | number | undefined>) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
};

/* ---------------- Catalog ---------------- */
const SORT_ALIASES: Record<string, string> = { newest: "-createdAt" };

export const catalogApi = {
  products: (f: ProductFilters = {}) =>
    request<ListResponse<Product>>(
      `/api/v1/products${qs({
        page: f.page,
        limit: f.limit,
        keyword: f.keyword,
        sort: f.sort ? (SORT_ALIASES[f.sort] ?? f.sort) : undefined,
        "category[in]": f.category,
        brand: f.brand,
        "price[gte]": f.minPrice,
        "price[lte]": f.maxPrice,
      })}`,
    ),
  product: (id: string) =>
    request<{ data: Product }>(`/api/v1/products/${id}`).then((r) => r.data),
  categories: (limit?: number) =>
    request<ListResponse<Category>>(`/api/v1/categories${qs({ limit })}`),
  category: (id: string) =>
    request<{ data: Category }>(`/api/v1/categories/${id}`).then((r) => r.data),
  subcategoriesOfCategory: (id: string) =>
    request<ListResponse<SubCategory>>(`/api/v1/categories/${id}/subcategories`),
  brands: (limit?: number) =>
    request<ListResponse<Brand>>(`/api/v1/brands${qs({ limit })}`),
};

/* ---------------- Auth & user ---------------- */
export const authApi = {
  signup: (b: { name: string; email: string; password: string; rePassword: string; phone: string }) =>
    request<AuthResponse>("/api/v1/auth/signup", { method: "POST", body: b }),
  signin: (b: { email: string; password: string }) =>
    request<AuthResponse>("/api/v1/auth/signin", { method: "POST", body: b }),
  forgotPassword: (email: string) =>
    request<{ statusMsg: string; message: string }>("/api/v1/auth/forgotPasswords", {
      method: "POST", body: { email },
    }),
  verifyResetCode: (resetCode: string) =>
    request<{ status: string }>("/api/v1/auth/verifyResetCode", {
      method: "POST", body: { resetCode },
    }),
  resetPassword: (b: { email: string; newPassword: string }) =>
    request<{ token: string }>("/api/v1/auth/resetPassword", { method: "PUT", body: b }),
  changePassword: (b: { currentPassword: string; password: string; rePassword: string }) =>
    request<{ message: string; token: string }>("/api/v1/users/changeMyPassword", {
      method: "PUT", body: b, auth: true,
    }),
  updateMe: (b: { name: string; email: string; phone: string }) =>
    request<{ message: string; user: User }>("/api/v1/users/updateMe/", {
      method: "PUT", body: b, auth: true,
    }),
  verifyToken: () =>
    request<{ message: string; decoded: { id: string; name: string } }>(
      "/api/v1/auth/verifyToken", { auth: true },
    ),
};

/* ---------------- Wishlist ---------------- */
export const wishlistApi = {
  get: () => request<{ count: number; data: Product[] }>("/api/v1/wishlist", { auth: true }),
  add: (productId: string) =>
    request("/api/v1/wishlist", { method: "POST", body: { productId }, auth: true }),
  remove: (productId: string) =>
    request(`/api/v1/wishlist/${productId}`, { method: "DELETE", auth: true }),
};

/* ---------------- Addresses ---------------- */
export const addressApi = {
  list: () => request<{ data: Address[] }>("/api/v1/addresses", { auth: true }).then((r) => r.data),
  add: (b: { name: string; details: string; phone: string; city: string }) =>
    request("/api/v1/addresses", { method: "POST", body: b, auth: true }),
  remove: (id: string) => request(`/api/v1/addresses/${id}`, { method: "DELETE", auth: true }),
};

/* ---------------- Cart (v2) ---------------- */
/**
 * The Postman collection has no saved response examples for the v2 cart, so this maps
 * the response defensively. If your v2 response differs, only this function changes.
 */
export function normalizeCart(raw: Json): Cart {
  const d = raw?.data ?? raw ?? {};
  const list: Json[] = d.products ?? d.cartItems ?? d.items ?? [];
  const items: CartItem[] = list
    .filter((i) => i && typeof i.product === "object" && i.product !== null)
    .map((i) => ({
      _id: i._id ?? i.product._id,
      count: Number(i.count ?? i.quantity ?? 1),
      price: Number(i.price ?? i.product.price ?? 0),
      product: i.product as Product,
    }));
  const total = Number(d.totalCartPrice ?? d.totalPrice ?? items.reduce((s, i) => s + i.price * i.count, 0));
  const afterDiscount = d.totalAfterDiscount ?? d.totalCartPriceAfterDiscount;
  return {
    cartId: String(raw?.cartId ?? d._id ?? ""),
    items,
    totalPrice: total,
    totalAfterDiscount: afterDiscount !== undefined ? Number(afterDiscount) : undefined,
    numOfCartItems: Number(raw?.numOfCartItems ?? items.reduce((s, i) => s + i.count, 0)),
  };
}

export const cartApi = {
  get: () => request("/api/v2/cart", { auth: true }).then(normalizeCart),
  add: (productId: string) =>
    request("/api/v2/cart", { method: "POST", body: { productId }, auth: true }),
  update: (productId: string, count: number) =>
    request(`/api/v2/cart/${productId}`, { method: "PUT", body: { count }, auth: true }),
  remove: (productId: string) =>
    request(`/api/v2/cart/${productId}`, { method: "DELETE", auth: true }),
  clear: () => request("/api/v2/cart", { method: "DELETE", auth: true }),
  applyCoupon: (couponName: string) =>
    request("/api/v2/cart/applyCoupon", { method: "PUT", body: { couponName }, auth: true }),
};

/* ---------------- Orders ---------------- */
export const orderApi = {
  createCash: (cartId: string, shippingAddress: ShippingAddress) =>
    request(`/api/v2/orders/${cartId}`, { method: "POST", body: { shippingAddress }, auth: true }),
  // Online payment only exists as a v1 endpoint in the collection.
  checkoutSession: (cartId: string, shippingAddress: ShippingAddress, returnUrl: string) =>
    request<{ status: string; session: { url: string } }>(
      `/api/v1/orders/checkout-session/${cartId}${qs({ url: returnUrl })}`,
      { method: "POST", body: { shippingAddress }, auth: true },
    ),
  userOrders: (userId: string) =>
    request<Json>(`/api/v1/orders/user/${userId}`, { auth: true }).then(
      (r): Order[] => (Array.isArray(r) ? r : (r?.data ?? [])),
    ),
};

/* ---------------- Reviews ---------------- */
export const reviewApi = {
  forProduct: (productId: string) =>
    request<ListResponse<Review>>(`/api/v1/products/${productId}/reviews`),
  create: (productId: string, b: { review: string; rating: number }) =>
    request(`/api/v1/products/${productId}/reviews`, { method: "POST", body: b, auth: true }),
  remove: (reviewId: string) =>
    request(`/api/v1/reviews/${reviewId}`, { method: "DELETE", auth: true }),
};
