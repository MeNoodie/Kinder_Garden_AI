import { Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="rounded-[28px] border border-dashed border-[#262D3D] bg-white/3 px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4F8CFF]/12 text-[#4F8CFF]">
        <Sparkles className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-lg font-medium">Start a routed conversation</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#9CA3AF]">
        This is the calm empty state for the chat surface. It keeps the layout readable before the
        first message arrives.
      </p>
    </div>
  );
}
