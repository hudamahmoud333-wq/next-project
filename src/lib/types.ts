export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}
export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}
export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}
export interface Product {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  sold?: number;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images: string[];
  category: Category;
  subcategory?: SubCategory[];
  brand: Brand;
  ratingsAverage: number;
  ratingsQuantity: number;
  createdAt?: string;
}
export interface Metadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
  prevPage?: number;
}
export interface ListResponse<T> {
  results: number;
  metadata?: Metadata;
  data: T[];
}
export interface User {
  name: string;
  email: string;
  role?: string;
  phone?: string;
}
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}
export interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: Product;
}
/** Normalised cart shape used across the UI (the API shape is mapped into this). */
export interface Cart {
  cartId: string;
  items: CartItem[];
  totalPrice: number;
  totalAfterDiscount?: number;
  numOfCartItems: number;
}
export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}
export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}
export interface Order {
  _id: string;
  id?: number;
  totalOrderPrice: number;
  paymentMethodType: "cash" | "card" | string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  shippingAddress?: ShippingAddress;
  cartItems: { _id: string; count: number; price: number; product: Product }[];
}
export interface Review {
  _id: string;
  review: string;
  rating: number;
  createdAt: string;
  user?: { _id?: string; name: string };
  product?: string;
}
export interface ProductFilters {
  page?: number;
  limit?: number;
  keyword?: string;
  sort?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
}
