<div align="center">

<img src="./gemini-svg.svg" alt="Kinder_Garden AI Logo" width="100%">

**A hands-on AI engineering sandbox for learning multimodal routing, provider abstraction, and safe backend architecture.**

<p align="center">
  <a href="#license"><img alt="License MIT" src="https://img.shields.io/badge/License-MIT-111827?style=for-the-badge"></a>
  <a href="https://fastapi.tiangolo.com"><img alt="FastAPI" src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white"></a>
  <a href="https://nextjs.org/"><img alt="Next.js" src="https://img.shields.io/badge/Frontend-Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"></a>
  <a href="https://groq.com"><img alt="Groq" src="https://img.shields.io/badge/Engine-Groq%20Powered-F55036?style=for-the-badge"></a>
  <a href="https://ollama.com"><img alt="Ollama" src="https://img.shields.io/badge/Runtime-Ollama%20Local%20%26%20Cloud-101010?style=for-the-badge"></a>
</p>

</div>

## Why This Exists

kinder_Garden AI is a community-driven learning hub for developers who want to understand how AI systems are wired in the real world.

Modern AI apps rarely depend on one provider forever. A useful application may start with Gemini, add Groq for fast inference, use Ollama for local experiments, and later introduce image or audio workflows. Without a routing layer, every model swap leaks into the rest of the application.

This project teaches a cleaner pattern:

> **Keep application logic stable while model providers change underneath.**

The backend exposes a consistent FastAPI interface, routes requests by mode/model, delegates work to provider-specific services, and returns a predictable JSON response.

---

## Current Progress

| Status | Capability | Notes |
| --- | --- | --- |
| `[PRODUCTION-READY]` | Text-to-Text endpoint | `POST /api/chat` accepts `mode`, `query`, `model_name`, and `output_format`. |
| `[PRODUCTION-READY]` | Provider registry | Models are declared in `backend/config/model.yaml`. |
| `[PRODUCTION-READY]` | Dynamic model routing | `cloud_service.py` resolves Google, Groq, Hugging Face, and Ollama providers. |
| `[PRODUCTION-READY]` | Safe temp-file cleanup | Upload paths use `try...finally` to remove temporary files. |
| `[EXPERIMENTAL]` | Image upload path | Image files are validated and staged for Image -> Text processing. |
| `[EXPERIMENTAL]` | Audio upload path | Audio files are validated and staged for Speech -> Text processing. |
| `[EXPERIMENTAL]` | Browser voice capture | Frontend can record microphone audio and submit it as a file. |
| `[PLANNED]` | Streaming tokens | Useful for long LLM responses. |
| `[PLANNED]` | Text-to-speech playback | Backend service exists; frontend playback is next. |

Built pieces:

- `[✓]` FastAPI backend router in `backend/api/chat.py`
- `[✓]` Text workflow in `backend/services/text_service.py`
- `[✓]` Vision helper in `backend/services/image_service.py`
- `[✓]` Speech helper in `backend/services/speech_service.py`
- `[✓]` Provider abstraction in `backend/utils/cloud_service.py`
- `[✓]` Next.js frontend shell with mode/model selectors
- `[✓]` Centralized logging for failed text model calls

---

## System Requirements

| Tool | Required | Purpose |
| --- | --- | --- |
| Python 3.13+ | Yes | FastAPI backend runtime |
| Node.js 20+ | Yes | Next.js frontend runtime |
| Google API key | Optional | Gemini text/vision models |
| Groq API key | Optional | Groq LLMs and Whisper transcription |
| Hugging Face key | Optional | Image generation / hosted endpoints |
| Ollama | Optional | Local or cloud-hosted Ollama models |

---

## Local Setup

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

If your branch has `requirements.txt`:

```bash
pip install -r requirements.txt
```

This repository also supports the current `pyproject.toml` / `uv.lock` workflow:

```bash
uv sync
```

### 4. Create `.env`

Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your_google_api_key_here
GROQ_API_KEY=your_groq_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

Use only the keys required by the models you are testing.

### 5. Start The Backend

```bash
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API docs:

```text
http://127.0.0.1:8000/docs
```

### 6. Start The Frontend

```bash
cd frontend
npm install
npm run dev
```

Windows PowerShell may require:

```powershell
npm.cmd run dev
```

Frontend:

```text
http://127.0.0.1:3000
```

---

## Ollama Local vs Cloud

| Runtime | Tag | How It Works | Common Failure |
| --- | --- | --- | --- |
| Ollama Local | `[LOCAL-ONLY]` | Backend calls a local Ollama server at `localhost:11434`. | `WinError 10061` means Ollama is not running. |
| Ollama Cloud | `[EXPERIMENTAL]` | Use a cloud-hosted Ollama-compatible endpoint if configured. | Provider URL/auth must be configured correctly. |
| Google Gemini | `[CLOUD]` | Uses `GOOGLE_API_KEY`. | Missing or invalid Google API key. |
| Groq | `[CLOUD]` | Uses `GROQ_API_KEY`. | Wrong model id or invalid Groq key. |
| Hugging Face | `[CLOUD]` | Uses `HUGGINGFACE_API_KEY`. | Missing token or unavailable model. |

Start Ollama locally:

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

> **Safety rule:** If you select an Ollama model in the frontend, make sure the Ollama runtime is actually running before sending the request.

---

## Architecture Deep-Dive

### Conceptual Pipeline

```text
UI Clients
    |
    v
FastAPI Router
    |
    v
Strategy Dispatcher Switch
    |
    +--> Google GenAI
    |
    +--> Groq API
    |
    +--> Ollama Local
    |
    +--> Ollama Cloud
    |
    v
