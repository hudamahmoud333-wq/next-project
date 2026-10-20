"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import { money, priceInfo } from "@/lib/utils";
import Stars from "@/components/ui/Stars";
import { useCart } from "@/hooks/useCart";
import { useAddToCartGuard, useWishlist } from "@/hooks/useWishlist";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { ids, toggleProduct } = useWishlist();
  const guard = useAddToCartGuard();
  const { current, old, percent } = priceInfo(product);
  const liked = ids.has(product._id);
  const href = `/products/${product._id}`;

  return (
    <div className="card-fc group relative flex flex-col overflow-hidden transition hover:shadow-lg">
      {percent > 0 && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
          -{percent}%
        </span>
      )}
      <button
        onClick={() => toggleProduct(product._id)}
        aria-label="Toggle wishlist"
        className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 shadow transition hover:scale-110"
      >
        <Heart size={16} className={liked ? "fill-red-500 text-red-500" : "text-gray-500"} />
      </button>
      <Link href={href} className="relative block aspect-square bg-gray-50">
        <Image src={product.imageCover} alt={product.title} fill unoptimized sizes="(max-width: 768px) 50vw, 25vw" className="object-contain p-3 transition duration-300 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-xs font-medium text-primary">{product.category?.name}</span>
        <Link href={href} className="line-clamp-2 min-h-10 text-sm font-semibold hover:text-primary">
          {product.title}
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <Stars value={product.ratingsAverage} size={12} />
          <span>
            {product.ratingsAverage} ({product.ratingsQuantity})
          </span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="font-bold">{money(current)}</p>
            {old && <p className="text-xs text-muted line-through">{money(old)}</p>}
          </div>
          <button
            onClick={() => guard(() => add.mutate(product._id))}
            disabled={add.isPending}
            aria-label="Add to cart"
            className="rounded-full bg-primary p-2.5 text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-fc animate-pulse overflow-hidden">
          <div className="aspect-square bg-gray-100" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/3 rounded bg-gray-100" />
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-2/3 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
