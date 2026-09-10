"""
Quranic Speech-to-Text Recitation Corrector AI Service
======================================================
Author: Kamal Abou Eid
Framework: FastAPI (Production-Ready Microservice)
AI Model: tarteel-ai/whisper-base-ar-quran via Hugging Face Inference
"""

import os
import re
import time
import logging
from typing import List, Dict, Optional
import requests
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("QuranRecitationAI")

# FastAPI App Configuration
app = FastAPI(
    title="قبلة المسلم - المصحح القرآني الذكي",
    description="Microservice for Quranic Audio Transcription and Recitation Error Alignment using AI",
    version="1.0.0"
)

# Enable CORS for Web / PWA integrations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hugging Face AI Configuration
DEFAULT_HF_MODEL = "tarteel-ai/whisper-base-ar-quran"
HF_INFERENCE_URL = f"https://api-inference.huggingface.co/models/{DEFAULT_HF_MODEL}"
DEFAULT_HF_TOKEN = os.getenv("HF_TOKEN", "")

# -------------------------------------------------------------
# Arabic Text Normalization & Quranic Alignment Engine
# -------------------------------------------------------------
TASHKEEL_REGEX = re.compile(r'[\u0617-\u061A\u064B-\u0652\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]')

def normalize_arabic(text: str, strip_tashkeel: bool = True) -> str:
    """
    Normalizes Quranic Arabic text for accurate phonetic comparison:
    - Removes all diacritics / Tashkeel
    - Unifies Alif variants (أ, إ, آ, ٱ -> ا)
    - Unifies Yaa variants (ى, ئ -> ي)
    - Unifies Taa Marbuta (ة -> ه)
    - Strips Quranic stop symbols and non-letters
    """
    if not text:
        return ""
    
    # Strip Tashkeel & Quranic signs
    if strip_tashkeel:
        text = TASHKEEL_REGEX.sub('', text)
    
    # Unify character representations
    text = re.sub(r'[إأآٱ]', 'ا', text)
    text = re.sub(r'ى', 'ي', text)
    text = re.sub(r'ة', 'ه', text)
    text = re.sub(r'[\u06D6-\u06ED]', '', text)  # Quranic annotations
    text = re.sub(r'[^\w\s]', '', text)          # Strip punctuation
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def align_words(original_text: str, recited_text: str) -> Dict:
    """
    Word-level sequence alignment comparing recited words against original Quranic verse.
    Categorizes each word:
    - 'match': Correctly recited
    - 'mismatch': Mispronounced / Substituted
    - 'missing': Omitted from recitation
    - 'extra': Added words not in original
    """
    orig_raw_words = original_text.split()
    orig_norm_words = [normalize_arabic(w) for w in orig_raw_words]
    
    recited_raw_words = recited_text.split()
    recited_norm_words = [normalize_arabic(w) for w in recited_raw_words]

    n = len(orig_norm_words)
    m = len(recited_norm_words)

    # Dynamic Programming Matrix for Levenshtein Alignment
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if orig_norm_words[i - 1] == recited_norm_words[j - 1]:
                cost = 0
            else:
                cost = 1
            dp[i][j] = min(
                dp[i - 1][j] + 1,       # deletion (missing)
                dp[i][j - 1] + 1,       # insertion (extra)
                dp[i - 1][j - 1] + cost # match / substitution
            )

    # Backtracking alignment path
    aligned_words = []
    i, j = n, m
    correct_count = 0

    while i > 0 or j > 0:
        if i > 0 and j > 0 and dp[i][j] == dp[i - 1][j - 1] + (0 if orig_norm_words[i - 1] == recited_norm_words[j - 1] else 1):
            is_match = (orig_norm_words[i - 1] == recited_norm_words[j - 1])
            if is_match:
                correct_count += 1
                aligned_words.append({
                    "original": orig_raw_words[i - 1],
                    "recited": recited_raw_words[j - 1],
                    "status": "match",
                    "status_ar": "صحيحة"
                })
            else:
                aligned_words.append({
                    "original": orig_raw_words[i - 1],
                    "recited": recited_raw_words[j - 1],
                    "status": "mismatch",
                    "status_ar": "خطأ في النطق أو تبديل"
                })
            i -= 1
            j -= 1
        elif i > 0 and (j == 0 or dp[i][j] == dp[i - 1][j] + 1):
            aligned_words.append({
                "original": orig_raw_words[i - 1],
                "recited": None,
                "status": "missing",
                "status_ar": "كلمة منسية / لم تُسمع"
            })
            i -= 1
        else:
            aligned_words.append({
                "original": None,
                "recited": recited_raw_words[j - 1],
                "status": "extra",
                "status_ar": "كلمة زائدة"
            })
            j -= 1

    aligned_words.reverse()

    accuracy = round((correct_count / n) * 100, 1) if n > 0 else 0.0

    return {
        "accuracy_percentage": accuracy,
        "total_words_expected": n,
        "correct_words_count": correct_count,
        "error_words_count": n - correct_count,
        "alignment": aligned_words
    }

