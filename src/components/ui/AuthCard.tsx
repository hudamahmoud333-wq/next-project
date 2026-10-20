import Logo from "@/components/layout/Logo";

export default function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-primary-light px-4 py-12">
      <div className="card-fc w-full max-w-md p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-5 text-2xl font-extrabold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({
  label, error, ...props
}: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input {...props} className={`input-fc mt-1.5 ${error ? "border-red-400" : ""}`} />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
