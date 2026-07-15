import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F6F7F2] px-5 py-5 text-[#101410]">
      <section className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col rounded-[28px] border border-[#DADFD2] bg-white">
        <nav className="flex h-16 items-center justify-between border-b border-[#DADFD2] px-5 md:px-8">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.18em]">
            Multimodal AI
          </Link>
          <div className="flex overflow-hidden rounded-full border border-[#101410] text-sm">
            <Link href="/" className="bg-[#101410] px-5 py-2 text-white">
              Home
            </Link>
            <a href="#about" className="px-5 py-2">
              About
            </a>
          </div>
        </nav>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
          <p className="mb-4 rounded-full bg-[#D7FF5F] px-4 py-2 text-sm font-medium">
            Simple multi-input AI playground
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
            Build with text, image, and audio models in one clean workspace.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#5D6458]">
            Select a mode, choose a model, send a prompt, and see the response without extra clutter.
          </p>
          <Link
            href="/chat"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#101410] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2A3028]"
          >
            Let&apos;s get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div id="about" className="border-t border-[#DADFD2] px-6 py-5 text-center text-sm text-[#5D6458]">
          A lightweight frontend for testing your FastAPI multimodal backend.
        </div>
      </section>
    </main>
  );
}
