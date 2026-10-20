"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cartApi } from "@/lib/api";
import { useAuth } from "@/providers/AuthContext";

export function useCart() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["cart", token], queryFn: cartApi.get, enabled: !!token });
  const refresh = () => qc.invalidateQueries({ queryKey: ["cart"] });
  const onError = (e: Error) => toast.error(e.message);

  const add = useMutation({
    mutationFn: (id: string) => cartApi.add(id),
    onSuccess: () => {
      toast.success("Added to cart");
      refresh();
    },
    onError,
  });
  const update = useMutation({
    mutationFn: ({ id, count }: { id: string; count: number }) => cartApi.update(id, count),
    onSuccess: refresh,
    onError,
  });
  const remove = useMutation({
    mutationFn: (id: string) => cartApi.remove(id),
    onSuccess: () => {
      toast.success("Item removed");
      refresh();
    },
    onError,
  });
  const clear = useMutation({
    mutationFn: cartApi.clear,
    onSuccess: () => {
      toast.success("Cart cleared");
      refresh();
    },
    onError,
  });
  const coupon = useMutation({
    mutationFn: (name: string) => cartApi.applyCoupon(name),
    onSuccess: () => {
      toast.success("Coupon applied");
      refresh();
    },
    onError,
  });

  return { cart: query.data, isLoading: query.isLoading, error: query.error, add, update, remove, clear, coupon };
}
