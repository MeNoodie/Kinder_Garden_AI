import sys
from pathlib import Path
from pydantic import SecretStr

# Add backend directory to sys.path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from typing import Optional, Dict, Any
from utils.cloud_service import get_chat_models, get_tasks, get_provider
import base64
import os
from langchain_core.messages import HumanMessage
from langchain_community.tools.audio import HuggingFaceTextToSpeechModelInference
from dotenv import load_dotenv

load_dotenv()


HUGGINGFACE_API_KEY = (
    os.getenv("HUGGINGFACE_API_KEY")
    or os.getenv("HUGGING_FACE_API_KEY")
)

AUDIO_DIR = "./audio_outputs"

# create audio directory 
os.makedirs(AUDIO_DIR, exist_ok=True)

# text to speech
tts_tool = HuggingFaceTextToSpeechModelInference(
    model="microsoft/speecht5_tts",
    file_extension="wav",
    destination_dir=AUDIO_DIR,
    huggingface_api_key=SecretStr(HUGGINGFACE_API_KEY) 
)

def process_text(user_query: str, model_name: str = "gemini-2.5-flash") -> str:
    

    try:
        model = get_chat_models(model_name)
        response = model.invoke(user_query)
        if isinstance(response, str):
            return response
        elif hasattr(response, 'content'):
            return str(response.content)
        else:
            return str(response)
    except Exception as e:
        return f"Error processing text: {str(e)}"


def process_image(image_path: str, user_query: str, model_name: str = "gemini-2.5-flash") -> str:
    
    try:
        # Encode image to base64
        with open(image_path, "rb") as image_file:
            image_base64 = base64.b64encode(image_file.read()).decode('utf-8')
        
        # Create HumanMessage with image and text
        message = HumanMessage(
            content=[
                {"type": "text", "text": user_query},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}
                }
            ]
        )
        
        # Get model and invoke
        model = get_chat_models(model_name)
        response = model.invoke([message])
        
        # Extract response
        if isinstance(response, str):
            return response
        elif hasattr(response, 'content'):
            return str(response.content)
        else:
            return str(response)
    except FileNotFoundError:
        return f"Error: Image file not found at {image_path}"
    except Exception as e:
        return f"Error processing image: {str(e)}" 

def process_audio(audio_path: str, user_query: str = "", model_name: str = "whisper") -> str:
    
    try:
        if not os.path.exists(audio_path):
            return f"Error: Audio file not found at {audio_path}"
        
        # Get model and process audio
        model = get_chat_models(model_name)
        query = user_query or "Transcribe this audio"
        response = model.invoke(f"Audio path: {audio_path}\nQuery: {query}")
        
        # Extract response
        if isinstance(response, str):
            return response
        elif hasattr(response, 'content'):
            return str(response.content)
        else:
            return str(response)
    except Exception as e:
        return f"Error processing audio: {str(e)}"


def text_to_speech(text: str, speaker_id: int = 0) -> Optional[str]:
    
    try:
        # Run TTS tool with the raw text input string
        audio_file = tts_tool.run(text)
        return audio_file
    except Exception as e:
        print(f"Error converting text to speech: {str(e)}")
        return None


def main(
    input_data: str,
    input_modality: str = "Text",
    output_modality: str = "Text",
    model_name: Optional[str] = None,
    user_query: str = "Analyze this"
) -> Dict[str, Any]:
    
    result = {
        "status": "error",
        "output": None,
        "output_type": output_modality,
        "input_type": input_modality
    }
    
    try:
        # Process input based on modality
        if input_modality == "Text":
            model = model_name or "gemini-2.5-flash-3.3"
            response = process_text(input_data, model)
            
        elif input_modality == "Image":
            model = model_name or "gemini-2.5-flash"
            response = process_image(input_data, user_query, model)
            
        elif input_modality == "Audio":
            model = model_name or "whisper"
            response = process_audio(input_data, user_query, model)
        
        else:
            result["output"] = f"Unsupported input modality: {input_modality}"
            return result
        
        # Convert to desired output modality
        if output_modality == "Text":
            result["status"] = "success"
            result["output"] = response
            
        elif output_modality == "Audio":
            # Generate audio from text response
            audio_file = text_to_speech(response)
            if audio_file:
                result["status"] = "success"
                result["output"] = audio_file
                result["text_content"] = response  # Also return the text
            else:
                result["output"] = f"Audio generation failed. Text response: {response}"
            
        elif output_modality == "Image":
            result["output"] = f"Image generation not yet implemented. Text response: {response}"
        
        else:
            result["output"] = response
            
    except Exception as e:
        result["error"] = str(e)
        result["output"] = f"Error in main processing: {str(e)}"
    
    return result


