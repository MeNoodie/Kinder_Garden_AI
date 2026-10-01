import { ChevronDown, Cpu, Menu } from "lucide-react";
import { modelOptions, modeOptions } from "@/components/app-shell/Sidebar";

export function TopBar({
  onShowCode,
  mode,
  model,
  onModeChange,
  onModelChange,
}: {
  onShowCode: () => void;
  mode: string;
  model: string;
  onModeChange: (mode: string) => void;
  onModelChange: (model: string) => void;
}) {
  const modelLabel = modelOptions.find((item) => item.value === model)?.label ?? "Choose a model";
  return (
    <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#e9ece6] bg-white px-5 sm:px-8">
      <h1 className="text-base font-semibold tracking-[-0.02em] sm:text-lg">New Conversation</h1>
      <div className="flex items-center gap-2">
        <label className="relative hidden sm:block">
          <span className="sr-only">Interaction mode</span>
          <select value={mode} onChange={(event) => onModeChange(event.target.value)} className="h-11 appearance-none rounded-xl border border-[#e1e5dc] bg-[#fbfcf9] py-2 pl-3 pr-8 text-sm font-medium outline-none">
            <option value="">Mode</option>
            {modeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-3.5 h-4 w-4" />
        </label>
        <label className="relative">
          <span className="sr-only">Active model</span>
          <Cpu className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#596053]" />
          <select value={model} onChange={(event) => onModelChange(event.target.value)} className="h-11 max-w-[205px] appearance-none rounded-xl border border-[#e1e5dc] bg-[#fbfcf9] py-2 pl-9 pr-8 text-sm font-medium outline-none sm:max-w-[290px]">
            {modelOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-3.5 h-4 w-4" />
        </label>
        <button onClick={onShowCode} className="hidden h-11 w-11 items-center justify-center rounded-xl border border-[#e1e5dc] transition hover:bg-[#d9ff62] md:inline-flex" title="Show code">
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
