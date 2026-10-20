import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page, pages, onChange,
}: { page: number; pages: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1);
  const btn = "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition";
  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button className={`${btn} border-line bg-white hover:border-primary disabled:opacity-40`} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft size={16} />
      </button>
      {nums.map((n) => (
        <button key={n} onClick={() => onChange(n)} className={`${btn} ${n === page ? "border-primary bg-primary text-white" : "border-line bg-white hover:border-primary"}`}>
          {n}
        </button>
      ))}
      <button className={`${btn} border-line bg-white hover:border-primary disabled:opacity-40`} disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
