"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Tag, Trash2, Truck } from "lucide-react";
import RequireAuth from "@/components/ui/RequireAuth";
import { EmptyState, ErrorState, PageHeader, Spinner } from "@/components/ui/Feedback";
import { useCart } from "@/hooks/useCart";
import { money } from "@/lib/utils";

const FREE_SHIPPING = 500;

function Content() {
  const { cart, isLoading, error, update, remove, clear, coupon } = useCart();
  const [code, setCode] = useState("");

  if (isLoading) return <Spinner className="min-h-[40vh]" />;
  if (error) return <div className="container-fc py-10"><ErrorState message={(error as Error).message} /></div>;
  if (!cart || cart.items.length === 0)
    return <div className="container-fc py-16"><EmptyState icon={<ShoppingBag size={28} />} title="Your cart is empty" text="Looks like you haven't added anything yet." href="/products" cta="Start shopping" /></div>;

  const total = cart.totalAfterDiscount ?? cart.totalPrice;
  const remaining = Math.max(0, FREE_SHIPPING - total);

  return (
    <div className="container-fc grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <div className={`flex items-center gap-3 rounded-xl p-4 text-sm font-medium ${remaining === 0 ? "bg-primary-light text-primary" : "bg-amber-50 text-amber-700"}`}>
          <Truck size={18} />
          {remaining === 0 ? "You qualify for free shipping!" : `Add ${money(remaining)} more to get free shipping`}
        </div>
        {cart.items.map((item) => {
          const p = item.product;
          return (
            <div key={item._id} className="card-fc flex gap-4 p-4">
              <Link href={`/products/${p._id}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                <Image src={p.imageCover} alt={p.title} fill unoptimized sizes="96px" className="object-contain p-1" />
              </Link>
              <div className="flex flex-1 flex-col justify-between gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/products/${p._id}`} className="line-clamp-2 font-semibold hover:text-primary">{p.title}</Link>
                    <p className="text-xs text-muted">{p.category?.name}</p>
                  </div>
                  <p className="font-bold">{money(item.price * item.count)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-line">
                    <button disabled={item.count <= 1 || update.isPending} onClick={() => update.mutate({ id: p._id, count: item.count - 1 })} className="p-2.5 disabled:opacity-40" aria-label="Decrease"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-semibold">{item.count}</span>
                    <button disabled={update.isPending} onClick={() => update.mutate({ id: p._id, count: item.count + 1 })} className="p-2.5" aria-label="Increase"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => remove.mutate(p._id)} disabled={remove.isPending} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"><Trash2 size={15} /> Remove</button>
                </div>
              </div>
            </div>
          );
        })}
        <button onClick={() => clear.mutate()} disabled={clear.isPending} className="text-sm font-semibold text-red-500 hover:underline">Clear cart</button>
      </div>

      <aside className="card-fc h-fit space-y-5 p-6">
        <h2 className="text-lg font-bold">Order Summary</h2>
        <form onSubmit={(e) => { e.preventDefault(); if (code.trim()) coupon.mutate(code.trim()); }} className="flex gap-2">
          <div className="relative flex-1">
            <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" className="input-fc pl-9" />
          </div>
          <button disabled={coupon.isPending} className="btn-outline px-4 py-2">Apply</button>
        </form>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Items ({cart.numOfCartItems})</dt><dd className="font-semibold">{money(cart.totalPrice)}</dd></div>
          {cart.totalAfterDiscount !== undefined && cart.totalAfterDiscount < cart.totalPrice && (
            <div className="flex justify-between text-primary"><dt>Coupon discount</dt><dd className="font-semibold">-{money(cart.totalPrice - cart.totalAfterDiscount)}</dd></div>
          )}
          <div className="flex justify-between border-t border-line pt-3 text-base"><dt className="font-bold">Total</dt><dd className="font-extrabold text-primary">{money(total)}</dd></div>
        </dl>
        <Link href="/checkout" className="btn-primary w-full py-3.5">Proceed to Checkout</Link>
        <Link href="/products" className="block text-center text-sm font-semibold text-primary">Continue shopping</Link>
      </aside>
    </div>
  );
}

export default function CartPage() {
  return (
    <RequireAuth>
      <PageHeader title="Shopping Cart" />
      <Content />
    </RequireAuth>
  );
}
