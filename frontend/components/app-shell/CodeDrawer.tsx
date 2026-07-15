import { X } from "lucide-react";

export function CodeDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col px-5 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.16em] text-[#5D6458]">Implementation</p>
          <h2 className="text-xl font-semibold">Code drawer</h2>
          <p className="text-sm leading-6 text-[#5D6458]">
            See the basic route flow for the selected mode.
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#101410] bg-white text-[#101410] transition hover:bg-[#D7FF5F]"
          aria-label="Close code drawer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <hr className="my-5 border-[#DADFD2]" />

      <div className="space-y-4">
        <span className="inline-flex rounded-full bg-[#D7FF5F] px-3 py-1 text-xs font-medium text-[#101410]">
          Route flow
        </span>
        <div className="rounded-2xl border border-[#DADFD2] bg-white p-4">
          <pre className="overflow-x-auto text-sm leading-6 text-[#5D6458]">
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
