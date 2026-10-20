import { RotateCcw, ShieldCheck, Truck, Headphones } from "lucide-react";

const items = [
  { icon: Truck, title: "Free Shipping", text: "On orders over 500 EGP", color: "bg-blue-50 text-blue-500" },
  { icon: ShieldCheck, title: "Secure Payment", text: "100% secure transactions", color: "bg-green-50 text-primary" },
  { icon: RotateCcw, title: "Easy Returns", text: "14-day return policy", color: "bg-orange-50 text-orange-500" },
  { icon: Headphones, title: "24/7 Support", text: "Dedicated support team", color: "bg-purple-50 text-purple-500" },
];

export default function FeatureBar() {
  return (
    <section className="container-fc -mt-0 grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ icon: Icon, title, text, color }) => (
        <div key={title} className="card-fc flex items-center gap-4 p-5">
          <span className={`rounded-full p-4 ${color}`}><Icon size={22} /></span>
          <div>
            <h3 className="text-sm font-bold">{title}</h3>
            <p className="text-xs text-muted">{text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
