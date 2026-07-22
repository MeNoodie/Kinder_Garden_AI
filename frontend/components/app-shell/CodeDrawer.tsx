"use client";

import { useEffect, useState } from "react";
import { X, Code2, Server, Copy, Check } from "lucide-react";

interface ModeDetail {
  title: string;
  description: string;
  flow: string[];
  frontend_code: string;
  backend_code: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

const fallbackData: Record<string, ModeDetail> = {
  "text-to-text": {
    title: "Text to Text Mode",
    description: "User sends text prompt to backend and receives an AI-generated text response.",
    flow: [
      "1. User enters text prompt in the chat input.",
      "2. Frontend creates FormData (mode='text', query=prompt, output_format='text').",
      "3. Frontend calls FastAPI backend POST /api/chat endpoint.",
      "4. Backend calls LLM model (e.g. gemini-2.5-flash) via LangChain.",
      "5. Backend returns response JSON back to frontend."
    ],
    frontend_code: "// Step 1: Collect prompt & build request FormData\nconst formData = new FormData();\nformData.append('mode', 'text');\nformData.append('query', textPrompt);\nformData.append('model_name', 'gemini-2.5-flash');\nformData.append('output_format', 'text');\n\n// Step 2: Post to backend chat endpoint\nconst response = await fetch('http://127.0.0.1:8000/api/chat', {\n  method: 'POST',\n  body: formData,\n});\nconst data = await response.json();",
    backend_code: "# Step 1: Route receives form data\n@router.post('/chat')\nasync def chat(mode: str = Form(...), query: str = Form(...)):\n    # Step 2: Invoke LLM model\n    model = get_chat_models(model_name)\n    ai_response = process_text(query, model)\n    # Step 3: Return JSON payload\n    return {'status': 'success', 'mode': mode, 'response': ai_response}"
  },
  "text-to-image": {
    title: "Text to Image Mode",
    description: "User sends a text description, and backend generates a new image file.",
    flow: [
      "1. User enters prompt (e.g. 'A cybernetic city').",
      "2. Frontend sends FormData with mode='text' and output_format='image'.",
      "3. Backend calls FLUX.1-schnell image model on HuggingFace.",
      "4. Backend saves image file to backend/image_outputs.",
      "5. Backend returns static file URL for image rendering in UI."
    ],
    frontend_code: "// Step 1: Prepare payload for image generation\nconst formData = new FormData();\nformData.append('mode', 'text');\nformData.append('query', prompt);\nformData.append('model_name', 'black-forest-labs/FLUX.1-schnell');\nformData.append('output_format', 'image');\n\n// Step 2: Post to backend\nconst res = await fetch('http://127.0.0.1:8000/api/chat', { method: 'POST', body: formData });\nconst data = await res.json();\nconst imageUrl = 'http://127.0.0.1:8000' + data.image_file;",
    backend_code: "# Step 1: Route handles image output generation\nif output_format == 'image':\n    image_model = get_model_for_task(model_name, 'image_generation', 'black-forest-labs/FLUX.1-schnell')\n    # Step 2: Generate image and save locally\n    generated_img = text_to_image(query, image_model)\n    # Step 3: Return static image URL\n    return build_response('text', 'Image generated.', 'image', image_file=output_url(generated_img, 'images'))"
  }
};

export function CodeDrawer({ mode, onClose }: { mode: string; onClose: () => void }) {
  const activeKey = mode || "text-to-text";
  const [codeData, setCodeData] = useState<Record<string, ModeDetail>>(fallbackData);
  const [activeTab, setActiveTab] = useState<"frontend" | "backend">("frontend");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchCode() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/dummycode`);
        if (res.ok) {
          const data = await res.json();
          setCodeData(data);
        }
      } catch (err) {
        console.error("Failed to fetch dummy code from backend:", err);
      }
    }
    fetchCode();
  }, []);

  const detail: ModeDetail = codeData[activeKey] || codeData["text-to-text"] || fallbackData["text-to-text"];

  const currentCode = activeTab === "frontend" ? detail.frontend_code : detail.backend_code;

  const handleCopy = () => {
    if (!currentCode) return;
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto px-5 py-5 subtle-scrollbar">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.16em] text-[#5D6458]">Implementation</p>
          <h2 className="text-xl font-semibold">{detail.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#101410] bg-white text-[#101410] transition hover:bg-[#D7FF5F]"
          aria-label="Close code drawer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-2 text-xs leading-5 text-[#5D6458]">{detail.description}</p>

      <hr className="my-4 border-[#DADFD2]" />

      {/* Execution Flow */}
      {detail.flow && (
        <div className="mb-4 space-y-2">
          <span className="inline-flex rounded-full bg-[#D7FF5F] px-3 py-1 text-xs font-semibold text-[#101410]">
            Process Flow
          </span>
          <div className="space-y-1.5 rounded-2xl border border-[#DADFD2] bg-white p-3.5 text-xs text-[#101410]">
            {detail.flow.map((step, idx) => (
              <div key={idx} className="leading-5 text-[#383E34]">
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Toggle Tabs */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex rounded-lg border border-[#DADFD2] bg-[#EAECE3] p-1">
          <button
            onClick={() => setActiveTab("frontend")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition ${
              activeTab === "frontend"
                ? "bg-white text-[#101410] shadow-sm"
                : "text-[#5D6458] hover:text-[#101410]"
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            Frontend Code
          </button>
          <button
            onClick={() => setActiveTab("backend")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition ${
              activeTab === "backend"
                ? "bg-white text-[#101410] shadow-sm"
                : "text-[#5D6458] hover:text-[#101410]"
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            Backend Code
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-md border border-[#DADFD2] bg-white px-2.5 py-1 text-xs text-[#5D6458] transition hover:bg-[#F0F2EB] hover:text-[#101410]"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* Code Block with Explanatory Comments */}
      <div className="flex-1 rounded-2xl border border-[#1E293B] bg-[#0F172A] p-4 shadow-inner">
        <pre className="overflow-x-auto font-mono text-xs leading-6 text-[#E2E8F0] whitespace-pre-wrap">
          {currentCode}
        </pre>
      </div>
    </div>
  );
}
