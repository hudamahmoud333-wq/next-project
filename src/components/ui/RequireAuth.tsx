"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";
import { Spinner } from "./Feedback";

/** Client-side route guard: redirects guests to /login and returns here afterwards. */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !token) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [ready, token, router, pathname]);

  if (!ready || !token) return <Spinner className="min-h-[50vh]" />;
  return <>{children}</>;
}
