"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { wishlistApi } from "@/lib/api";
import { useAuth } from "@/providers/AuthContext";

export function useWishlist() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const router = useRouter();
  const query = useQuery({ queryKey: ["wishlist", token], queryFn: wishlistApi.get, enabled: !!token });
  const items = query.data?.data ?? [];
  const ids = new Set(items.map((p) => p._id));

  const toggle = useMutation({
    mutationFn: async (id: string) => {
      if (ids.has(id)) await wishlistApi.remove(id);
      else await wishlistApi.add(id);
      return !ids.has(id);
    },
    onSuccess: (added) => {
      toast.success(added ? "Added to wishlist" : "Removed from wishlist");
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleProduct = (id: string) => {
    if (!token) {
      toast("Please sign in first");
      router.push("/login");
      return;
    }
    toggle.mutate(id);
  };

  return { items, ids, isLoading: query.isLoading, toggleProduct, pending: toggle.isPending };
}

export function useAddToCartGuard() {
  const { token } = useAuth();
  const router = useRouter();
  return (run: () => void) => {
    if (!token) {
      toast("Please sign in to add items to your cart");
      router.push("/login");
      return;
    }
    run();
  };
}
