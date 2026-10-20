"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";
import { isEgyptPhone, isEmail } from "@/lib/utils";
import AuthCard, { Field } from "@/components/ui/AuthCard";

export default function RegisterPage() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", rePassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (f.name.trim().length < 3) err.name = "Name must be at least 3 characters";
    if (!isEmail(f.email)) err.email = "Enter a valid email";
    if (!isEgyptPhone(f.phone)) err.phone = "Enter a valid Egyptian phone number (01xxxxxxxxx)";
    if (f.password.length < 6) err.password = "Password must be at least 6 characters";
    if (f.rePassword !== f.password) err.rePassword = "Passwords do not match";
    setErrors(err);
    if (Object.keys(err).length) return;
    setLoading(true);
    try {
      await authApi.signup({ ...f, name: f.name.trim() });
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create your account" subtitle="Join FreshCart and start shopping">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Full name" value={f.name} onChange={set("name")} error={errors.name} placeholder="Your name" autoComplete="name" />
        <Field label="Email" type="email" value={f.email} onChange={set("email")} error={errors.email} placeholder="you@example.com" autoComplete="email" />
        <Field label="Phone" type="tel" value={f.phone} onChange={set("phone")} error={errors.phone} placeholder="01xxxxxxxxx" autoComplete="tel" />
        <Field label="Password" type="password" value={f.password} onChange={set("password")} error={errors.password} placeholder="••••••••" autoComplete="new-password" />
        <Field label="Confirm password" type="password" value={f.rePassword} onChange={set("rePassword")} error={errors.rePassword} placeholder="••••••••" autoComplete="new-password" />
        <button disabled={loading} className="btn-primary w-full py-3">{loading ? "Creating account..." : "Create Account"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link href="/login" className="font-semibold text-primary">Sign in</Link></p>
    </AuthCard>
  );
}
