from pathlib import Path
import yaml
import os
import uuid
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_ollama import ChatOllama
from langchain_huggingface import HuggingFaceEndpoint
from huggingface_hub import InferenceClient

load_dotenv()

BASE_DIR = Path(__file__).parent
MODEL_FILE = BASE_DIR.parent / "config" / "model.yaml"


with open(MODEL_FILE, "r", encoding="utf-8") as f:
    MODELS = yaml.safe_load(f)


def get_tasks():
    return list(MODELS.keys())

   
def get_provider(model_name: str):
    for task_data in MODELS.values():
        models = task_data["models"]
        if model_name in models:
            return models[model_name]["provider"]

    return None


def get_model_task(model_name: str):
    for task, task_data in MODELS.items():
        if model_name in task_data["models"]:
            return task

    return None


def get_chat_models(model_name):

    task = get_model_task(model_name)
    if task is None:
        raise ValueError(f"Model '{model_name}' is not configured")

    if task not in {"text", "vision"}:
        raise ValueError(f"Model '{model_name}' is configured for '{task}', not chat.")

    provider = get_provider(model_name)

    provider = provider.lower()

    if provider == "groq":
        return ChatGroq(model=model_name)

    if provider == "google":
        return ChatGoogleGenerativeAI(model=model_name)

    if provider == "huggingface":
        return HuggingFaceEndpoint(model=model_name)

    if provider == "ollama":
        return ChatOllama(model=model_name)

    raise ValueError(
        f"Unsupported provider {provider}"
    )

# ── Image Generation ──
IMAGE_OUTPUT_DIR = Path(__file__).parent.parent / "image_outputs"
IMAGE_OUTPUT_DIR.mkdir(exist_ok=True)

def generate_image_from_text(
    prompt: str,
    model_name: str = "black-forest-labs/FLUX.1-schnell",
) -> str:
    
    hf_token = os.getenv("HUGGINGFACE_API_KEY") or os.getenv("HUGGING_FACE_API_KEY")
    if not hf_token:
        return "Error: HUGGINGFACE_API_KEY environment variable is not set."

    try:
        client = InferenceClient(api_key=hf_token)
        image = client.text_to_image(prompt=prompt, model=model_name)

        filename = f"generated_{uuid.uuid4().hex[:8]}.png"
        output_path = IMAGE_OUTPUT_DIR / filename
        image.save(str(output_path))
        return str(output_path)
    except Exception as e:
        return f"Error generating image: {str(e)}"
