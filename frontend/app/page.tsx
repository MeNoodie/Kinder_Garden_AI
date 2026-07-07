import Link from "next/link";
import { ArrowRight, Sparkles, Wand2, Workflow } from "lucide-react";

const highlights = [
  {
    icon: Workflow,
    title: "Mode-aware workflows",
    description: "Switch between text, image, and speech flows without leaving the workspace.",
  },
  {
    icon: Sparkles,
    title: "Premium chat feel",
    description: "Minimal chrome, soft borders, and calm spacing inspired by modern AI tools.",
  },
  {
    icon: Wand2,
    title: "Learning first",
    description: "Built to show how model routing and implementation details fit together.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-8 text-[#F3F4F6]">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col overflow-hidden rounded-[28px] border border-[#262D3D] bg-[#111827]/40 shadow-glass backdrop-blur-xl">
        <section className="flex flex-1 flex-col justify-between gap-10 px-6 py-8 md:px-10 lg:px-12">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#9CA3AF]">Multimodal AI Playground</p>
              <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">
                Build, test, and understand AI workflows in one elegant workspace.
              </h1>
            </div>
            <div className="hidden rounded-full border border-[#262D3D] bg-white/5 px-4 py-2 text-sm text-[#9CA3AF] md:block">
              Dark mode only
            </div>
          </header>

          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="glass-panel rounded-2xl p-6 md:p-8">
              <p className="max-w-2xl text-base leading-7 text-[#9CA3AF] md:text-lg">
                A focused interface for engineers who want a fast, refined way to experiment with
                text, image, and speech models.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#4F8CFF] px-5 py-3 text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.02]"
                >
                  Let&apos;s Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="inline-flex items-center rounded-2xl border border-[#262D3D] bg-white/5 px-5 py-3 text-sm text-[#9CA3AF]">
                  Built for multimodal routing
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="glass-panel rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4F8CFF]/12 text-[#4F8CFF]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-medium">{item.title}</h2>
                        <p className="mt-1 text-sm leading-6 text-[#9CA3AF]">{item.description}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
