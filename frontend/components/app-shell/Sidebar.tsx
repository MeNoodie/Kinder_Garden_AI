import { MessageSquare, Plus, Search, Settings } from "lucide-react";

export const modeOptions = [
  { value: "text-to-text", label: "Text -> Text" },
  { value: "text-to-speech", label: "Text -> Speech" },
  { value: "text-to-image", label: "Text -> Image" },
  { value: "image-to-text", label: "Image -> Text" },
  { value: "speech-to-text", label: "Speech -> Text" },
];

export const modelOptions = [
  { value: "gemini-3.5-flash", label: "Text | Google | gemini-3.5-flash" },
  { value: "glm-5.2:cloud", label: "Text | Ollama | glm-5.2:cloud" },
  { value: "openai/gpt-oss-120b", label: "Text | Groq | openai/gpt-oss-120b" },
  { value: "gemini-2.5-pro", label: "Vision | Google | gemini-2.5-pro" },
  { value: "llava", label: "Vision | Ollama | llava" },
  { value: "whisper-large-v3", label: "Speech | Groq | whisper-large-v3" },
  { value: "black-forest-labs/FLUX.1-schnell", label: "Image | Hugging Face | FLUX.1-schnell" },
] as const;

const chats = [
  ["New Conversation", "Welcome to the multimodal...", "09:14"],
  ["Image analysis", "What's in this image?", "Yesterday"],
  ["Project ideas", "Help me brainstorm...", "Sep 6"],
  ["Python help", "How to fix this error?", "Sep 5"],
  ["Audio transcription", "Transcribe this audio", "Sep 4"],
];

export function Sidebar() {
  return (
    <div className="flex h-full flex-col px-5 py-6">
      <div className="px-3">
        <div className="flex items-center gap-3 text-sm"><span className="font-bold tracking-[0.08em]">MULTIMODAL AI</span><span className="h-2 w-2 rounded-full bg-[#caff37]" /><span className="text-[#697065]">Playground</span></div>
        <p className="mt-1 text-sm text-[#7a8177]">One interface. Multiple models.</p>
      </div>
      <button className="mt-10 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#caff37] text-sm font-semibold shadow-[inset_0_-1px_0_rgba(0,0,0,0.07)] transition hover:bg-[#bcec2e]"><Plus className="h-5 w-5" /> New Chat</button>
      <div className="mt-8 flex items-center justify-between px-3"><h2 className="text-sm font-semibold text-[#4d544b]">Chats</h2><Search className="h-5 w-5 text-[#3e443c]" /></div>
      <nav className="mt-4 space-y-1.5">
        {chats.map(([title, preview, date], index) => <button key={title} className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-[#f2f5ed] ${index === 0 ? "border-l-2 border-[#caff37] bg-[#f2f8e7]" : ""}`}><span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${index === 0 ? "bg-[#e6f6bf]" : "bg-white"}`}><MessageSquare className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{title}</span><span className="mt-1 block truncate text-xs text-[#737a70]">{preview}</span></span><span className="shrink-0 text-xs text-[#737a70]">{date}</span></button>)}
      </nav>
      <div className="mt-auto border-t border-[#e1e5dc] pt-5"><button className="flex items-center gap-3 px-3 text-sm font-medium"><Settings className="h-4 w-4" /> Settings</button><div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#edf0e9] bg-white p-3 shadow-sm"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111711] text-sm font-semibold text-white">GU</div><div><p className="text-sm font-medium">Guest User</p><p className="mt-0.5 text-xs text-[#747b71]">Multimodal Playground</p></div></div></div>
    </div>
  );
}
