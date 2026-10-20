"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/ui/Feedback";

export default function ContactPage() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  return (
    <>
      <PageHeader title="Contact Support" subtitle="We're here to help 24/7" />
      <div className="container-fc grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Thanks! We'll get back to you soon."); setF({ name: "", email: "", message: "" }); }} className="card-fc space-y-4 p-6">
          <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Your name" className="input-fc" />
          <input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="Your email" className="input-fc" />
          <textarea required rows={6} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} placeholder="How can we help?" className="input-fc" />
          <button className="btn-primary">Send message</button>
        </form>
        <aside className="card-fc h-fit space-y-4 p-6 text-sm">
          <p className="flex items-center gap-3"><Phone size={18} className="text-primary" /> +1 (800) 123-4567</p>
          <p className="flex items-center gap-3"><Mail size={18} className="text-primary" /> support@freshcart.com</p>
          <p className="flex items-center gap-3"><MapPin size={18} className="text-primary" /> 123 Commerce Street, New York, NY 10001</p>
        </aside>
      </div>
    </>
  );
}
