"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/app-shell/Sidebar";
import { Chat } from "@/components/app-shell/Chat";
import { CodeDrawer } from "@/components/app-shell/CodeDrawer";
import { TopBar } from "@/components/app-shell/TopBar";

export function ChatShell() {
  const [mode, setMode] = useState("");
  const [model, setModel] = useState("gemini-3.5-flash");
  const [isCodeDrawerOpen, setIsCodeDrawerOpen] = useState(false);

  useEffect(() => {
    setIsCodeDrawerOpen(false);
  }, [mode]);

  return (
    <main className="h-dvh overflow-hidden bg-[#f7f8f4] p-2 text-[#101410] sm:p-3">
      <div className="mx-auto grid h-full max-w-[1640px] grid-cols-1 overflow-hidden rounded-[24px] border border-[#e1e5dc] bg-white shadow-[0_12px_40px_rgba(29,37,22,0.05)] lg:grid-cols-[356px_minmax(0,1fr)]">
        <aside className="hidden min-h-0 border-r border-[#e1e5dc] bg-[#fbfcf9] lg:block">
          <Sidebar />
        </aside>
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
          <TopBar
            mode={mode}
            model={model}
            onModeChange={setMode}
            onModelChange={setModel}
            onShowCode={() => setIsCodeDrawerOpen(true)}
          />
          <div className={`grid min-h-0 flex-1 overflow-hidden ${isCodeDrawerOpen ? "lg:grid-cols-[minmax(0,1fr)_360px]" : "grid-cols-1"}`}>
          <section className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-white">
            <Chat mode={mode} model={model} />
          </section>
          {isCodeDrawerOpen ? (
            <aside className="hidden min-h-0 bg-[#F7F8F3] lg:block">
              <CodeDrawer mode={mode} onClose={() => setIsCodeDrawerOpen(false)} />
            </aside>
          ) : null}
        </div>
      </div>
      </div>
    </main>
  );
}
