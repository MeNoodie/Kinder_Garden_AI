import os
import tempfile
from pathlib import Path
from typing import Any, Dict, Optional
from uuid import uuid4

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from backend.services.speech_service import text_to_speech
from backend.services.text_service import process_text

router = APIRouter(prefix="/api", tags=["chat"])

TEMP_DIR = Path(tempfile.gettempdir()) / "multimodal_uploads"
TEMP_DIR.mkdir(exist_ok=True)


async def save_upload_file(upload_file: UploadFile) -> str:
    if not upload_file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file must have a filename.")

    file_extension = Path(upload_file.filename).suffix
    temp_file_path = TEMP_DIR / f"{uuid4().hex}{file_extension}"

    try:
        file_content = await upload_file.read()
        temp_file_path.write_bytes(file_content)
        return str(temp_file_path)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Error saving file: {exc}") from exc


def cleanup_temp_file(file_path: Optional[str]) -> None:
    if not file_path:
        return

    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except OSError as exc:
        print(f"Warning: Could not delete temp file {file_path}: {exc}")


def build_response(
    mode: str,
    response: str,
    output_format: str = "text",
    audio_file: Optional[str] = None,
    image_file: Optional[str] = None,
) -> Dict[str, Any]:
    payload: Dict[str, Any] = {
        "status": "success",
        "mode": mode,
        "response": response,
        "output_format": output_format,
    }

    if audio_file:
        payload["audio_file"] = audio_file

    if image_file:
        payload["image_file"] = image_file

    return payload


@router.post("/chat")
async def chat(
    mode: str = Form(...),
    query: str = Form(""),
    file: Optional[UploadFile] = File(None),
    model_name: Optional[str] = Form("gemini-2.5-flash"),
    output_format: str = Form("text"),
) -> Dict[str, Any]:
    mode = mode.strip().lower()
    output_format = output_format.strip().lower()
    file_path: Optional[str] = None

    if output_format not in {"text", "audio"}:
        raise HTTPException(status_code=400, detail="output_format must be 'text' or 'audio'.")

    try:
        if mode == "text":
            if not query.strip():
                raise HTTPException(status_code=400, detail="Query is required")

            ai_response = process_text(query, model_name or "gemini-2.5-flash")

            if output_format == "audio":
                audio_file = text_to_speech(ai_response)
                return build_response("text", ai_response, "audio", audio_file=audio_file)

            return build_response("text", ai_response)

        

        raise HTTPException(status_code=400, detail="mode must be 'text', 'image', or 'audio'.")
    finally:
        cleanup_temp_file(file_path)







if __name__ == "__main__":
    import uvicorn
    
    # This fires up the Uvicorn server automatically when the script runs directly
    uvicorn.run(
        "chat:router",  # Change to "chat:app" if you bound the router to a FastAPI() app instance
        host="127.0.0.1",
        port=8000,
        reload=True
    )