import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export function CodeDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col px-5 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Implementation</p>
          <h2 className="text-xl font-semibold">Code drawer</h2>
          <p className="text-sm leading-6 text-[#9CA3AF]">
            Step 2 only reserves space for the teaching panel. We will wire syntax highlighting,
            diagrams, and code snippets in the next step.
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#262D3D] bg-white/5 text-[#F3F4F6] transition hover:bg-[rgba(79,140,255,0.12)]"
          aria-label="Close code drawer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <Separator className="my-5 bg-[#262D3D]" />

      <div className="space-y-4">
        <Badge className="rounded-full border border-[#14D99B]/20 bg-[#14D99B]/10 text-[#14D99B]">
          420px drawer
        </Badge>
        <div className="rounded-2xl border border-[#262D3D] bg-[#0B0F19] p-4">
          <pre className="overflow-x-auto text-sm leading-6 text-[#9CA3AF]">
{`Speech -> Text
Audio
  v
Whisper
  v
Transcript
  v
Llama
  v
Response`}
          </pre>
        </div>
      </div>
    </div>
  );
}
