"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Feedback";

// The payment provider sends the customer back here after an online payment.
export default function AllOrdersRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/profile/orders"); }, [router]);
  return <Spinner className="min-h-[50vh]" />;
}
