export function LoadingState() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#DADFD2] bg-[#F7F8F3] px-4 py-3 text-sm text-[#5D6458]">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#B7F500]" />
      Assistant is preparing a response...
    </div>
  );
}
