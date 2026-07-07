export function LoadingState() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#262D3D] bg-white/5 px-4 py-3 text-sm text-[#9CA3AF]">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#4F8CFF]" />
      Assistant is preparing a response...
    </div>
  );
}
