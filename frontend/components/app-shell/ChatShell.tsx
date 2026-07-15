"use client";

import { useEffect, useState } from "react";
import { modeOptions, modelOptions, Sidebar } from "@/components/app-shell/Sidebar";
import { Chat } from "@/components/app-shell/Chat";
import { CodeDrawer } from "@/components/app-shell/CodeDrawer";
import { TopBar } from "@/components/app-shell/TopBar";
import { Select } from "@/components/ui/select";

export function ChatShell() {
  const [mode, setMode] = useState("");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [isCodeDrawerOpen, setIsCodeDrawerOpen] = useState(false);

  useEffect(() => {
    setIsCodeDrawerOpen(false);
  }, [mode]);

  return (
    <main className="h-dvh overflow-hidden bg-[#F6F7F2] p-2 text-[#101410] sm:p-4">
      <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden rounded-[20px] border border-[#DADFD2] bg-white sm:rounded-[28px]">
        <TopBar
          onShowCode={() => setIsCodeDrawerOpen(true)}
          showCodeAvailable={Boolean(mode)}
        />
        <div
          className={`grid min-h-0 flex-1 grid-cols-1 overflow-hidden ${
            isCodeDrawerOpen ? "lg:grid-cols-[260px_minmax(0,1fr)_360px]" : "lg:grid-cols-[260px_minmax(0,1fr)]"
          }`}
        >
          <aside className="hidden min-h-0 border-r border-[#DADFD2] bg-[#F7F8F3] lg:block">
            <Sidebar
              mode={mode}
              model={model}
              onModeChange={setMode}
              onModelChange={setModel}
            />
          </aside>
          <section className="flex min-h-0 min-w-0 flex-col overflow-hidden border-r border-[#DADFD2] bg-white">
            <div className="grid gap-3 border-b border-[#DADFD2] bg-[#F7F8F3] p-3 sm:grid-cols-2 lg:hidden">
              <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#5D6458]">
                Mode
                <Select value={mode} onChange={(event) => setMode(event.target.value)}>
                  <option value="">Select a mode</option>
                  {modeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#5D6458]">
                Model
                <Select value={model} onChange={(event) => setModel(event.target.value)}>
                  <option value="">Select a model</option>
                  {modelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
            <Chat mode={mode} model={model} />
          </section>
          {isCodeDrawerOpen ? (
            <aside className="hidden min-h-0 bg-[#F7F8F3] lg:block">
              <CodeDrawer onClose={() => setIsCodeDrawerOpen(false)} />
            </aside>
          ) : null}
        </div>
      </div>
    </main>
  );
}
