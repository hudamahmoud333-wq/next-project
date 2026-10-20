"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import RequireAuth from "@/components/ui/RequireAuth";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductCard";
import { EmptyState, PageHeader } from "@/components/ui/Feedback";
import { useWishlist } from "@/hooks/useWishlist";

function Content() {
  const { items, isLoading } = useWishlist();
  return (
    <div className="container-fc py-10">
      {isLoading ? <ProductGridSkeleton count={5} /> : items.length === 0 ? (
        <EmptyState icon={<Heart size={28} />} title="Your wishlist is empty" text="Tap the heart on any product to save it here." href="/products" cta="Start shopping" />
      ) : (
        <>
          <p className="mb-5 text-sm text-muted">{items.length} saved item{items.length > 1 ? "s" : ""} · <Link href="/products" className="font-semibold text-primary">Continue shopping</Link></p>
          <ProductGrid products={items} />
        </>
      )}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <RequireAuth>
      <PageHeader title="My Wishlist" />
      <Content />
    </RequireAuth>
  );
}
