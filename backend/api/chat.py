import os
import sys
import tempfile
from typing import Any, Dict, Optional
from uuid import uuid4
from pathlib import Path
from pydantic import BaseModel, Field
from fastapi import APIRouter, UploadFile, File, Form, HTTPException

sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.services.image_service import process_image
from backend.services.speech_service import process_audio, text_to_speech
from backend.services.text_service import process_text

router = APIRouter(prefix="/api", tags=["chat"])

# Temporary directory for uploaded image/audio files.
TEMP_DIR = Path(tempfile.gettempdir()) / "multimodal_uploads"
TEMP_DIR.mkdir(exist_ok=True)


class ChatRequest(BaseModel):
    mode: str = Field(..., description="Interactive Mode")
    query: str = Field(..., description="The Query sent by the user")
    model_name: Optional[str] = Field(default="gemini-2.5-flash", description="Use Model As Per Output Request")
    output_format: str = Field(default="text", description="Given Format From Interactive Mode")


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
    image_file: Optional[str] = None
) -> Dict[str, Any]:
    
    payload = {
        "status": "success",
        "mode": mode,
        "response": response,
        "output_format": output_format,
    }
    # Add audio path to json response
    if audio_file:
        payload["audio_file"] = audio_file

    # Add image path to json response

    if image_file:
        payload["image_file"] = image_file
        
    return payload


@router.post("/chat")
async def chat(mode : str = Form(...),
        query: str = Form(""),
        file: Optional[UploadFile] = File(None),
        model_name: Optional[str] = Form("gemini-2.5-flash"),
        output_format: str = Form("text")) -> Dict[str, Any]:

        mode = mode.strip().lower()
        file_path: Optional[str] = None

        try:
            # Text to Text 
            if mode == "text":
              if not query.strip():
                 raise HTTPException(status_code=400 , detail = "Query is required")            
            try:   
                ai_response = process_text(query , model_name)
                return build_response("text" , ai_response)

            except Exception as e: 
               raise HTTPException(status_code=502, detail = "Ai response Failed Due To process_text Failure")
            

        finally:
         if file_path: 
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

        
