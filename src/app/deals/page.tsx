"use client";

import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "@/lib/api";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductCard";
import { EmptyState, PageHeader } from "@/components/ui/Feedback";

export default function DealsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["products", "deals"], queryFn: () => catalogApi.products({ limit: 100 }) });
  const deals = (data?.data ?? []).filter((p) => p.priceAfterDiscount && p.priceAfterDiscount < p.price);
  return (
    <>
      <PageHeader title="Today's Deals" subtitle="Products with a discount right now" />
      <div className="container-fc py-10">
        {isLoading ? <ProductGridSkeleton /> : deals.length ? <ProductGrid products={deals} /> : <EmptyState title="No deals right now" href="/products" cta="Browse all products" />}
      </div>
    </>
  );
}
