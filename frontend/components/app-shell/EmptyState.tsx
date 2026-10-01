import { FileText, Image, MessageSquare, Mic, Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-5 pb-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eaffb8] text-[#101410]"><Sparkles className="h-5 w-5" /></div>
      <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">Welcome to Multimodal AI</h2>
      <p className="mt-2 max-w-md text-base text-[#737a70]">Choose a mode and model, then start a conversation.</p>
      <div className="mt-7 grid w-full max-w-[790px] grid-cols-2 gap-3 md:grid-cols-4">
        <Option icon={MessageSquare} title="Text" detail="Chat with AI" />
        <Option icon={Image} title="Image" detail="Upload & analyze" />
        <Option icon={Mic} title="Audio" detail="Speech to text" />
        <Option icon={FileText} title="Documents" detail="Extract information" />
      </div>
    </div>
  );
}

function Option({ icon: Icon, title, detail }: { icon: typeof Sparkles; title: string; detail: string }) {
  return <div className="rounded-2xl border border-[#e1e5dc] bg-white px-3 py-6 shadow-[0_2px_8px_rgba(20,30,15,0.02)]"><Icon className="mx-auto h-6 w-6" /><p className="mt-3 text-sm font-medium">{title}</p><p className="mt-1 text-sm text-[#7a8177]">{detail}</p></div>;
}
