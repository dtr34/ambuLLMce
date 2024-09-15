from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
import rag
import os
import io
import tempfile
from pydub import AudioSegment
import ffmpeg
import uuid
import moviepy.editor as moviepy

# Initialize the FastAPI app
app = FastAPI()

# Configure CORS
origins = [
    "https://whimsical-cuchufli-0af8f6.netlify.app/",  # Replace with your Netlify URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins= ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Initialize the RAG model
    global logan, twentyOneSavage
    logan = rag.Model()
    twentyOneSavage = rag.Whisper()

# Directory to store uploaded files
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

processed_data_store = {}

# Route to handle the root URL of the API
@app.get("/") 
async def read_root():
    return {"message": "Welcome to the API"}


# Route to handle file upload
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):

   

    path = await convert_to_wav(file, os.getcwd())
    
    # Process the file content (MP3) as needed
    # For example, you could save it to disk or process it further
    

    #transcribe the mp3 file to text using rag
    textFromAudio = twentyOneSavage.translate(path)
    

    # Process the file and generate questions (dummy data for now)
    questions = logan.ask(textFromAudio)
        

    # Return the questions list as JSON
    return {"questions": questions}

    
    



def save_wav_file(audio_segment: AudioSegment, directory: str) -> str:
    os.makedirs(directory, exist_ok=True)
    filename = "file.wav"
    file_path = os.path.join(directory, filename)
    audio_segment.export(file_path, format="wav")
    return file_path

async def convert_to_wav(file: UploadFile, save_directory: str) -> str:
    content = await file.read()
    file_extension = os.path.splitext(file.filename)[1].lower()
    
    if file_extension == '.mp3':
        audio = AudioSegment.from_mp3(io.BytesIO(content))
    elif file_extension == '.webm':
        audio = AudioSegment.from_file(io.BytesIO(content))
    elif file_extension == '.wav':
        audio = AudioSegment.from_wav(io.BytesIO(content))


    else:
        raise ValueError("Unsupported file format. Only MP3 and WebM are allowed.")
    
    # Save the audio as WAV to the specified directory
    wav_path = save_wav_file(audio, save_directory)
    return str(wav_path)



def convert_webm_to_mp3(input_file, output_file):
    try:
        ffmpeg.input(input_file).output(output_file).run()
        
    except ffmpeg.Error as e:
        return JSONResponse(content={"error": "Error converting file"}, status_code=400)