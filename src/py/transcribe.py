# -*- coding: utf-8 -*-

import sys
import whisper
from pathlib import Path
import io
import appdirs

model = whisper.load_model("large")
cache_dir = appdirs.user_cache_dir("whisper", "openai")
print(cache_dir)

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
def transcribe_audio(audio_path: str, model_name: str) -> None:
    model = whisper.load_model(model_name)
    result = model.transcribe(audio_path, task=task_type)
    print(result["text"])

if __name__ == "__main__":
    audio_path: str = sys.argv[1]
    model_name: str = sys.argv[2]
    task_type: str = sys.argv[3]
    if Path(audio_path).is_file():
        transcribe_audio(audio_path, model_name)
    else:
        print("File does not exist.")
