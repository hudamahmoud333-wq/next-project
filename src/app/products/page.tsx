import { Suspense } from "react";
import ProductsView from "./ProductsView";
import { Spinner } from "@/components/ui/Feedback";

export default function ProductsPage() {
  return (
    <Suspense fallback={<Spinner className="min-h-[60vh]" />}>
      <ProductsView />
    </Suspense>
  );
}
