import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Cpu,
  Image as ImageIcon,
  Mic,
  MessageSquareText,
  MoonStar,
  PanelLeft,
  Settings2,
} from "lucide-react";

const modeOptions = [
  { value: "text-to-text", label: "Text -> Text" },
  { value: "text-to-speech", label: "Text -> Speech" },
  { value: "text-to-image", label: "Text -> Image" },
  { value: "image-to-text", label: "Image -> Text" },
  { value: "speech-to-text", label: "Speech -> Text" },
];

const modelOptions = [
  { value: "gemini-2.5-flash", label: "Text: gemini-2.5-flash" },
  { value: "llama-3.3", label: "Text: llama-3.3" },
  { value: "qwen3", label: "Text: qwen3" },
  { value: "gemini-2.5-pro", label: "Image: gemini-2.5-pro" },
  { value: "llava", label: "Image: llava" },
  { value: "whisper-large-v3", label: "Speech: whisper-large-v3" },
  { value: "black-forest-labs/FLUX.1-schnell", label: "Image: black-forest-labs/FLUX.1-schnell" },
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
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4F8CFF]/12 text-[#4F8CFF]">
          <PanelLeft className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-[#9CA3AF]">Workspace</p>
          <h2 className="text-lg font-medium">Control Plane</h2>
        </div>
      </div>

      <div className="space-y-5 overflow-y-auto pr-1 subtle-scrollbar">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9CA3AF]">Modes</h3>
            <Badge className="rounded-full border border-[#262D3D] bg-white/5 text-[#9CA3AF]">
              1 active
            </Badge>
          </div>
          <div className="rounded-2xl border border-[#262D3D] bg-white/5 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm">
              <MessageSquareText className="h-4 w-4 text-[#9CA3AF]" />
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

        <Separator className="bg-[#262D3D]" />

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9CA3AF]">Models</h3>
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

        <Separator className="bg-[#262D3D]" />

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9CA3AF]">Theme</h3>
          <div className="rounded-2xl border border-[#262D3D] bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[#F3F4F6]">
                <MoonStar className="h-4 w-4 text-[#4F8CFF]" />
                Dark mode
              </div>
              <Badge className="rounded-full bg-[#14D99B]/10 text-[#14D99B]">Locked</Badge>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-auto space-y-3 pt-5">
        <Button className="h-11 w-full rounded-2xl bg-[#4F8CFF] text-white hover:bg-[#4F8CFF]/90">
          <Settings2 className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <div className="flex items-center gap-3 rounded-2xl border border-[#262D3D] bg-white/5 p-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-[#161B26] text-[#F3F4F6]">AI</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Guest Engineer</p>
            <p className="truncate text-xs text-[#9CA3AF]">Multimodal playground</p>
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
    <div className="rounded-2xl border border-[#262D3D] bg-white/5 p-3">
      <div className="mb-2 flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-[#9CA3AF]" />
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
