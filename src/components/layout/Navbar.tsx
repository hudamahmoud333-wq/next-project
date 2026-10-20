"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown, Gift, Headphones, Heart, LogOut, Mail, MapPin, Menu, Package, Phone,
  Search, ShoppingCart, Truck, User, UserPlus, X,
} from "lucide-react";
import { catalogApi } from "@/lib/api";
import { useAuth } from "@/providers/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import Logo from "./Logo";

export default function Navbar() {
  const { token, user, logout, ready } = useAuth();
  const { cart } = useCart();
  const { items: wish } = useWishlist();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [mobile, setMobile] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  const { data: cats } = useQuery({
    queryKey: ["categories", "nav"],
    queryFn: () => catalogApi.categories(),
    staleTime: 10 * 60_000,
  });

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    setMobile(false);
    router.push(q.trim() ? `/products?keyword=${encodeURIComponent(q.trim())}` : "/products");
  };
  const go = () => setMobile(false);
  const signedIn = ready && !!token;
  const link = "text-[15px] font-medium text-ink transition hover:text-primary";
  const iconBtn = "relative rounded-full p-2 text-ink transition hover:bg-primary-light hover:text-primary";
  const badge = "absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white";

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* top bar */}
      <div className="hidden border-b border-line text-[13px] text-muted md:block">
        <div className="container-fc flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><Truck size={15} className="text-primary" /> Free Shipping on Orders 500 EGP</span>
            <span className="flex items-center gap-2"><Gift size={15} className="text-primary" /> New Arrivals Daily</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="tel:+18001234567" className="flex items-center gap-1.5 hover:text-primary"><Phone size={14} /> +1 (800) 123-4567</a>
            <a href="mailto:support@freshcart.com" className="flex items-center gap-1.5 hover:text-primary"><Mail size={14} /> support@freshcart.com</a>
            {!signedIn && (
              <>
                <span className="h-4 w-px bg-line" />
                <Link href="/login" className="flex items-center gap-1.5 hover:text-primary"><User size={14} /> Sign In</Link>
                <Link href="/register" className="flex items-center gap-1.5 hover:text-primary"><UserPlus size={14} /> Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* main bar */}
      <div className="container-fc flex items-center gap-4 py-3 lg:gap-8">
        <Logo />
        <form onSubmit={search} className="relative hidden max-w-md flex-1 md:block">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for products, brands and more..." className="w-full rounded-full border border-line bg-white py-3 pl-5 pr-14 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          <button aria-label="Search" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-primary p-2.5 text-white hover:bg-primary-dark"><Search size={16} /></button>
        </form>

        <nav className="hidden items-center gap-7 lg:flex">
          <Link href="/" className={link}>Home</Link>
          <Link href="/products" className={link}>Shop</Link>
          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button className={`${link} flex items-center gap-1`}>Categories <ChevronDown size={15} /></button>
            {catOpen && (
              <div className="absolute left-0 top-full w-56 pt-3">
                <div className="card-fc overflow-hidden py-2">
                  <Link href="/categories" onClick={() => setCatOpen(false)} className="block px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-light">All Categories</Link>
                  {cats?.data.slice(0, 6).map((c) => (
                    <Link key={c._id} href={`/products?category=${c._id}`} onClick={() => setCatOpen(false)} className="block px-4 py-2 text-sm hover:bg-primary-light hover:text-primary">{c.name}</Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link href="/brands" className={link}>Brands</Link>
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link href="/contact" className="mr-2 hidden items-center gap-2 xl:flex">
            <span className="rounded-full bg-primary-light p-2.5 text-primary"><Headphones size={18} /></span>
            <span className="text-[11px] leading-tight text-muted">Support<br /><b className="text-xs text-ink">24/7 Help</b></span>
          </Link>
          <span className="mx-1 hidden h-8 w-px bg-line xl:block" />
          <Link href="/wishlist" className={iconBtn} aria-label="Wishlist">
            <Heart size={22} />
            {signedIn && wish.length > 0 && <span className={badge}>{wish.length}</span>}
          </Link>
          <Link href="/cart" className={iconBtn} aria-label="Cart">
            <ShoppingCart size={22} />
            {signedIn && !!cart?.numOfCartItems && <span className={badge}>{cart.numOfCartItems}</span>}
          </Link>

          {signedIn ? (
            <div className="relative" ref={userRef}>
              <button onClick={() => setUserOpen((o) => !o)} className="ml-1 flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
                <User size={16} /> <span className="hidden max-w-24 truncate sm:inline">{user?.name?.split(" ")[0] ?? "Account"}</span> <ChevronDown size={14} />
              </button>
              {userOpen && (
                <div className="card-fc absolute right-0 top-full mt-2 w-52 overflow-hidden py-2">
                  <Link href="/profile" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary-light"><User size={15} /> My Profile</Link>
                  <Link href="/profile/orders" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary-light"><Package size={15} /> My Orders</Link>
                  <Link href="/profile?tab=addresses" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary-light"><MapPin size={15} /> Addresses</Link>
                  <button onClick={() => { logout(); setUserOpen(false); router.push("/"); }} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"><LogOut size={15} /> Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-primary ml-1 hidden sm:inline-flex"><User size={16} /> Sign In</Link>
          )}
          <button className={`${iconBtn} lg:hidden`} onClick={() => setMobile((m) => !m)} aria-label="Menu">
            {mobile ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* mobile panel */}
      {mobile && (
        <div className="border-t border-line bg-white lg:hidden">
          <div className="container-fc space-y-4 py-4">
            <form onSubmit={search} className="relative">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." className="input-fc rounded-full pr-12" />
              <button aria-label="Search" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-primary p-2 text-white"><Search size={16} /></button>
            </form>
            <div className="grid gap-1 text-sm font-medium">
              {[["/", "Home"], ["/products", "Shop"], ["/categories", "Categories"], ["/brands", "Brands"], ["/contact", "Support"]].map(([href, label]) => (
                <Link key={href} href={href} onClick={go} className="rounded-lg px-3 py-2.5 hover:bg-primary-light">{label}</Link>
              ))}
              {!signedIn && (
                <>
                  <Link href="/login" onClick={go} className="rounded-lg px-3 py-2.5 hover:bg-primary-light">Sign In</Link>
                  <Link href="/register" onClick={go} className="rounded-lg px-3 py-2.5 hover:bg-primary-light">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
