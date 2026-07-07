import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy } from "lucide-react";

export function Message({
  role,
  content,
  time,
}: {
  role: "user" | "assistant";
  content: string;
  time: string;
}) {
  const isAssistant = role === "assistant";

  return (
    <article
      className={`rounded-[24px] border px-4 py-4 ${
        isAssistant
          ? "border-[#262D3D] bg-[#161B26]/80"
          : "border-[#4F8CFF]/20 bg-[rgba(79,140,255,0.08)]"
      }`}
    >
      <div className="mb-3 flex items-center justify-between text-xs text-[#9CA3AF]">
        <span>{isAssistant ? "Assistant" : "You"}</span>
        <div className="flex items-center gap-3">
          <span>{time}</span>
          {isAssistant && <Copy className="h-3.5 w-3.5 cursor-pointer" />}
        </div>
      </div>
      <div className="prose prose-invert max-w-none prose-p:leading-7 prose-pre:bg-[#0B0F19] prose-pre:border prose-pre:border-[#262D3D] prose-code:text-[#F3F4F6]">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </article>
  );
}
