import * as React from "react";

export function Avatar({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`relative inline-flex overflow-hidden rounded-full ${className}`} {...props} />;
}

export function AvatarFallback({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full ${className}`}
      {...props}
    />
  );
}
