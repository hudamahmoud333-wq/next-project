import Link from "next/link";
import { Loader2 } from "lucide-react";

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center py-16 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export function EmptyState({
  title, text, href, cta, icon,
}: { title: string; text?: string; href?: string; cta?: string; icon?: React.ReactNode }) {
  return (
    <div className="card-fc mx-auto flex max-w-lg flex-col items-center gap-3 px-6 py-14 text-center">
      {icon && <div className="rounded-full bg-primary-light p-4 text-primary">{icon}</div>}
      <h2 className="text-xl font-bold">{title}</h2>
      {text && <p className="text-sm text-muted">{text}</p>}
      {href && cta && (
        <Link href={href} className="btn-primary mt-2">
          {cta}
        </Link>
      )}
    </div>
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
      {message ?? "Something went wrong. Please try again."}
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="bg-gradient-to-r from-primary to-emerald-500 py-10 text-white">
      <div className="container-fc">
        <h1 className="text-3xl font-extrabold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-white/90">{subtitle}</p>}
      </div>
    </div>
  );
}
