import { ChevronRight } from "lucide-react";

export function TopBar({
  onShowCode,
  showCodeAvailable,
}: {
  onShowCode: () => void;
  showCodeAvailable: boolean;
}) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-[#262D3D] bg-[#111827]/70 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        <div className="h-2.5 w-2.5 rounded-full bg-[#14D99B]" />
        <span className="text-sm text-[#9CA3AF]">Multimodal AI Playground</span>
      </div>
      {showCodeAvailable ? (
        <button
          onClick={onShowCode}
          className="inline-flex items-center gap-2 rounded-full border border-[#262D3D] bg-white/5 px-3 py-1.5 text-sm text-[#F3F4F6] transition hover:bg-[rgba(79,140,255,0.12)]"
        >
          Show Code
          <ChevronRight className="h-4 w-4" />
        </button>
      ) : (
        <span className="text-sm text-[#9CA3AF]">Select a mode to enable code panel</span>
      )}
    </header>
  );
}
