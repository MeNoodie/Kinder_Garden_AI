import { Copy } from "lucide-react";

export function Message({
  role,
  content,
  time,
  imageUrl,
  audioUrl,
}: {
  role: "user" | "assistant";
  content: string;
  time: string;
  imageUrl?: string;
  audioUrl?: string;
}) {
  const isAssistant = role === "assistant";

  return (
    <article
      className={`rounded-[24px] border px-4 py-4 ${
        isAssistant
          ? "border-[#DADFD2] bg-white"
          : "border-[#C9D0C1] bg-[#F7F8F3]"
      }`}
    >
      <div className="mb-3 flex items-center justify-between text-xs text-[#5D6458]">
        <span>{isAssistant ? "Assistant" : "You"}</span>
        <div className="flex items-center gap-3">
          <span>{time}</span>
          {isAssistant && <Copy className="h-3.5 w-3.5 cursor-pointer" />}
        </div>
      </div>
      <div className="whitespace-pre-wrap break-words text-sm leading-7 text-[#101410]">
        {content}
      </div>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Generated result"
          className="mt-4 max-h-[420px] w-full rounded-lg border border-[#DADFD2] object-contain"
        />
      ) : null}
      {audioUrl ? (
        <audio controls src={audioUrl} className="mt-4 w-full" />
      ) : null}
    </article>
  );
}