Unified JSON Response
```

### Request Contract

The frontend sends `multipart/form-data` to:

```text
POST /api/chat
```

| Field | Type | Example | Required |
| --- | --- | --- | --- |
| `mode` | string | `text`, `image`, `audio` | Yes |
| `model_name` | string | `gemini-2.5-flash`, `qwen/qwen3-32b`, `llava` | Yes |
| `query` | string | `Explain transformers simply` | Required for text |
| `file` | file | image/audio upload | Required for image/audio |
| `output_format` | string | `text`, `audio` | No |

### Unified Response Contract

```json
{
  "status": "success",
  "mode": "text",
  "response": "The model output appears here.",
  "output_format": "text"
}
```

Audio or image workflows may add:

```json
{
  "audio_file": "audio_outputs/example.wav",
  "image_file": "backend/image_outputs/example.png"
}
```

---

## Dispatcher Pattern

The first learning version uses a simple conditional dispatcher:

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

| Pattern | Status | Why It Is Used |
| --- | --- | --- |
| Simple Conditional Dispatcher | `[PRODUCTION-READY]` | Easy to read, debug, and teach. |
| Provider Registry | `[PRODUCTION-READY]` | Keeps model/provider mapping outside application logic. |
| Strategy Registry | `[PLANNED]` | Future upgrade for more modes and fewer conditionals. |

> **Architecture rule:** The frontend should not know how to call Gemini, Groq, or Ollama directly. It should only send `mode`, `model_name`, `query`, and optional `file` to the backend.

---

## Safe Lifecycle Management

Uploads are saved to:

```text
tempfile.gettempdir() / "multimodal_uploads"
```

The backend cleans temporary files with `try...finally`:

```python
try:
    file_path = await save_upload_file(file)
    result = process_image(file_path, query, model_name)
    return build_response("image", result)
finally:
    cleanup_temp_file(file_path)
```

> **Safety rule:** Every workflow that writes an upload to disk must clean it up in `finally`, even when the AI provider fails.

This prevents large image/audio uploads from silently filling the host machine with dead files.

---

## Provider Feature Matrix

| Provider | Text | Vision | Audio | Local Runtime | Notes |
| --- | --- | --- | --- | --- | --- |
| Google Gemini | `[✓]` | `[✓]` | `[•]` | No | Strong cloud text and vision support. |
| Groq | `[✓]` | `[•]` | `[✓]` | No | Fast hosted inference and Whisper transcription. |
| Ollama Local | `[✓]` | `[✓]` | `[•]` | Yes | Requires `ollama serve`. |
| Ollama Cloud | `[px]` | `[px]` | `[•]` | No | Planned/experimental depending on endpoint setup. |
| Hugging Face | `[px]` | `[•]` | `[px]` | No | Used for hosted endpoints and generation experiments. |

Legend:

- `[✓]` implemented or structurally supported
- `[px]` experimental / provider-dependent
- `[•]` planned or not the current focus

---

## Model Configuration

Models live in:

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
```

The frontend must send the exact YAML key:

```ts
{ value: "qwen/qwen3-32b", label: "Text | Groq | qwen/qwen3-32b" }
```

> **Routing rule:** The `label` is cosmetic. The `value` is the real model id sent to FastAPI.

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

| File | Responsibility |
| --- | --- |
| `main.py` | Creates the FastAPI app and mounts routers. |
| `backend/api/chat.py` | Main `/api/chat` dispatcher. |
| `backend/config/model.yaml` | Model/provider registry. |
| `backend/utils/cloud_service.py` | Creates provider clients. |
| `backend/services/text_service.py` | Text model workflow. |
| `backend/services/image_service.py` | Vision and image generation helpers. |
| `backend/services/speech_service.py` | Speech-to-text and text-to-speech helpers. |
| `frontend/components/app-shell/Chat.tsx` | Sends chat `FormData` to backend. |
| `frontend/components/app-shell/Sidebar.tsx` | Mode/model selection. |

---

## Contribution Guide

Open AI Orchestrator is built to welcome both beginners and experienced AI engineers.

### `[GOOD-FIRST-ISSUE]`

- Improve missing API key messages.
- Add request examples for `POST /api/chat`.
- Document known-good model ids for Gemini, Groq, and Ollama.
- Add UI warnings for local Ollama models.
- Add tests for text request validation.

### `[INTERMEDIATE]`

- Connect Image -> Text through `process_image`.
- Connect Speech -> Text through `process_audio`.
- Add Text -> Speech playback in the frontend.
- Filter model dropdown by selected mode.
- Add structured loading and error states.

### `[ADVANCED]`

- Add streaming token responses.
- Replace conditionals with a strategy registry.
- Add provider fallback chains.
- Add structured logs with request IDs.
- Add persistent generated file storage.
- Add Docker Compose for backend, frontend, and Ollama.

### Pull Request Checklist

| Step | Requirement |
| --- | --- |
| 1 | Fork the repository. |
| 2 | Create a focused feature branch. |
| 3 | Make one clear change. |
| 4 | Run local checks. |
| 5 | Open a PR explaining what changed, why it matters, and how it was tested. |

```bash
git checkout -b feature/your-feature-name
```

> **Contribution rule:** Small, well-tested improvements are valuable. A better error message can help the next learner move faster.

---

## License

MIT. Update the repository with a `LICENSE` file before public release.

---

## Final Note

Open AI Orchestrator is an invitation to learn AI engineering by building the routing layer yourself. If you want to understand how text, vision, and audio workflows can share one backend without becoming tangled, this repo gives you a practical place to experiment.
