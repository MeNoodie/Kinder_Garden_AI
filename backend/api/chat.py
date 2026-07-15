import os
import sys
import tempfile
from typing import Any, Dict, Optional
from uuid import uuid4
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, Form, HTTPException

sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.services.image_service import process_image
from backend.services.speech_service import process_audio, text_to_speech
from backend.services.text_service import process_text

router = APIRouter(prefix="/api", tags=["chat"])

# Temporary directory for uploaded image/audio files.
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
) -> Dict[str, Any]:
    payload: Dict[str, Any] = {
        "status": "success",
        "mode": mode,
        "response": response,
        "output_format": output_format,
    }

    if audio_file:
        payload["audio_file"] = audio_file

    return payload


def text_msg(query: str, model_name: str, output_format: str) -> Dict[str, Any]:
    response = process_text(user_query=query, model_name=model_name)

    if output_format == "audio":
        audio_file = text_to_speech(response)
        return build_response("text", response, "audio", audio_file)

    return build_response("text", response)


# def image_msg(
#     image_path: str,
#     query: str,
#     model_name: str,
#     output_format: str,
# ) -> Dict[str, Any]:
#     response = process_image(
#         image_path=image_path,
#         user_query=query or "Describe this image in detail.",
#         model_name=model_name,
#     )

#     if output_format == "audio":
#         audio_file = text_to_speech(response)
#         return build_response("image", response, "audio", audio_file)

#     return build_response("image", response)


# def audio_msg(
#     audio_path: str,
#     query: str,
#     model_name: str,
#     output_format: str,
# ) -> Dict[str, Any]:
#     response = process_audio(
#         audio_path=audio_path,
#         user_query=query,
#         model_name=model_name,
#     )

#     if output_format == "audio":
#         audio_file = text_to_speech(response)
#         return build_response("audio", response, "audio", audio_file)

#     return build_response("audio", response)


@router.post("/chat")
async def chat(
    mode: str = Form(...),
    query: str = Form(""),
    file: Optional[UploadFile] = File(None),
    model_name: Optional[str] = Form(None),
    output_format: str = Form("text"),
) -> Dict[str, Any]:
    mode = mode.strip().lower()
    output_format = output_format.strip().lower()

    if output_format not in {"text", "audio"}:
        raise HTTPException(status_code=400, detail="output_format must be 'text' or 'audio'.")

    file_path: Optional[str] = None

    try:
        if mode == "text":
            if not query.strip():
                raise HTTPException(status_code=400, detail="query is required for text mode.")
            return text_msg(
                query=query,
                model_name=model_name or "gemini-2.5-flash",
                output_format=output_format,
            )

        # if mode == "image":
        #     if not file or not file.content_type or not file.content_type.startswith("image/"):
        #         raise HTTPException(status_code=400, detail="Image mode requires an image file.")
        #     file_path = await save_upload_file(file)
        #     return image_msg(
        #         image_path=file_path,
        #         query=query,
        #         model_name=model_name or "gemini-2.5-flash",
        #         output_format=output_format,
        #     )

        # if mode == "audio":
        #     if not file or not file.content_type or not file.content_type.startswith("audio/"):
        #         raise HTTPException(status_code=400, detail="Audio mode requires an audio file.")
        #     file_path = await save_upload_file(file)
        #     return audio_msg(
        #         audio_path=file_path,
        #         query=query,
        #         model_name=model_name or "whisper",
        #         output_format=output_format,
        #     )

        raise HTTPException(status_code=400, detail="mode must be 'text', 'image', or 'audio'.")
    finally:
        cleanup_temp_file(file_path)
