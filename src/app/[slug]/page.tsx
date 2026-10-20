import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/Feedback";

const pages: Record<string, { title: string; body: string[] }> = {
  about: { title: "About FreshCart", body: ["FreshCart is your one-stop destination for quality products, from fashion to electronics.", "We work with trusted brands to bring you competitive prices and a seamless shopping experience."] },
  delivery: { title: "Delivery Info", body: ["Same day delivery is available in selected areas.", "Orders over 500 EGP qualify for free shipping."] },
  help: { title: "Help Center", body: ["Find answers about orders, payments and your account.", "Can't find what you need? Contact our support team any time."] },
  shipping: { title: "Shipping Info", body: ["We ship across Egypt. Delivery times depend on your city.", "You will receive updates as your order moves along."] },
  returns: { title: "Returns & Refunds", body: ["We offer a 14-day return policy on eligible items.", "Refunds are issued to the original payment method after inspection."] },
  "track-order": { title: "Track Order", body: ["Sign in and open My Orders to follow the status of every order you placed."] },
  privacy: { title: "Privacy Policy", body: ["We collect only the information needed to process your orders and improve our service.", "We never sell your personal data."] },
  terms: { title: "Terms of Service", body: ["By using FreshCart you agree to our terms of use, pricing and return policies."] },
  cookies: { title: "Cookie Policy", body: ["We use cookies and local storage to keep you signed in and remember your cart."] },
};

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();
  return (
    <>
      <PageHeader title={page.title} />
      <div className="container-fc max-w-3xl py-10">
        <div className="card-fc space-y-4 p-8 leading-relaxed text-muted">
          {page.body.map((t) => <p key={t}>{t}</p>)}
          <Link href="/" className="inline-block font-semibold text-primary">← Back to home</Link>
        </div>
      </div>
    </>
  );
}
