"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { title: "Fresh Products Delivered to your Door", text: "Get 20% off your first order", a: ["Shop Now", "/products"], b: ["View Deals", "/deals"] },
  { title: "Premium Quality Guaranteed", text: "Fresh from farm to your table", a: ["Shop Now", "/products"], b: ["Learn More", "/about"] },
  { title: "Fast & Free Delivery", text: "Same day delivery available", a: ["Order Now", "/products"], b: ["Delivery Info", "/delivery"] },
] as const;

export default function HeroSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [i]);
  const go = (n: number) => setI((n + slides.length) % slides.length);
  const s = slides[i];

  return (
    <section className="relative h-100 overflow-hidden bg-primary">
      <Image src="/hero.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      {/* green overlay like the demo */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-emerald-400/60" />
      <div className="container-fc relative flex h-full items-center">
        <div key={i} className="max-w-xl animate-[fadeIn_.6s_ease] px-8 text-white sm:px-12">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">{s.title}</h1>
          <p className="mt-3 text-lg text-white/95">{s.text}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={s.a[1]} className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary hover:bg-primary-light">{s.a[0]}</Link>
            <Link href={s.b[1]} className="rounded-lg border-2 border-white/70 px-6 py-3 text-sm font-bold hover:bg-white/10">{s.b[0]}</Link>
          </div>
        </div>
      </div>
      <button onClick={() => go(i - 1)} aria-label="Previous slide" className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 text-primary shadow hover:scale-105"><ChevronLeft size={18} /></button>
      <button onClick={() => go(i + 1)} aria-label="Next slide" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 text-primary shadow hover:scale-105"><ChevronRight size={18} /></button>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, n) => (
          <button key={n} onClick={() => setI(n)} aria-label={`Slide ${n + 1}`} className={`h-2 rounded-full transition-all ${n === i ? "w-8 bg-white" : "w-2 bg-white/60"}`} />
        ))}
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}
