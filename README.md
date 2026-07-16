# Open AI Orchestrator

> A hands-on AI engineering sandbox for learning how real multimodal systems route requests, swap providers, manage temporary files, and return predictable API responses.

Open AI Orchestrator is a community-driven learning hub for developers who want to understand practical AI architecture, not just call a model once and hope for the best.

Modern AI apps change fast. One week you may use Gemini for text, Groq for speech, and Ollama for local experiments. The next week you may need to swap models, add image inputs, or move a workflow from local hardware to a cloud provider. This project teaches the pattern that keeps that sane: **decouple your application logic from the model provider**.

Instead of rewriting your app every time a model changes, Open AI Orchestrator uses a small FastAPI backend, a provider-aware dispatcher, and unified JSON responses so each workflow follows the same mental model.

---

## ✨ Vision

This repository is built for learners, builders, and contributors who want to see how AI systems are shaped from the inside:

- how frontend input becomes structured backend data
- how a backend chooses between text, image, and audio workflows
- how provider routing works across Google, Groq, and Ollama
- how uploaded files are stored safely and cleaned up automatically
- how a single API contract can support many model backends

The goal is not to hide the architecture behind magic. The goal is to make the architecture visible, editable, and teachable.

---

## 🚀 Current Progress

Built so far:

- **Text-to-Text JSON endpoint** through `POST /api/chat`
- **FastAPI backend router** in `backend/api/chat.py`
- **Provider abstraction layer** in `backend/utils/cloud_service.py`
- **Model registry** in `backend/config/model.yaml`
- **Google Gemini routing** for cloud text and vision models
- **Groq routing** for text models and Whisper-style audio transcription
- **Ollama routing** for local or cloud-hosted models
- **Image upload validation path** prepared for Image -> Text workflows
- **Audio upload validation path** prepared for Speech -> Text workflows
- **Temporary upload lifecycle** using `try...finally` cleanup
- **Centralized service files** for text, image, and speech workflows
- **Debug logging** in the text service for failed AI calls
- **Next.js frontend shell** with mode selection, model selection, text input, file upload, and voice recording controls

Current focus:

- Text -> Text is the working baseline.
- Image/audio routes are structurally prepared and ready to connect to the service functions.
- Text-to-speech and richer output rendering are planned next.

---

## 📦 System Requirements & Local Setup

### Requirements

| Tool | Purpose |
| --- | --- |
| Python 3.13+ | FastAPI backend |
| Node.js 20+ | Next.js frontend |
| Ollama | Optional local model runtime |
| API keys | Google, Groq, and/or Hugging Face depending on models used |

### 1. Clone The Repository

```bash
git clone <your-repo-url>
cd O_Genrator
```

### 2. Create A Python Environment

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
source .venv/bin/activate
```

### 3. Install Backend Dependencies

If your branch has a `requirements.txt` file:

```bash
pip install -r requirements.txt
```

This repo also supports the current `pyproject.toml` / `uv.lock` workflow:

```bash
uv sync
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your_google_api_key_here
GROQ_API_KEY=your_groq_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

Use only the keys required by the models you are testing.

### 5. Launch The Backend

```bash
uvicorn main:app --reload
```

The API will run at:

```text
http://127.0.0.1:8000
```

Open FastAPI docs:

```text
http://127.0.0.1:8000/docs
```

### 6. Launch The Frontend

```bash
cd frontend
npm install
npm run dev
```

Windows PowerShell may require:

```powershell
npm.cmd run dev
```

Frontend URL:

```text
http://127.0.0.1:3000
```

---

## Using Ollama Locally

Ollama models only work if the Ollama server is running.

Start Ollama:

```bash
ollama serve
```

Pull a model:

```bash
ollama pull llava
```

Check installed models:

```bash
ollama list
```

If you see an error like:

```text
WinError 10061: No connection could be made because the target machine actively refused it
```

the backend is trying to call Ollama, but Ollama is not running on `localhost:11434`.

For cloud testing, select a Google or Groq model instead of an Ollama model.

---

## 🧠 Architecture Deep-Dive

### High-Level Flow

```text
Frontend UI
  |
  | FormData:
  | - mode
  | - model_name
  | - query
  | - optional file
  | - output_format
  v
FastAPI /api/chat
  |
  | Simple conditional dispatcher
  v
Mode handler
  |
  | text  -> process_text()
  | image -> save temp file -> process_image()
  | audio -> save temp file -> process_audio()
  v
Provider router
  |
  | google -> Gemini
  | groq   -> Groq-hosted LLM / Whisper
  | ollama -> local or cloud Ollama runtime
  v
Unified JSON response
```

### Request Shape

The frontend sends a `multipart/form-data` request:

```text
POST /api/chat
```

Fields:

