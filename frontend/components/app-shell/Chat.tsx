"use client";

import { useEffect, useRef, useState } from "react";
import { ChatInput } from "@/components/app-shell/ChatInput";
import { EmptyState } from "@/components/app-shell/EmptyState";
import { LoadingState } from "@/components/app-shell/LoadingState";
import { Message } from "@/components/app-shell/Message";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  time: string;
  imageUrl?: string;
  audioUrl?: string;
};

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Welcome to the multimodal workspace. Pick a mode on the left, then send text, an image, or audio to start a routed workflow.",
    time: "09:14",
  },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

function getTime() {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function getBackendMode(mode: string) {
  if (mode.startsWith("image")) {
    return "image";
  }

  if (mode.startsWith("speech")) {
    return "audio";
  }

  return "text";
}

function getOutputFormat(mode: string) {
  if (mode === "text-to-image") {
    return "image";
  }

  return mode === "text-to-speech" ? "audio" : "text";
}

function getAssetUrl(path?: string) {
  if (!path) {
    return undefined;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
}

export function Chat({ mode, model }: { mode: string; model: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  async function handleSubmit() {
    const query = input.trim();
    const backendMode = getBackendMode(mode || "text-to-text");

    if ((!query && !selectedFile) || isLoading) {
      return;
    }

    setInput("");
    setSelectedFile(null);
    setIsLoading(true);
    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: selectedFile ? `${query || "Uploaded file"}\n\nFile: ${selectedFile.name}` : query,
        time: getTime(),
      },
    ]);

    try {
      const formData = new FormData();
      formData.append("mode", backendMode);
      formData.append("query", query);
      formData.append("model_name", model || "gemini-2.5-flash");
      formData.append("output_format", getOutputFormat(mode));
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail ?? "Backend request failed.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.response,
          time: getTime(),
          imageUrl: getAssetUrl(data.image_file),
          audioUrl: getAssetUrl(data.audio_file),
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: error instanceof Error ? error.message : "Something went wrong.",
          time: getTime(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-6 subtle-scrollbar">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            <EmptyState />
            {messages.map((message, index) => (
              <Message key={index} {...message} />
            ))}
            {isLoading ? <LoadingState /> : null}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="shrink-0 border-t border-[#DADFD2] px-3 py-3 md:px-6 md:py-4">
          <div className="mx-auto max-w-3xl">
            <ChatInput
              disabled={isLoading}
              file={selectedFile}
              mode={getBackendMode(mode || "text-to-text")}
              value={input}
              onClearFile={() => setSelectedFile(null)}
              onChange={setInput}
              onFileChange={setSelectedFile}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
