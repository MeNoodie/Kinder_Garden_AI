"use client";

import { useRef, useState } from "react";
import { Paperclip, Mic, Send } from "lucide-react";

export function ChatInput({
  value,
  disabled,
  file,
  mode,
  hasMode = true,
  onChange,
  onClearFile,
  onFileChange,
  onSubmit,
}: {
  value: string;
  disabled?: boolean;
  file: File | null;
  mode: "text" | "image" | "audio";
  hasMode?: boolean;
  onChange: (value: string) => void;
  onClearFile: () => void;
  onFileChange: (file: File) => void;
  onSubmit: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  async function handleVoiceClick() {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      window.alert("Voice recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        onFileChange(audioFile);
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      window.alert("Could not start voice recording. Please allow microphone access.");
    }
  }

  return (
    <div className="rounded-[20px] border border-[#dce4b9] bg-white p-2 shadow-[0_2px_8px_rgba(22,32,15,0.02)]">
      <div className="flex flex-col gap-3">
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept={mode === "audio" ? "audio/*" : mode === "image" ? "image/*" : "image/*,audio/*"}
          onChange={(event) => {
            const nextFile = event.target.files?.[0];
            if (nextFile) {
              onFileChange(nextFile);
            }
          }}
        />
        <textarea
          className="max-h-28 min-h-14 w-full resize-none rounded-xl border-0 bg-transparent px-3 py-2.5 text-sm text-[#101410] outline-none placeholder:text-[#9aa19a] sm:min-h-[64px]"
          placeholder="Ask something..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
          disabled={disabled}
        />
        {file ? (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#C9D0C1] bg-white px-3 py-2 text-sm text-[#5D6458]">
            <span className="truncate">{file.name}</span>
            <button
              className="shrink-0 font-medium text-[#101410]"
              onClick={onClearFile}
              type="button"
            >
              Remove
            </button>
          </div>
        ) : null}
        <div className="flex items-end gap-2 border-t border-[#eef0ea] pt-2">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e1e5dc] bg-white text-[#101410] transition hover:bg-[#eaffb8] disabled:opacity-50"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#e1e5dc] text-[#101410] transition hover:bg-[#eaffb8] disabled:opacity-50 ${
              isRecording ? "bg-[#eaffb8]" : "bg-white"
            }`}
            disabled={disabled}
            onClick={handleVoiceClick}
            type="button"
          >
            <Mic className="h-4 w-4" />
          </button>
          <button
            className="ml-auto h-10 rounded-full bg-[#caff37] px-5 text-sm font-semibold text-[#263000] transition hover:bg-[#bcec2e] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled || !hasMode || (!value.trim() && !file)}
            onClick={onSubmit}
            type="button"
          >
            <Send className="mr-2 inline h-4 w-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
