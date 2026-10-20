"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Banknote, CreditCard } from "lucide-react";
import RequireAuth from "@/components/ui/RequireAuth";
import { EmptyState, PageHeader, Spinner } from "@/components/ui/Feedback";
import { addressApi, orderApi } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { isEgyptPhone, money } from "@/lib/utils";
import type { ShippingAddress } from "@/lib/types";

function Content() {
  const router = useRouter();
  const qc = useQueryClient();
  const { cart, isLoading } = useCart();
  const addresses = useQuery({ queryKey: ["addresses"], queryFn: addressApi.list });
  const [selected, setSelected] = useState<string>("new");
  const [form, setForm] = useState({ details: "", phone: "", city: "", postalCode: "" });
  const [method, setMethod] = useState<"cash" | "online">("cash");

  const place = useMutation({
    mutationFn: async () => {
      if (!cart) throw new Error("Cart is empty");
      let ship: ShippingAddress;
      if (selected !== "new") {
        const a = addresses.data?.find((x) => x._id === selected);
        if (!a) throw new Error("Choose an address");
        ship = { details: a.details, phone: a.phone, city: a.city };
      } else {
        if (form.details.trim().length < 5) throw new Error("Enter your address details");
        if (!isEgyptPhone(form.phone)) throw new Error("Enter a valid Egyptian phone number");
        if (!form.city.trim()) throw new Error("Enter your city");
        ship = { details: form.details.trim(), phone: form.phone, city: form.city.trim(), ...(form.postalCode ? { postalCode: form.postalCode } : {}) };
      }
      if (method === "cash") {
        await orderApi.createCash(cart.cartId, ship);
        return null;
      }
      const res = await orderApi.checkoutSession(cart.cartId, ship, window.location.origin);
      return res.session.url;
    },
    onSuccess: (url) => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      if (url) window.location.href = url; // Stripe checkout page
      else { toast.success("Order placed successfully 🎉"); router.push("/profile/orders"); }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <Spinner className="min-h-[40vh]" />;
  if (!cart || cart.items.length === 0)
    return <div className="container-fc py-16"><EmptyState title="Your cart is empty" href="/products" cta="Start shopping" /></div>;

  const total = cart.totalAfterDiscount ?? cart.totalPrice;
  const field = (k: keyof typeof form, label: string, ph: string, type = "text") => (
    <label className="block text-sm font-medium">{label}
      <input type={type} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} placeholder={ph} className="input-fc mt-1.5" />
    </label>
  );
  const radio = "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition";

  return (
    <div className="container-fc grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <section className="card-fc p-6">
          <h2 className="mb-4 text-lg font-bold">Shipping address</h2>
          <div className="space-y-3">
            {addresses.data?.map((a) => (
              <label key={a._id} className={`${radio} ${selected === a._id ? "border-primary bg-primary-light" : "border-line"}`}>
                <input type="radio" name="addr" checked={selected === a._id} onChange={() => setSelected(a._id)} className="mt-1 accent-primary" />
                <span className="text-sm"><b>{a.name}</b><br />{a.details}, {a.city}<br /><span className="text-muted">{a.phone}</span></span>
              </label>
            ))}
            <label className={`${radio} ${selected === "new" ? "border-primary bg-primary-light" : "border-line"}`}>
              <input type="radio" name="addr" checked={selected === "new"} onChange={() => setSelected("new")} className="mt-1 accent-primary" />
              <span className="text-sm font-semibold">Use a new address</span>
            </label>
          </div>
          {selected === "new" && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">{field("details", "Address details", "Street, building, apartment")}</div>
              {field("phone", "Phone", "01xxxxxxxxx", "tel")}
              {field("city", "City", "Cairo")}
              {field("postalCode", "Postal code (optional)", "12345")}
            </div>
          )}
          <p className="mt-3 text-xs text-muted">Manage saved addresses from <Link href="/profile?tab=addresses" className="font-semibold text-primary">your profile</Link>.</p>
        </section>

        <section className="card-fc p-6">
          <h2 className="mb-4 text-lg font-bold">Payment method</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={`${radio} ${method === "cash" ? "border-primary bg-primary-light" : "border-line"}`}>
              <input type="radio" name="pay" checked={method === "cash"} onChange={() => setMethod("cash")} className="mt-1 accent-primary" />
              <span className="text-sm"><b className="flex items-center gap-2"><Banknote size={16} /> Cash on delivery</b><span className="text-muted">Pay when your order arrives</span></span>
            </label>
            <label className={`${radio} ${method === "online" ? "border-primary bg-primary-light" : "border-line"}`}>
              <input type="radio" name="pay" checked={method === "online"} onChange={() => setMethod("online")} className="mt-1 accent-primary" />
              <span className="text-sm"><b className="flex items-center gap-2"><CreditCard size={16} /> Pay online</b><span className="text-muted">Secure card payment</span></span>
            </label>
          </div>
        </section>
      </div>

      <aside className="card-fc h-fit space-y-4 p-6">
        <h2 className="text-lg font-bold">Order Summary</h2>
        <ul className="max-h-60 space-y-2 overflow-y-auto text-sm">
          {cart.items.map((i) => (
            <li key={i._id} className="flex justify-between gap-3"><span className="line-clamp-1 text-muted">{i.count} × {i.product.title}</span><span className="font-semibold">{money(i.price * i.count)}</span></li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-line pt-3 text-base"><b>Total</b><b className="text-primary">{money(total)}</b></div>
        <button onClick={() => place.mutate()} disabled={place.isPending} className="btn-primary w-full py-3.5">
          {place.isPending ? "Processing..." : method === "cash" ? "Place Order" : "Continue to Payment"}
        </button>
      </aside>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <PageHeader title="Checkout" />
      <Content />
    </RequireAuth>
  );
}
