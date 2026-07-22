import json
import os
import tempfile
from pathlib import Path
from typing import Any, Dict, Optional
from uuid import uuid4

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from backend.services.image_service import process_image, text_to_image
from backend.services.speech_service import process_audio, text_to_speech
from backend.services.text_service import process_text
from backend.utils.cloud_service import get_model_task

router = APIRouter(prefix="/api", tags=["chat"])

TEMP_DIR = Path(tempfile.gettempdir()) / "multimodal_uploads"
TEMP_DIR.mkdir(exist_ok=True)
DEFAULT_TEXT_MODEL = "gemini-2.5-flash"
DEFAULT_VISION_MODEL = "gemini-2.5-pro"
DEFAULT_SPEECH_MODEL = "whisper-large-v3"
DEFAULT_IMAGE_MODEL = "black-forest-labs/FLUX.1-schnell"


def output_url(file_path: str, output_type: str) -> str:
    return f"/outputs/{output_type}/{Path(file_path).name}"


def get_model_for_task(model_name: Optional[str], task: str, default_model: str) -> str:
    if model_name and get_model_task(model_name) == task:
        return model_name

    return default_model


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


@router.get("/dummycode")
async def get_dummycode() -> Dict[str, Any]:
    dummycode_path = Path(__file__).parent.parent / "prompts" / "dummycode.json"
    if not dummycode_path.exists():
        raise HTTPException(status_code=404, detail="dummycode.json file not found")
    try:
        with open(dummycode_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error reading dummycode.json: {exc}")


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

    if output_format not in {"text", "audio", "image"}:
        raise HTTPException(status_code=400, detail="output_format must be 'text', 'image', or 'audio'.")

    try:
        # text to image
        if output_format == "image":
            if not query.strip():
                raise HTTPException(status_code=400, detail="A text prompt is required to generate an image.")

            image_model = get_model_for_task(model_name, "image_generation", DEFAULT_IMAGE_MODEL)
            generated_img = text_to_image(query, image_model)
            if not generated_img:
                raise HTTPException(status_code=502, detail="Image generation failed.")

            return build_response(
                "text",
                "Image generated successfully.",
                "image",
                image_file=output_url(generated_img, "images"),
            )

        # text to text
        if mode == "text":
            if not query.strip():
                raise HTTPException(status_code=400, detail="Query is required")
            text_model = get_model_for_task(model_name, "text", DEFAULT_TEXT_MODEL)
            ai_response = process_text(query, text_model)

            #text to audio
            if output_format == "audio":
                audio_file = text_to_speech(ai_response)
                audio_url = output_url(audio_file, "audio") if audio_file else None
                return build_response("text", ai_response, "audio", audio_file=audio_url)

            return build_response("text", ai_response)

        # image to text
        if mode == "image":
            if file is None:
                raise HTTPException(status_code=400, detail="An image file is required.")

            file_path = await save_upload_file(file)
            vision_model = get_model_for_task(model_name, "vision", DEFAULT_VISION_MODEL)
            ai_response = process_image(file_path, query or "Describe this image.", vision_model)
            return build_response("image", ai_response)

        # audio to text
        if mode == "audio":
            if file is None:
                raise HTTPException(status_code=400, detail="An audio file is required.")

            file_path = await save_upload_file(file)
            speech_model = get_model_for_task(model_name, "speech", DEFAULT_SPEECH_MODEL)
            ai_response = process_audio(file_path, query, speech_model)
            return build_response("audio", ai_response)

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
