"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "@/lib/api";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductCard";
import Pagination from "@/components/ui/Pagination";
import { EmptyState, ErrorState, PageHeader } from "@/components/ui/Feedback";

export default function CategoryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [sub, setSub] = useState("");
  const category = useQuery({ queryKey: ["category", id], queryFn: () => catalogApi.category(id) });
  const subs = useQuery({ queryKey: ["subcategories", id], queryFn: () => catalogApi.subcategoriesOfCategory(id) });
  const products = useQuery({
    queryKey: ["products", "category", id, page],
    queryFn: () => catalogApi.products({ category: id, page, limit: 20 }),
    placeholderData: (prev) => prev,
  });
  // The collection has no sub-category filter, so it is applied to the loaded page.
  const list = (products.data?.data ?? []).filter((p) => !sub || p.subcategory?.some((s) => s._id === sub));

  return (
    <>
      <PageHeader title={category.data?.name ?? "Category"} subtitle="Products in this category" />
      <div className="container-fc py-10">
        {!!subs.data?.data.length && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button onClick={() => setSub("")} className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${!sub ? "border-primary bg-primary text-white" : "border-line bg-white hover:border-primary"}`}>All</button>
            {subs.data.data.map((s) => (
              <button key={s._id} onClick={() => setSub(s._id)} className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${sub === s._id ? "border-primary bg-primary text-white" : "border-line bg-white hover:border-primary"}`}>{s.name}</button>
            ))}
          </div>
        )}
        {products.isLoading ? <ProductGridSkeleton /> : products.error ? <ErrorState message={(products.error as Error).message} />
          : list.length === 0 ? <EmptyState title="No products here yet" href="/products" cta="Browse all products" />
          : <ProductGrid products={list} />}
        <Pagination page={products.data?.metadata?.currentPage ?? page} pages={products.data?.metadata?.numberOfPages ?? 1} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
      </div>
    </>
  );
}
