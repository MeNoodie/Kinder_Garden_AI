import * as React from "react";

export function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      className="h-10 w-full rounded-xl border border-[#262D3D] bg-[#161B26] px-3 py-2 text-[#F3F4F6] outline-none transition focus:border-[#4F8CFF]"
      {...props}
    >
      {children}
    </select>
  );
}
