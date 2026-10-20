import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";

const cols: { title: string; links: [string, string][] }[] = [
  { title: "Shop", links: [["All Products", "/products"], ["Categories", "/categories"], ["Brands", "/brands"], ["Deals", "/deals"]] },
  { title: "Account", links: [["My Account", "/profile"], ["Order History", "/profile/orders"], ["Wishlist", "/wishlist"], ["Shopping Cart", "/cart"], ["Sign In", "/login"], ["Create Account", "/register"]] },
  { title: "Support", links: [["Contact Us", "/contact"], ["Help Center", "/help"], ["Shipping Info", "/shipping"], ["Returns & Refunds", "/returns"], ["Track Order", "/track-order"]] },
  { title: "Legal", links: [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Cookie Policy", "/cookies"]] },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="container-fc grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-6">
        <div className="space-y-4 lg:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            FreshCart is your one-stop destination for quality products. From fashion to electronics, we bring you the best brands at competitive prices with a seamless shopping experience.
          </p>
          <div className="space-y-2 text-sm text-muted">
            <p className="flex items-center gap-2"><Phone size={15} className="text-primary" /> +1 (800) 123-4567</p>
            <p className="flex items-center gap-2"><Mail size={15} className="text-primary" /> support@freshcart.com</p>
            <p className="flex items-center gap-2"><MapPin size={15} className="text-primary" /> 123 Commerce Street, New York, NY 10001</p>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="mb-4 font-bold">{c.title}</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              {c.links.map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-primary">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-fc flex flex-col items-center justify-between gap-3 py-5 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} FreshCart. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs font-semibold"><span>Visa</span><span>Mastercard</span><span>PayPal</span></div>
        </div>
      </div>
    </footer>
  );
}
