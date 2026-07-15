import { Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="rounded-[24px] border border-dashed border-[#C9D0C1] bg-[#F7F8F3] px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#D7FF5F] text-[#101410]">
        <Sparkles className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">Start a conversation</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5D6458]">
        Choose a mode and model from the left panel, then send your prompt.
      </p>
    </div>
  );
}