# -------------------------------------------------------------
# API Endpoints
# -------------------------------------------------------------

class EvaluationRequest(BaseModel):
    original_verse: str
    recited_text: str

@app.get("/health")
def health_check():
    """Health check & status endpoint"""
    return {
        "status": "online",
        "service": "Quranic AI Recitation Corrector",
        "model": DEFAULT_HF_MODEL,
        "timestamp": time.time()
    }

@app.post("/api/transcribe-recitation")
async def transcribe_recitation(
    file: UploadFile = File(...),
    authorization: Optional[str] = Header(None)
):
    """
    Receives recorded audio from PWA, streams it to Hugging Face Inference API,
    handles cold-starts (503), and returns clean transcription text.
    """
    token = DEFAULT_HF_TOKEN
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "").strip()

    headers = {
        "Content-Type": file.content_type or "audio/webm",
        "x-wait-for-model": "true"
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    try:
        audio_bytes = await file.read()
        logger.info(f"Received audio file {file.filename}, size: {len(audio_bytes)} bytes, mime: {file.content_type}")
    except Exception as e:
        logger.error(f"Failed to read audio file: {e}")
        raise HTTPException(status_code=400, detail="فشل في قراءة ملف التسجيل الصوتي")

    # Call Hugging Face with Retry for 503 Cold Start
    max_retries = 3
    for attempt in range(1, max_retries + 1):
        try:
            logger.info(f"Sending audio to Hugging Face (attempt {attempt}/{max_retries})...")
            response = requests.post(
                HF_INFERENCE_URL,
                headers=headers,
                data=audio_bytes,
                timeout=120
            )

            if response.status_code == 200:
                result = response.json()
                transcribed_text = ""
                if isinstance(result, list) and len(result) > 0:
                    transcribed_text = result[0].get("text", "")
                elif isinstance(result, dict):
                    transcribed_text = result.get("text", "")

                transcribed_text = transcribed_text.strip()
                logger.info(f"Successful transcription: {transcribed_text}")
                return {
                    "success": True,
                    "transcription": transcribed_text,
                    "model": DEFAULT_HF_MODEL
                }

            elif response.status_code == 503:
                data = response.json()
                wait_time = data.get("estimated_time", 15)
                logger.warning(f"HF Model is loading. Waiting {wait_time}s before retry...")
                if attempt < max_retries:
                    time.sleep(min(wait_time, 20))
                    continue
                else:
                    raise HTTPException(
                        status_code=503,
                        detail="نموذج الذكاء الاصطناعي قيد الإقلاع حالياً، يرجى إعادة المحاولة بعد بضع ثوانٍ."
                    )
            else:
                logger.error(f"HF Inference Error: HTTP {response.status_code} - {response.text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"خطأ في خادم التحليل الصوتي: {response.text}"
                )

        except requests.exceptions.Timeout:
            logger.error("Hugging Face Request Timeout")
            if attempt == max_retries:
                raise HTTPException(status_code=504, detail="استغرق خادم الذكاء الاصطناعي وقتاً أطول من المتوقع للإجابة")
        except Exception as err:
            logger.error(f"Unexpected error: {err}")
            raise HTTPException(status_code=500, detail=str(err))

@app.post("/api/evaluate-recitation")
def evaluate_recitation(req: EvaluationRequest):
    """
    Evaluates recited text against the original Quranic verse text.
    Provides word-by-word visual alignment and precision score.
    """
    if not req.original_verse or not req.recited_text:
        raise HTTPException(status_code=400, detail="الآية الأصلية والنص المقروء مطلوبان للتقييم")

    result = align_words(req.original_verse, req.recited_text)
    return {
        "success": True,
        **result
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    logger.info(f"Starting Quran Recitation AI Microservice on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
