"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Lock, MapPin, Package, Trash2, User as UserIcon } from "lucide-react";
import RequireAuth from "@/components/ui/RequireAuth";
import { Field } from "@/components/ui/AuthCard";
import { PageHeader, Spinner } from "@/components/ui/Feedback";
import { addressApi, authApi } from "@/lib/api";
import { isEgyptPhone, isEmail } from "@/lib/utils";
import { useAuth } from "@/providers/AuthContext";

type Tab = "account" | "password" | "addresses";

function AccountTab() {
  const { user, updateUser } = useAuth();
  const [f, setF] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" });
  const m = useMutation({
    mutationFn: () => {
      if (f.name.trim().length < 3) throw new Error("Name must be at least 3 characters");
      if (!isEmail(f.email)) throw new Error("Enter a valid email");
      if (!isEgyptPhone(f.phone)) throw new Error("Enter a valid Egyptian phone number");
      return authApi.updateMe(f);
    },
    onSuccess: (res) => { updateUser({ ...user, ...res.user, phone: f.phone }); toast.success("Profile updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="max-w-lg space-y-4">
      <Field label="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <Field label="Email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <Field label="Phone" type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="01xxxxxxxxx" />
      <button disabled={m.isPending} className="btn-primary">{m.isPending ? "Saving..." : "Save changes"}</button>
    </form>
  );
}

function PasswordTab() {
  const { login } = useAuth();
  const [f, setF] = useState({ currentPassword: "", password: "", rePassword: "" });
  const m = useMutation({
    mutationFn: () => {
      if (f.password.length < 6) throw new Error("New password must be at least 6 characters");
      if (f.password !== f.rePassword) throw new Error("Passwords do not match");
      return authApi.changePassword(f);
    },
    onSuccess: (res) => { login(res.token); setF({ currentPassword: "", password: "", rePassword: "" }); toast.success("Password changed"); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="max-w-lg space-y-4">
      <Field label="Current password" type="password" value={f.currentPassword} onChange={(e) => setF({ ...f, currentPassword: e.target.value })} autoComplete="current-password" />
      <Field label="New password" type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="new-password" />
      <Field label="Confirm new password" type="password" value={f.rePassword} onChange={(e) => setF({ ...f, rePassword: e.target.value })} autoComplete="new-password" />
      <button disabled={m.isPending} className="btn-primary">{m.isPending ? "Saving..." : "Change password"}</button>
    </form>
  );
}

function AddressesTab() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["addresses"], queryFn: addressApi.list });
  const [f, setF] = useState({ name: "", details: "", phone: "", city: "" });
  const add = useMutation({
    mutationFn: () => {
      if (!f.name.trim() || f.details.trim().length < 5 || !f.city.trim()) throw new Error("Fill in all address fields");
      if (!isEgyptPhone(f.phone)) throw new Error("Enter a valid Egyptian phone number");
      return addressApi.add(f);
    },
    onSuccess: () => { toast.success("Address added"); setF({ name: "", details: "", phone: "", city: "" }); qc.invalidateQueries({ queryKey: ["addresses"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => addressApi.remove(id),
    onSuccess: () => { toast.success("Address removed"); qc.invalidateQueries({ queryKey: ["addresses"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-3">
        <h3 className="font-bold">Saved addresses</h3>
        {list.isLoading ? <Spinner /> : list.data?.length ? list.data.map((a) => (
          <div key={a._id} className="card-fc flex items-start justify-between gap-3 p-4 text-sm">
            <div><b>{a.name}</b><p className="text-muted">{a.details}, {a.city}</p><p className="text-muted">{a.phone}</p></div>
            <button onClick={() => del.mutate(a._id)} aria-label="Delete address" className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
          </div>
        )) : <p className="text-sm text-muted">No saved addresses yet.</p>}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); add.mutate(); }} className="space-y-4">
        <h3 className="font-bold">Add a new address</h3>
        <Field label="Label" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Home" />
        <Field label="Address details" value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} placeholder="Street, building, apartment" />
        <Field label="Phone" type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="01xxxxxxxxx" />
        <Field label="City" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} placeholder="Cairo" />
        <button disabled={add.isPending} className="btn-primary">{add.isPending ? "Adding..." : "Add address"}</button>
      </form>
    </div>
  );
}

function ProfileView() {
  const router = useRouter();
  const tab = (useSearchParams().get("tab") as Tab) ?? "account";
  const { user, logout } = useAuth();
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "account", label: "My Account", icon: <UserIcon size={16} /> },
    { id: "password", label: "Change Password", icon: <Lock size={16} /> },
    { id: "addresses", label: "Addresses", icon: <MapPin size={16} /> },
  ];
  return (
    <>
      <PageHeader title="My Profile" subtitle={user ? `${user.name} · ${user.email}` : undefined} />
      <div className="container-fc grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="card-fc h-fit p-3">
          {tabs.map((t) => (
            <Link key={t.id} href={`/profile?tab=${t.id}`} className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold ${tab === t.id ? "bg-primary-light text-primary" : "hover:bg-gray-50"}`}>{t.icon} {t.label}</Link>
          ))}
          <Link href="/profile/orders" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold hover:bg-gray-50"><Package size={16} /> My Orders</Link>
          <button onClick={() => { logout(); router.push("/"); }} className="mt-1 w-full rounded-lg px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50">Sign Out</button>
        </aside>
        <section className="card-fc p-6">
          {tab === "password" ? <PasswordTab /> : tab === "addresses" ? <AddressesTab /> : <AccountTab />}
        </section>
      </div>
    </>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <Suspense fallback={<Spinner className="min-h-[50vh]" />}>
        <ProfileView />
      </Suspense>
    </RequireAuth>
  );
}
