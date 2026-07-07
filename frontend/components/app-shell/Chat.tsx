import { ChatInput } from "@/components/app-shell/ChatInput";
import { EmptyState } from "@/components/app-shell/EmptyState";
import { LoadingState } from "@/components/app-shell/LoadingState";
import { Message } from "@/components/app-shell/Message";

const messages = [
  {
    role: "assistant" as const,
    content:
      "Welcome to the multimodal workspace. Pick a mode on the left, then send text, an image, or audio to start a routed workflow.",
    time: "09:14",
  },
];

export function Chat() {
  return (
    <div className="flex h-full min-h-[calc(100vh-3.5rem)] flex-col">
      <div className="border-b border-[#262D3D] px-4 py-4 md:px-6">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Chat Workspace</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Streaming multimodal conversation</h1>
          <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">
            The center panel stays intentionally calm: messages, timestamps, markdown-ready output,
            and an input area anchored for fast iteration.
          </p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 subtle-scrollbar">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            <EmptyState />
            {messages.map((message, index) => (
              <Message key={index} {...message} />
            ))}
            <LoadingState />
          </div>
        </div>

        <div className="border-t border-[#262D3D] px-4 py-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
}
