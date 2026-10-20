"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "@/lib/api";
import { ErrorState, PageHeader, Spinner } from "@/components/ui/Feedback";

export default function BrandsPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["brands", "all"], queryFn: () => catalogApi.brands() });
  return (
    <>
      <PageHeader title="Top Brands" subtitle="Shop from your favourite brands" />
      <div className="container-fc py-10">
        {isLoading ? <Spinner /> : error ? <ErrorState message={(error as Error).message} /> : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {data?.data.map((b) => (
              <Link key={b._id} href={`/products?brand=${b._id}`} className="card-fc group flex flex-col items-center gap-3 p-5 transition hover:border-primary hover:shadow-md">
                <div className="relative h-20 w-full"><Image src={b.image} alt={b.name} fill unoptimized sizes="160px" className="object-contain" /></div>
                <span className="text-sm font-semibold group-hover:text-primary">{b.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
