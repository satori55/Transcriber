# -*- coding: utf-8 -*-

import sys
import whisper
from pathlib import Path
import io

sys.stdout.reconfigure(encoding='utf-8')
def transcribe_audio(audio_path):
    model = whisper.load_model("tiny")
    result = model.transcribe(audio_path)
    print(result["text"])

if __name__ == "__main__":
    audio_path = sys.argv[1]
    # print(audio_path)
    # audio_path = "D:/transcriber/sample3.mp3"
    if Path(audio_path).is_file():
        transcribe_audio(audio_path)
    else:
        print("File does not exist.")
