# Multi-Input Multi-Output AI Generator & Learning Hub

This project is a learning-oriented, multi-input multi-output AI playground. It serves as both a functional web application and an educational tool for developers entering the AI space.

## Key Features

- **Multi-Input AI Processing**: Supports text queries, image uploads/prompts, and voice commands/audio recordings.
- **Multi-Output AI Generation**: Generates text responses, audio playback (text-to-speech), and images.
- **Provider & Model Selection**: Users can choose between different model providers (like OpenAI, Gemini, Hugging Face, etc.) and specific models for text, vision, speech, and image generation.
- **Live Code Snippet Viewer**: As users select different models or options, the UI displays the corresponding code structures and snippets live, helping them learn how to write the code themselves.
- **AI Tutor Integration**: Includes an interactive AI tutor to answer user questions and explain AI concepts.
- **User Settings**: Google Sign-In support and ability to set custom API keys to run models on the user's account.

## Technical Architecture

- **Frontend**: A highly responsive, visual interface featuring a model configuration sidebar, interactive generation panels, and a real-time code viewer.
- **Backend**: FastAPI-powered server managing authentication (Google OAuth), provider settings, and orchestrating calls to various AI services (Text, Vision, TTS/STT, and Image Generation).
