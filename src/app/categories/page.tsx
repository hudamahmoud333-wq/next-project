"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "@/lib/api";
import { ErrorState, PageHeader, Spinner } from "@/components/ui/Feedback";

export default function CategoriesPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["categories", "all"], queryFn: () => catalogApi.categories() });
  return (
    <>
      <PageHeader title="All Categories" subtitle="Browse our wide range of product categories" />
      <div className="container-fc py-10">
        {isLoading ? <Spinner /> : error ? <ErrorState message={(error as Error).message} /> : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {data?.data.map((c) => (
              <Link key={c._id} href={`/categories/${c._id}`} className="card-fc group overflow-hidden transition hover:shadow-lg">
                <div className="relative aspect-square bg-gray-50">
                  <Image src={c.image} alt={c.name} fill unoptimized sizes="25vw" className="object-cover transition duration-300 group-hover:scale-105" />
                </div>
                <p className="p-4 text-center font-bold group-hover:text-primary">{c.name}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
