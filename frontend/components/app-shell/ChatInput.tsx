import { Paperclip, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatInput() {
  return (
    <div className="rounded-[28px] border border-[#262D3D] bg-[#161B26]/90 p-4 shadow-glass backdrop-blur-xl">
      <div className="flex min-h-[128px] flex-col justify-between gap-4">
        <div className="text-sm text-[#9CA3AF]">
          Drag and drop files, paste text, or upload audio and images to start a routed run.
        </div>
        <div className="flex items-end gap-3">
          <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#262D3D] bg-white/5 text-[#F3F4F6] transition hover:bg-[rgba(79,140,255,0.12)]">
            <Paperclip className="h-4 w-4" />
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#262D3D] bg-white/5 text-[#F3F4F6] transition hover:bg-[rgba(79,140,255,0.12)]">
            <Mic className="h-4 w-4" />
          </button>
          <div className="flex min-h-[72px] flex-1 rounded-2xl border border-[#262D3D] bg-[#0B0F19] px-4 py-3 text-sm text-[#9CA3AF]">
            Large input area for prompts, follow-ups, and multimodal instructions.
          </div>
          <Button className="h-11 rounded-2xl bg-[#4F8CFF] px-4 text-white hover:bg-[#4F8CFF]/90">
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
