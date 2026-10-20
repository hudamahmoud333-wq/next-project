"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";
import { isEmail } from "@/lib/utils";
import { useAuth } from "@/providers/AuthContext";
import AuthCard, { Field } from "@/components/ui/AuthCard";

type Step = "email" | "code" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const run = (fn: () => Promise<void>) => async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await fn(); } catch (err) { toast.error((err as Error).message); } finally { setLoading(false); }
  };

  const sendEmail = run(async () => {
    if (!isEmail(email)) throw new Error("Enter a valid email");
    await authApi.forgotPassword(email);
    toast.success("A reset code was sent to your email");
    setStep("code");
  });
  const verify = run(async () => {
    if (!code.trim()) throw new Error("Enter the code");
    await authApi.verifyResetCode(code.trim());
    toast.success("Code verified");
    setStep("reset");
  });
  const reset = run(async () => {
    if (password.length < 6) throw new Error("Password must be at least 6 characters");
    const res = await authApi.resetPassword({ email, newPassword: password });
    login(res.token);
    toast.success("Password updated");
    router.replace("/");
  });

  return (
    <AuthCard title="Forgot password" subtitle={step === "email" ? "We'll email you a reset code" : step === "code" ? `Enter the code sent to ${email}` : "Choose a new password"}>
      {step === "email" && (
        <form onSubmit={sendEmail} className="space-y-4">
          <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <button disabled={loading} className="btn-primary w-full py-3">{loading ? "Sending..." : "Send reset code"}</button>
        </form>
      )}
      {step === "code" && (
        <form onSubmit={verify} className="space-y-4">
          <Field label="Reset code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" inputMode="numeric" />
          <button disabled={loading} className="btn-primary w-full py-3">{loading ? "Verifying..." : "Verify code"}</button>
        </form>
      )}
      {step === "reset" && (
        <form onSubmit={reset} className="space-y-4">
          <Field label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
          <button disabled={loading} className="btn-primary w-full py-3">{loading ? "Saving..." : "Reset password"}</button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted"><Link href="/login" className="font-semibold text-primary">Back to sign in</Link></p>
    </AuthCard>
  );
}
