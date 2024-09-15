import rag

whisper = rag.Whisper()

filename = "audio_test1.wav"

try:
       
    with open(filename, 'rb') as file:
        # Read the file content
        contents = file.read()

        # Process the file content (MP3) as needed
        # For example, you could save it to disk or process it further
      

        #transcribe the mp3 file to text using rag
        textFromAudio = whisper.translate_bytes(contents)

        print(textFromAudio)

        

        
        

except Exception as e:
    print(f"stupid: {str(e)}")
    pass


print(whisper.translate(filename))