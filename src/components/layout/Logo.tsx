import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <ShoppingCart className="text-primary" size={30} strokeWidth={2.4} />
      <span className={`text-2xl font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}>FreshCart</span>
    </Link>
  );
}
