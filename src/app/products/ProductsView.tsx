"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, X } from "lucide-react";
import { catalogApi } from "@/lib/api";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductCard";
import Pagination from "@/components/ui/Pagination";
import { EmptyState, ErrorState, PageHeader } from "@/components/ui/Feedback";

const SORTS = [
  { value: "", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "-ratingsAverage", label: "Top Rated" },
];

export default function ProductsView() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const page = Number(sp.get("page") ?? 1);
  const keyword = sp.get("keyword") ?? "";
  const category = sp.get("category") ?? "";
  const brand = sp.get("brand") ?? "";
  const sort = sp.get("sort") ?? "";
  const min = sp.get("min") ?? "";
  const max = sp.get("max") ?? "";

  const setParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!("page" in patch)) next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  };

  const cats = useQuery({ queryKey: ["categories", "all"], queryFn: () => catalogApi.categories() });
  const brands = useQuery({ queryKey: ["brands", "all"], queryFn: () => catalogApi.brands() });
  const products = useQuery({
    queryKey: ["products", { page, keyword, category, brand, sort, min, max }],
    queryFn: () =>
      catalogApi.products({
        page, limit: 20, keyword, category, brand, sort,
        minPrice: min ? Number(min) : undefined,
        maxPrice: max ? Number(max) : undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const [minDraft, setMinDraft] = useState(min);
  const [maxDraft, setMaxDraft] = useState(max);
  const hasFilters = !!(keyword || category || brand || min || max || sort);

  const filters = (
    <div className="space-y-7">
      <div>
        <h3 className="mb-3 font-bold">Categories</h3>
        <ul className="space-y-2 text-sm">
          <li><button onClick={() => setParams({ category: null })} className={!category ? "font-bold text-primary" : "hover:text-primary"}>All</button></li>
          {cats.data?.data.map((c) => (
            <li key={c._id}><button onClick={() => setParams({ category: c._id })} className={category === c._id ? "font-bold text-primary" : "hover:text-primary"}>{c.name}</button></li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-3 font-bold">Brand</h3>
        <select value={brand} onChange={(e) => setParams({ brand: e.target.value || null })} className="input-fc">
          <option value="">All brands</option>
          {brands.data?.data.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
      </div>
      <div>
        <h3 className="mb-3 font-bold">Price (EGP)</h3>
        <div className="flex gap-2">
          <input type="number" min={0} placeholder="Min" value={minDraft} onChange={(e) => setMinDraft(e.target.value)} className="input-fc" />
          <input type="number" min={0} placeholder="Max" value={maxDraft} onChange={(e) => setMaxDraft(e.target.value)} className="input-fc" />
        </div>
        <button onClick={() => setParams({ min: minDraft || null, max: maxDraft || null })} className="btn-outline mt-2 w-full py-2">Apply</button>
      </div>
      {hasFilters && (
        <button onClick={() => { setMinDraft(""); setMaxDraft(""); router.push(pathname); }} className="flex items-center gap-1 text-sm font-semibold text-red-500">
          <X size={14} /> Clear all filters
        </button>
      )}
    </div>
  );

  const list = products.data?.data ?? [];
  const meta = products.data?.metadata;

  return (
    <>
      <PageHeader title={keyword ? `Results for “${keyword}”` : "All Products"} subtitle="Discover our full range of quality products" />
      <div className="container-fc grid gap-8 py-10 lg:grid-cols-[250px_1fr]">
        <aside className="card-fc hidden h-fit p-5 lg:block">{filters}</aside>
        <section>
          <div className="mb-5 flex items-center justify-between gap-3">
            <button onClick={() => setOpen(true)} className="btn-outline py-2 lg:hidden"><SlidersHorizontal size={15} /> Filters</button>
            <p className="hidden text-sm text-muted sm:block">{products.data ? `${meta ? meta.numberOfPages * meta.limit : list.length}+ products` : ""}</p>
            <select value={sort} onChange={(e) => setParams({ sort: e.target.value || null })} className="input-fc ml-auto w-auto">
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          {products.isLoading ? <ProductGridSkeleton count={10} />
            : products.error ? <ErrorState message={(products.error as Error).message} />
            : list.length === 0 ? <EmptyState title="No products found" text="Try changing or clearing your filters." href="/products" cta="Reset filters" />
            : <ProductGrid products={list} />}
          <Pagination page={meta?.currentPage ?? page} pages={meta?.numberOfPages ?? 1} onChange={(p) => { setParams({ page: String(p) }); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        </section>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] overflow-y-auto bg-white p-5">
            <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-bold">Filters</h2><button onClick={() => setOpen(false)} aria-label="Close"><X /></button></div>
            {filters}
          </div>
        </div>
      )}
    </>
  );
}
