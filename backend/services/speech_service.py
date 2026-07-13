import os
import sys
from pathlib import Path
from typing import Any, Optional

from dotenv import load_dotenv
from groq import Groq
from pydantic import SecretStr

# Add backend directory to sys.path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from langchain_community.tools.audio import HuggingFaceTextToSpeechModelInference

from backend.utils.cloud_service import get_chat_models

load_dotenv()

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY") or os.getenv("HUGGING_FACE_API_KEY")
AUDIO_DIR = Path(__file__).resolve().parent.parent.parent / "audio_outputs"
AUDIO_DIR.mkdir(exist_ok=True)


def _get_groq_client() -> Groq:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY environment variable is not set.")
    return Groq(api_key=api_key)


def _normalize_response(response: Any) -> str:
    if isinstance(response, str):
        return response
    if hasattr(response, "content"):
        content = response.content
        if isinstance(content, list):
            return "".join(str(item.get("text", "")) for item in content if isinstance(item, dict))
        return str(content)
    return str(response)


def process_audio(audio_path: str, user_query: str = "", model_name: str = "whisper") -> str:
    try:
        if not os.path.exists(audio_path):
            return f"Error: Audio file not found at {audio_path}"

        with open(audio_path, "rb") as audio_file:
            transcript = _get_groq_client().audio.transcriptions.create(file=audio_file, model=model_name)

        text = getattr(transcript, "text", "")
        if not text:
            return "Error processing audio: no transcript returned"

        if not user_query:
            return text

        llm = get_chat_models("llama-3.3")
        response = llm.invoke(f"User speech:\n{text}\n\nQuery:\n{user_query}")
        return _normalize_response(response)
    except Exception as exc:
        return f"Error processing audio: {exc}"


def text_to_speech(text: str) -> Optional[str]:
    try:
        if not text or not text.strip():
            return None
        tts_tool = HuggingFaceTextToSpeechModelInference(
            model="microsoft/speecht5_tts",
            file_extension="wav",
            destination_dir=str(AUDIO_DIR),
            huggingface_api_key=SecretStr(HUGGINGFACE_API_KEY) if HUGGINGFACE_API_KEY else None,
        )
        return tts_tool.run(text)
    except Exception as exc:
        print(f"Error converting text to speech: {exc}")
        return None

