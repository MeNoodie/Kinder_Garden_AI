from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.chat import router as chat_router

app = FastAPI(title="Multimodal Ai Playgorund App")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(chat_router)


@app.get("/")
def root():
    return {"message": "Welcome to the Multimodal API. Go to /docs to test!"}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "multimodal-api"}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000)
