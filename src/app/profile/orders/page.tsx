"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import RequireAuth from "@/components/ui/RequireAuth";
import { EmptyState, ErrorState, PageHeader, Spinner } from "@/components/ui/Feedback";
import { orderApi } from "@/lib/api";
import { money } from "@/lib/utils";
import { useAuth } from "@/providers/AuthContext";

const badge = (on: boolean, yes: string, no: string) => (
  <span className={`rounded-full px-3 py-1 text-xs font-bold ${on ? "bg-primary-soft text-primary-dark" : "bg-amber-100 text-amber-700"}`}>{on ? yes : no}</span>
);

function Content() {
  const { userId } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", userId],
    queryFn: () => orderApi.userOrders(userId as string),
    enabled: !!userId,
  });
  if (isLoading) return <Spinner className="min-h-[40vh]" />;
  if (error) return <div className="container-fc py-10"><ErrorState message={(error as Error).message} /></div>;
  const orders = [...(data ?? [])].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  if (!orders.length) return <div className="container-fc py-16"><EmptyState icon={<Package size={28} />} title="No orders yet" text="Your orders will show up here." href="/products" cta="Start shopping" /></div>;
  return (
    <div className="container-fc space-y-5 py-10">
      {orders.map((o) => (
        <div key={o._id} className="card-fc overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-gray-50 px-5 py-4">
            <div className="text-sm"><p className="font-bold">Order #{o.id ?? o._id.slice(-6)}</p><p className="text-muted">{new Date(o.createdAt).toLocaleDateString()} · {o.paymentMethodType === "cash" ? "Cash" : "Card"}</p></div>
            <div className="flex items-center gap-2">{badge(o.isPaid, "Paid", "Unpaid")}{badge(o.isDelivered, "Delivered", "Processing")}<b className="ml-2 text-primary">{money(o.totalOrderPrice)}</b></div>
          </div>
          <ul className="divide-y divide-line">
            {o.cartItems.map((i) => (
              <li key={i._id} className="flex items-center gap-4 px-5 py-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                  {i.product?.imageCover && <Image src={i.product.imageCover} alt="" fill unoptimized sizes="56px" className="object-contain" />}
                </div>
                <p className="line-clamp-1 flex-1 text-sm font-medium">{i.product?.title ?? "Product"}</p>
                <p className="text-sm text-muted">{i.count} × {money(i.price)}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <RequireAuth>
      <PageHeader title="My Orders" />
      <Content />
    </RequireAuth>
  );
}