| Field | Type | Example |
| --- | --- | --- |
| `mode` | string | `text`, `image`, `audio` |
| `model_name` | string | `gemini-2.5-flash`, `qwen/qwen3-32b`, `llava` |
| `query` | string | `Explain transformers simply` |
| `file` | file | optional image/audio upload |
| `output_format` | string | `text`, `audio` |

### Response Shape

Every workflow should return the same basic JSON contract:

```json
{
  "status": "success",
  "mode": "text",
  "response": "The model output appears here.",
  "output_format": "text"
}
```

Audio/image workflows may add:

```json
{
  "audio_file": "audio_outputs/example.wav",
  "image_file": "backend/image_outputs/example.png"
}
```

### Conditional Dispatcher Pattern

The router keeps the first learning version intentionally direct:

```python
if mode == "text":
    return process_text(...)

if mode == "image":
    file_path = await save_upload_file(file)
    return process_image(...)

if mode == "audio":
    file_path = await save_upload_file(file)
    return process_audio(...)
```

This is easy for beginners to read, debug, and extend. Later, contributors can evolve it into a registry-based dispatcher.

### Safe File Lifecycle Pattern

Uploads are saved to a temporary directory:

```text
tempfile.gettempdir() / "multimodal_uploads"
```

The backend uses `try...finally` so files are removed even when model processing fails:

```python
try:
    file_path = await save_upload_file(file)
    result = process_image(file_path, query, model_name)
    return build_response("image", result)
finally:
    cleanup_temp_file(file_path)
```

This matters because AI apps often process large images, audio recordings, and generated assets. Without cleanup, your development machine slowly fills with forgotten files.

---

## Model Configuration

Models are configured in:

```text
backend/config/model.yaml
```

Example:

```yaml
text:
  models:
    gemini-2.5-flash:
      provider: google

    qwen/qwen3-32b:
      provider: groq

vision:
  models:
    gemini-2.5-pro:
      provider: google

    llava:
      provider: ollama
```

The frontend model `value` must exactly match the YAML key:

```ts
{ value: "qwen/qwen3-32b", label: "Text | Groq | qwen/qwen3-32b" }
```

The label is what users see. The value is what the backend receives.

---

## Project Structure

```text
O_Genrator/
  main.py
  backend/
    api/
      chat.py
    config/
      model.yaml
    services/
      text_service.py
      image_service.py
      speech_service.py
    utils/
      cloud_service.py
  frontend/
    app/
    components/
      app-shell/
```

Key files:

| File | Responsibility |
| --- | --- |
| `main.py` | Creates the FastAPI app and mounts routers |
| `backend/api/chat.py` | Main `/api/chat` request dispatcher |
| `backend/config/model.yaml` | Model/provider registry |
| `backend/utils/cloud_service.py` | Creates provider clients |
| `backend/services/text_service.py` | Text model workflow |
| `backend/services/image_service.py` | Vision and image generation helpers |
| `backend/services/speech_service.py` | Speech-to-text and text-to-speech helpers |
| `frontend/components/app-shell/Chat.tsx` | Sends chat `FormData` to backend |
| `frontend/components/app-shell/Sidebar.tsx` | Mode/model selection |

---

## 🤝 Contribution Guide

Open AI Orchestrator is designed to be friendly to first-time contributors and useful for experienced AI engineers.

### Good First Issues

Beginner-friendly ways to help:

- improve error messages for missing API keys
- add examples for `POST /api/chat`
- document model names that work with Groq, Gemini, and Ollama
- add UI hints when a user selects a local Ollama model
- add small tests for text request validation
- improve README setup instructions for Windows/macOS/Linux

### Intermediate Contributions

Great next steps:

- fully connect Image -> Text through `process_image`
- fully connect Speech -> Text through `process_audio`
- add Text -> Speech response playback in the frontend
- add model filtering by selected mode
- add loading/error states in the frontend chat UI
- add health checks for configured providers

### Advanced Contributions

High-impact areas:

- streaming token responses from LLM providers
- a registry-based dispatcher to replace conditional routing
- provider fallback strategies
- observability with request IDs and structured logs
- persistent generated file storage
- authentication and per-user API key management
- Docker Compose setup for backend, frontend, and Ollama

### Contribution Workflow

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

3. Make a focused change.
4. Run checks locally.
5. Open a pull request with:
   - what changed
   - why it matters
   - how you tested it

> Good contributions do not need to be huge. A clear fix, a better error message, or a small test can make the project easier for the next learner.

---

## License

Add your preferred open-source license before public release.

---

## Final Note

This project is an invitation to learn AI engineering by building the plumbing yourself. If you have ever wondered how text, image, and audio workflows can share one backend without becoming tangled, this repo is a good place to experiment, break things safely, and understand the design choices one layer at a time.
