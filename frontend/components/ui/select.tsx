import * as React from "react";

export function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      className="h-10 w-full rounded-xl border border-[#C9D0C1] bg-white px-3 py-2 text-sm text-[#101410] outline-none transition focus:border-[#101410]"
      {...props}
    >
      {children}
    </select>
  );
}
