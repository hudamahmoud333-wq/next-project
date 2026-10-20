"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";
import { isEmail } from "@/lib/utils";
import { useAuth } from "@/providers/AuthContext";
import AuthCard, { Field } from "@/components/ui/AuthCard";

function LoginForm() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect") ?? "/";
  const { login } = useAuth();
  const [f, setF] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!isEmail(f.email)) err.email = "Enter a valid email";
    if (f.password.length < 6) err.password = "Password must be at least 6 characters";
    setErrors(err);
    if (Object.keys(err).length) return;
    setLoading(true);
    try {
      const res = await authApi.signin(f);
      login(res.token, res.user);
      toast.success(`Welcome back, ${res.user.name.split(" ")[0]}!`);
      router.replace(redirect.startsWith("/") ? redirect : "/");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to continue shopping">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={errors.email} placeholder="you@example.com" autoComplete="email" />
        <Field label="Password" type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} error={errors.password} placeholder="••••••••" autoComplete="current-password" />
        <div className="text-right text-sm"><Link href="/forgot-password" className="font-semibold text-primary">Forgot password?</Link></div>
        <button disabled={loading} className="btn-primary w-full py-3">{loading ? "Signing in..." : "Sign In"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">New to FreshCart? <Link href="/register" className="font-semibold text-primary">Create an account</Link></p>
    </AuthCard>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
