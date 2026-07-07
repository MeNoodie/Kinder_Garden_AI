"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/app-shell/Sidebar";
import { Chat } from "@/components/app-shell/Chat";
import { CodeDrawer } from "@/components/app-shell/CodeDrawer";
import { TopBar } from "@/components/app-shell/TopBar";

export function ChatShell() {
  const [mode, setMode] = useState("");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [isCodeDrawerOpen, setIsCodeDrawerOpen] = useState(false);

  useEffect(() => {
    setIsCodeDrawerOpen(false);
  }, [mode]);

  return (
    <main className="min-h-screen bg-[#0B0F19] text-[#F3F4F6]">
      <div className="flex min-h-screen flex-col">
        <TopBar
          onShowCode={() => setIsCodeDrawerOpen(true)}
          showCodeAvailable={Boolean(mode)}
        />
        <div
          className={`grid min-h-0 flex-1 grid-cols-1 overflow-hidden ${
            isCodeDrawerOpen ? "lg:grid-cols-[300px_minmax(0,1fr)_420px]" : "lg:grid-cols-[300px_minmax(0,1fr)]"
          }`}
        >
          <aside className="hidden min-h-0 border-r border-[#262D3D] bg-[#111827] lg:block">
            <Sidebar
              mode={mode}
              model={model}
              onModeChange={setMode}
              onModelChange={setModel}
            />
          </aside>
          <section className="min-h-0 border-r border-[#262D3D] bg-[#0B0F19]">
            <Chat />
          </section>
          {isCodeDrawerOpen ? (
            <aside className="hidden min-h-0 bg-[#111827] lg:block">
              <CodeDrawer onClose={() => setIsCodeDrawerOpen(false)} />
            </aside>
          ) : null}
        </div>
      </div>
    </main>
  );
}
