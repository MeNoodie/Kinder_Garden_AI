import sys
from pathlib import Path
from fastapi import HTTPException
import logging

# Configure logging to output to console
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add backend directory to sys.path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from typing import Any , Optional

from backend.utils.cloud_service import get_chat_models


def _normalize_response(response: Any) -> str:
    if isinstance(response, str):
        return response
    if hasattr(response, "content"):
        content = response.content
        if isinstance(content, list):
            return "".join(str(item.get("text", "")) for item in content if isinstance(item, dict))
        return str(content)
    return str(response)


def process_text(user_query: str, model_name: Optional[str] = "gemini-2.5-flash") -> str:
    try:
        model = get_chat_models(model_name)
        response = model.invoke(user_query)
        return _normalize_response(response)
    except Exception as exc:
        logger.exception("AI processing failed!") 
            
        raise HTTPException(
                status_code=502, 
                detail="The AI service is currently unreachable due to sytem Failure"
            )    
            