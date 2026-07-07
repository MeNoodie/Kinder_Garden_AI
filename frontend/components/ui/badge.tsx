import * as React from "react";

export function Badge({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`inline-flex items-center px-2.5 py-1 text-xs ${className}`} {...props} />;
}
