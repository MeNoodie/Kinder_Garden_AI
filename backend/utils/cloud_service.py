from pathlib import Path
import yaml
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_ollama import ChatOllama
from langchain_huggingface import HuggingFaceEndpoint

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

def get_chat_models(model_name):

    provider = get_provider(model_name)
    if provider is None:
        raise ValueError(f"Model '{model_name}' is not configured")

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



