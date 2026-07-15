import { Paperclip, Mic, Send } from "lucide-react";

export function ChatInput({
  value,
  disabled,
  onChange,
  onSubmit,
}: {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="rounded-[24px] border border-[#DADFD2] bg-[#F7F8F3] p-3">
      <div className="flex flex-col gap-3">
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
        <div className="flex items-end gap-3">
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C9D0C1] bg-white text-[#101410] transition hover:bg-[#D7FF5F] disabled:opacity-50"
            disabled={disabled}
            type="button"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C9D0C1] bg-white text-[#101410] transition hover:bg-[#D7FF5F] disabled:opacity-50"
            disabled={disabled}
            type="button"
          >
            <Mic className="h-4 w-4" />
          </button>
          <button
            className="ml-auto h-11 rounded-full bg-[#101410] px-5 text-white hover:bg-[#2A3028] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled || !value.trim()}
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
