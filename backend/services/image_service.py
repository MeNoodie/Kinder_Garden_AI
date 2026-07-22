import base64
import sys
from pathlib import Path
from typing import Any, Optional

# Add backend directory to sys.path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

from backend.utils.cloud_service import generate_image_from_text, get_chat_models

load_dotenv()


def _normalize_response(response: Any) -> str:
    if isinstance(response, str):
        return response
    if hasattr(response, "content"):
        content = response.content
        if isinstance(content, list):
            return "".join(str(item.get("text", "")) for item in content if isinstance(item, dict))
        return str(content)
    return str(response)


def process_image(image_path: str, user_query: str, model_name: str = "gemini-2.5-pro") -> str:
    try:
        with open(image_path, "rb") as image_file:
            image_base64 = base64.b64encode(image_file.read()).decode("utf-8")

        message = HumanMessage(
            content=[
                {"type": "text", "text": user_query},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"},
                },
            ]
        )

        model = get_chat_models(model_name)
        response = model.invoke([message])
        return _normalize_response(response)
    except FileNotFoundError:
        return f"Error: Image file not found at {image_path}"
    except Exception as exc:
        return f"Error processing image: {exc}"


def text_to_image(prompt: str, model_name: str = "black-forest-labs/FLUX.1-schnell") -> Optional[str]:
    try:
        result = generate_image_from_text(prompt, model_name)
        if result.startswith("Error"):
            print(f"Image generation failed: {result}")
            return None
        return result
    except Exception as e:
        raise Exception(f"Image generation failed: {str(e)}")
