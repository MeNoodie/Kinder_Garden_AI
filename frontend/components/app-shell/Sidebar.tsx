import { Select } from "@/components/ui/select";
import {
  Cpu,
  MessageSquareText,
  PanelLeft,
} from "lucide-react";

export const modeOptions = [
  { value: "text-to-text", label: "Text -> Text" },
  { value: "text-to-speech", label: "Text -> Speech" },
  { value: "text-to-image", label: "Text -> Image" },
  { value: "image-to-text", label: "Image -> Text" },
  { value: "speech-to-text", label: "Speech -> Text" },
];

export const modelOptions = [
  { value: "gemini-2.5-flash", label: "Text | Google | gemini-2.5-flash" },
  { value: "glm-5.2:cloud", label: "Text | Ollama | glm-5.2:cloud" },
  { value: "qwen/qwen3-32b", label: "Text | Groq | qwen/qwen3-32b" },
  { value: "gemini-2.5-pro", label: "Vision | Google | gemini-2.5-pro" },
  { value: "llava", label: "Vision | Ollama | llava" },
  { value: "whisper-large-v3", label: "Speech | Groq | whisper-large-v3" },
  {
    value: "black-forest-labs/FLUX.1-schnell",
    label: "Image | Hugging Face | FLUX.1-schnell",
  },
] as const;

export function Sidebar({
  mode,
  model,
  onModeChange,
  onModelChange,
}: {
  mode: string;
  model: string;
  onModeChange: (mode: string) => void;
  onModelChange: (model: string) => void;
}) {
  return (
    <div className="flex h-full flex-col px-4 py-5">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D7FF5F] text-[#101410]">
          <PanelLeft className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#5D6458]">Workspace</p>
          <h2 className="text-lg font-semibold">Control panel</h2>
        </div>
      </div>

      <div className="space-y-5 overflow-y-auto pr-1 subtle-scrollbar">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5D6458]">Mode</h3>
            <span className="rounded-full bg-[#D7FF5F] px-3 py-1 text-xs font-medium text-[#101410]">
              Active
            </span>
          </div>
          <div className="rounded-2xl border border-[#DADFD2] bg-white p-3">
            <div className="mb-2 flex items-center gap-2 text-sm">
              <MessageSquareText className="h-4 w-4 text-[#5D6458]" />
              <span>Interaction mode</span>
            </div>
            <Select value={mode} onChange={(event) => onModeChange(event.target.value)}>
              <option value="">Select a mode</option>
              {modeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </section>

        <hr className="border-[#DADFD2]" />

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5D6458]">Model</h3>
          <div className="space-y-3">
            <ModelRow
              icon={Cpu}
              label="Active Model"
              value={model}
              onChange={onModelChange}
              options={modelOptions}
            />
          </div>
        </section>

      </div>

      <div className="mt-auto pt-5">
        <div className="flex items-center gap-3 rounded-2xl border border-[#DADFD2] bg-white p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#101410] text-sm font-semibold text-white">
            AI
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Guest Engineer</p>
            <p className="truncate text-xs text-[#5D6458]">Multimodal playground</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelRow({
  icon: Icon,
  label,
  value,
  onChange,
  options,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (model: string) => void;
  options: ReadonlyArray<{ value: string; label: string }>;
}) {
  return (
    <div className="rounded-2xl border border-[#DADFD2] bg-white p-3">
      <div className="mb-2 flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-[#5D6458]" />
        <span>{label}</span>
      </div>
      <Select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Select a model</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
