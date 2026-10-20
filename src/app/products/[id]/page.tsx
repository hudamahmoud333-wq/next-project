"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Heart, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { cartApi, catalogApi, reviewApi } from "@/lib/api";
import { money, priceInfo } from "@/lib/utils";
import { useAuth } from "@/providers/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useAddToCartGuard, useWishlist } from "@/hooks/useWishlist";
import Stars from "@/components/ui/Stars";
import { ErrorState, Spinner } from "@/components/ui/Feedback";
import { ProductGrid } from "@/components/product/ProductCard";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const qc = useQueryClient();
  const { add } = useCart();
  const { ids, toggleProduct } = useWishlist();
  const guard = useAddToCartGuard();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const { data: p, isLoading, error } = useQuery({ queryKey: ["product", id], queryFn: () => catalogApi.product(id) });
  const reviews = useQuery({ queryKey: ["reviews", id], queryFn: () => reviewApi.forProduct(id) });
  const related = useQuery({
    queryKey: ["products", "related", p?.category?._id],
    queryFn: () => catalogApi.products({ category: p!.category._id, limit: 6 }),
    enabled: !!p?.category?._id,
  });

  const createReview = useMutation({
    mutationFn: () => reviewApi.create(id, { review: text.trim(), rating }),
    onSuccess: () => { toast.success("Review added"); setText(""); qc.invalidateQueries({ queryKey: ["reviews", id] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const deleteReview = useMutation({
    mutationFn: (rid: string) => reviewApi.remove(rid),
    onSuccess: () => { toast.success("Review deleted"); qc.invalidateQueries({ queryKey: ["reviews", id] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <Spinner className="min-h-[60vh]" />;
  if (error || !p) return <div className="container-fc py-16"><ErrorState message={(error as Error)?.message ?? "Product not found"} /></div>;

  const { current, old, percent } = priceInfo(p);
  const images = [p.imageCover, ...(p.images ?? [])].filter((v, i, a) => a.indexOf(v) === i);
  const liked = ids.has(p._id);
  const addToCart = () => guard(async () => {
    // The v2 "add" endpoint adds one unit; set the requested quantity afterwards if > 1.
    try {
      await add.mutateAsync(p._id);
      if (qty > 1) {
        await cartApi.update(p._id, qty);
        qc.invalidateQueries({ queryKey: ["cart"] });
      }
    } catch { /* error toast handled by the hook */ }
  });

  return (
    <div className="container-fc py-10">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-primary">Home</Link> / <Link href="/products" className="hover:text-primary">Shop</Link> /{" "}
        <Link href={`/categories/${p.category._id}`} className="hover:text-primary">{p.category.name}</Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="card-fc relative aspect-square overflow-hidden bg-white">
            <Image src={images[active]} alt={p.title} fill unoptimized sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain p-4" priority />
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-3">
              {images.slice(0, 5).map((src, i) => (
                <button key={src} onClick={() => setActive(i)} className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white ${i === active ? "border-primary" : "border-line"}`}>
                  <Image src={src} alt="" fill unoptimized sizes="100px" className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <Link href={`/products?category=${p.category._id}`} className="rounded-full bg-primary-light px-3 py-1 text-primary">{p.category.name}</Link>
            {p.brand && <Link href={`/products?brand=${p.brand._id}`} className="rounded-full bg-gray-100 px-3 py-1">{p.brand.name}</Link>}
          </div>
          <h1 className="text-3xl font-extrabold leading-tight">{p.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Stars value={p.ratingsAverage} /> <span>{p.ratingsAverage} ({p.ratingsQuantity} reviews)</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-extrabold text-primary">{money(current)}</span>
            {old && <span className="text-lg text-muted line-through">{money(old)}</span>}
            {percent > 0 && <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">-{percent}%</span>}
          </div>
          <p className="leading-relaxed text-muted">{p.description}</p>
          <p className="text-sm">
            {p.quantity > 0 ? <span className="font-semibold text-primary">In stock ({p.quantity} available)</span> : <span className="font-semibold text-red-500">Out of stock</span>}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-line bg-white">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3" aria-label="Decrease"><Minus size={15} /></button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(p.quantity || 1, q + 1))} className="p-3" aria-label="Increase"><Plus size={15} /></button>
            </div>
            <button onClick={addToCart} disabled={add.isPending || p.quantity < 1} className="btn-primary flex-1 py-3.5 sm:flex-none sm:px-10"><ShoppingCart size={17} /> Add to Cart</button>
            <button onClick={() => toggleProduct(p._id)} aria-label="Toggle wishlist" className="rounded-full border border-line bg-white p-3.5 hover:border-red-300">
              <Heart size={19} className={liked ? "fill-red-500 text-red-500" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* reviews */}
      <section className="mt-16">
        <h2 className="mb-5 text-2xl font-extrabold">Customer Reviews</h2>
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {reviews.isLoading ? <Spinner /> : reviews.data?.data.length ? reviews.data.data.map((r) => (
              <div key={r._id} className="card-fc p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{r.user?.name ?? "Customer"}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted"><Stars value={r.rating} size={13} /> {new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                  {token && user?.name && r.user?.name === user.name && (
                    <button onClick={() => deleteReview.mutate(r._id)} aria-label="Delete review" className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                  )}
                </div>
                <p className="mt-3 text-sm text-muted">{r.review}</p>
              </div>
            )) : <p className="text-sm text-muted">No reviews yet. Be the first to review this product.</p>}
          </div>
          <div className="card-fc h-fit p-5">
            <h3 className="mb-3 font-bold">Write a review</h3>
            {token ? (
              <form onSubmit={(e) => { e.preventDefault(); if (text.trim().length < 2) return toast.error("Write a short review first"); createReview.mutate(); }} className="space-y-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} stars`} className={`text-2xl ${n <= rating ? "text-amber-400" : "text-gray-300"}`}>★</button>
                  ))}
                </div>
                <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Share your experience..." className="input-fc" />
                <button disabled={createReview.isPending} className="btn-primary w-full">Submit review</button>
              </form>
            ) : (
              <p className="text-sm text-muted"><Link href={`/login?redirect=/products/${id}`} className="font-semibold text-primary">Sign in</Link> to write a review.</p>
            )}
          </div>
        </div>
      </section>

      {related.data && related.data.data.filter((x) => x._id !== p._id).length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-2xl font-extrabold">You may also like</h2>
          <ProductGrid products={related.data.data.filter((x) => x._id !== p._id).slice(0, 5)} />
        </section>
      )}
    </div>
  );
}
