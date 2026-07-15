import Link from "next/link";
import { Menu } from "lucide-react";

export function TopBar({
  onShowCode,
  showCodeAvailable,
}: {
  onShowCode: () => void;
  showCodeAvailable: boolean;
}) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[#DADFD2] bg-white px-5 md:px-7">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.18em]">
          Multimodal AI
        </Link>
        <span className="hidden h-1.5 w-1.5 rounded-full bg-[#B7F500] md:block" />
        <span className="hidden text-sm text-[#5D6458] md:block">Playground</span>
      </div>
      {showCodeAvailable ? (
        <button
          onClick={onShowCode}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#101410] bg-white text-[#101410] transition hover:bg-[#D7FF5F]"
          title="Show code"
        >
          <Menu className="h-4 w-4" />
        </button>
      ) : (
        <span className="text-sm text-[#5D6458]">Select a mode</span>
      )}
    </header>
  );
}
