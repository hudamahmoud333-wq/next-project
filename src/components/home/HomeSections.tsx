"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { catalogApi } from "@/lib/api";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductCard";
import { ErrorState } from "@/components/ui/Feedback";

function Head({ title, href, cta = "View All" }: { title: string; href?: string; cta?: string }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-extrabold">
        <span className="mr-3 inline-block h-6 w-1.5 rounded bg-primary align-middle" />
        {title}
      </h2>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          {cta} <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}

export function ShopByCategory() {
  const { data, isLoading } = useQuery({ queryKey: ["categories", "all"], queryFn: () => catalogApi.categories() });
  return (
    <section className="container-fc py-8">
      <Head title="Shop By Category" href="/categories" cta="View All Categories" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => <div key={i} className="card-fc h-40 animate-pulse bg-gray-100" />)
          : data?.data.map((c) => (
              <Link key={c._id} href={`/categories/${c._id}`} className="card-fc group flex flex-col items-center gap-3 p-4 text-center transition hover:border-primary hover:shadow-md">
                <div className="relative h-24 w-24 overflow-hidden rounded-full bg-primary-light">
                  <Image src={c.image} alt={c.name} fill unoptimized sizes="96px" className="object-cover transition group-hover:scale-110" />
                </div>
                <span className="text-sm font-semibold">{c.name}</span>
              </Link>
            ))}
      </div>
    </section>
  );
}

export function PromoBanners() {
  return (
    <section className="container-fc grid gap-5 py-8 md:grid-cols-2">
      <div className="rounded-2xl bg-gradient-to-br from-primary to-emerald-400 p-8 text-white">
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">🔥 Deal of the Day</span>
        <h3 className="mt-4 text-2xl font-extrabold">Fresh Organic Fruits</h3>
        <p className="mt-1 text-sm text-white/90">Get up to 40% off on selected organic fruits</p>
        <div className="mt-4 flex items-center gap-3 text-sm">
          <b className="text-xl">40% OFF</b>
          <span className="text-white/90">Use code: <b>ORGANIC40</b></span>
        </div>
        <Link href="/products" className="mt-5 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-primary">Shop Now</Link>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white">
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">✨ New Arrivals</span>
        <h3 className="mt-4 text-2xl font-extrabold">Exotic Vegetables</h3>
        <p className="mt-1 text-sm text-white/90">Discover our latest collection of premium vegetables</p>
        <div className="mt-4 flex items-center gap-3 text-sm">
          <b className="text-xl">25% OFF</b>
          <span className="text-white/90">Use code: <b>FRESH25</b></span>
        </div>
        <Link href="/products?sort=newest" className="mt-5 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-orange-600">Explore Now</Link>
      </div>
    </section>
  );
}

export function FeaturedProducts() {
  const { data, isLoading, error } = useQuery({ queryKey: ["products", "featured"], queryFn: () => catalogApi.products({ limit: 20 }) });
  return (
    <section className="container-fc py-8">
      <Head title="Featured Products" href="/products" />
      {isLoading ? <ProductGridSkeleton /> : error ? <ErrorState message={(error as Error).message} /> : <ProductGrid products={data?.data ?? []} />}
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="container-fc py-8">
      <div className="grid items-center gap-8 rounded-3xl bg-primary-light p-8 md:grid-cols-2 md:p-12">
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-primary">✉ Newsletter · 50,000+ subscribers</span>
          <h2 className="mt-3 text-3xl font-extrabold">Get the Freshest Updates <span className="text-primary">Delivered Free</span></h2>
          <p className="mt-2 text-sm text-muted">Weekly recipes, seasonal offers &amp; exclusive member perks.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-primary">
            <span className="rounded-full bg-white px-3 py-1">Fresh Picks Weekly</span>
            <span className="rounded-full bg-white px-3 py-1">Free Delivery Codes</span>
            <span className="rounded-full bg-white px-3 py-1">Members-Only Deals</span>
          </div>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
          <input type="email" required placeholder="Enter your email address" className="input-fc py-3.5" />
          <button className="btn-primary w-full rounded-lg py-3.5">Subscribe</button>
          <p className="text-center text-xs text-muted">✨ Unsubscribe anytime. No spam, ever.</p>
        </form>
      </div>
    </section>
  );
}

export function MobileApp() {
  return (
    <section className="container-fc py-8">
      <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-ink p-8 text-white md:flex-row md:p-12">
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-green-400">📱 Mobile App</span>
          <h2 className="mt-2 text-3xl font-extrabold">Shop Faster on Our App</h2>
          <p className="mt-1 text-sm text-gray-300">Get app-exclusive deals &amp; 15% off your first order.</p>
          <p className="mt-3 text-sm text-gray-300">★★★★★ 4.9 • 100K+ downloads</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="#" className="rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold hover:bg-white/20">Download on <b>App Store</b></a>
          <a href="#" className="rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold hover:bg-white/20">Get it on <b>Google Play</b></a>
        </div>
      </div>
    </section>
  );
}
