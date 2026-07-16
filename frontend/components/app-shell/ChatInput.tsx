"use client";

import { useRef, useState } from "react";
import { Paperclip, Mic, Send } from "lucide-react";

export function ChatInput({
  value,
  disabled,
  file,
  mode,
  onChange,
  onClearFile,
  onFileChange,
  onSubmit,
}: {
  value: string;
  disabled?: boolean;
  file: File | null;
  mode: "text" | "image" | "audio";
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
    <div className="rounded-[24px] border border-[#DADFD2] bg-[#F7F8F3] p-3">
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
          className="max-h-28 min-h-16 w-full resize-none rounded-2xl border border-[#C9D0C1] bg-white px-4 py-3 text-sm text-[#101410] outline-none transition focus:border-[#101410] sm:min-h-[76px]"
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
        <div className="flex items-end gap-3">
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C9D0C1] bg-white text-[#101410] transition hover:bg-[#D7FF5F] disabled:opacity-50"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-[#C9D0C1] text-[#101410] transition hover:bg-[#D7FF5F] disabled:opacity-50 ${
              isRecording ? "bg-[#D7FF5F]" : "bg-white"
            }`}
            disabled={disabled}
            onClick={handleVoiceClick}
            type="button"
          >
            <Mic className="h-4 w-4" />
          </button>
          <button
            className="ml-auto h-11 rounded-full bg-[#101410] px-5 text-white hover:bg-[#2A3028] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled || (!value.trim() && !file)}
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
