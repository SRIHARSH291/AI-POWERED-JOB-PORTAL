from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer, util
import nltk
import re
import warnings
import pdfplumber
import io

warnings.filterwarnings("ignore")

app = FastAPI()


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# NLTK
# ============================================================

try:
    nltk.data.find("tokenizers/punkt")
except:
    nltk.download("punkt")


# ============================================================
# LOAD MODEL
# ============================================================

print("Loading AI model...")

model = SentenceTransformer('all-MiniLM-L6-v2')

print("AI model loaded successfully 🚀")


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def home():
    return {"message": "AI Service Running 🚀"}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None
    }


# ============================================================
# RESUME PARSING
# ============================================================

@app.post("/parse-resume/")
async def parse_resume(file: UploadFile = File(...)):

    try:

        content = await file.read()

        text = ""

        # ==================================================
        # PDF EXTRACTION
        # ==================================================
        if file.filename.endswith(".pdf"):

            pdf_file = io.BytesIO(content)

            with pdfplumber.open(pdf_file) as pdf:

                for page in pdf.pages:

                    extracted = page.extract_text()

                    if extracted:
                        text += extracted + " "

        else:
            try:
                text = content.decode("utf-8")

            except:
                text = content.decode(
                    "latin-1",
                    errors="ignore"
                )

        # ==================================================
        # CLEAN TEXT
        # ==================================================
        text = re.sub(r"\s+", " ", text)

        words = nltk.word_tokenize(text)

        emails = re.findall(r'\S+@\S+', text)

        phones = re.findall(r'\b\d{10}\b', text)

        skill_keywords = [
            "python",
            "java",
            "react",
            "django",
            "sql",
            "machine learning",
            "ai",
            "data analysis",
            "node",
            "express",
            "mongodb",
            "fastapi",
            "aws",
            "docker",
            "postgresql"
        ]

        text_lower = text.lower()

        found_skills = [
            s for s in skill_keywords
            if s in text_lower
        ]

        return {
            "word_count": len(words),
            "words": words,
            "resume_text": text,   # 🔥 IMPORTANT
            "email": emails[0] if emails else None,
            "phone": phones[0] if phones else None,
            "skills": found_skills,
            "preview": text[:500]
        }

    except Exception as e:

        print("PARSE ERROR:", e)

        return {
            "error": str(e)
        }

# ============================================================
# MATCH JOB
# ============================================================

class MatchRequest(BaseModel):
    resume_text: str
    job_description: str


@app.post("/match-job/")
async def match_job(data: MatchRequest):

    try:

        if model is None:
            return {
                "match_score": 0,
                "error": "Model not loaded"
            }

        embeddings = model.encode(
            [data.resume_text, data.job_description],
            convert_to_tensor=True
        )

        similarity = util.cos_sim(
            embeddings[0],
            embeddings[1]
        ).item()

        # 🔥 KEEP BETWEEN 0-1
        similarity = max(0, similarity)

        print("MATCH SCORE:", similarity)

        return {
            "match_score": round(similarity, 4)
        }

    except Exception as e:

        print("MATCH ERROR:", e)

        return {
            "match_score": 0,
            "error": str(e)
        }


# ============================================================
# MULTI JOB MATCH
# ============================================================

class MultiMatchRequest(BaseModel):
    resume_text: str
    jobs: list


@app.post("/match-multiple-jobs/")
async def match_multiple_jobs(data: MultiMatchRequest):

    try:

        if model is None:
            return {"error": "Model not loaded"}

        texts = [data.resume_text] + data.jobs

        embeddings = model.encode(
            texts,
            convert_to_tensor=True
        )

        scores = util.cos_sim(
            embeddings[0],
            embeddings[1:]
        )[0]

        return {
            "scores": [
                round(max(0, s.item()), 4)
                for s in scores
            ]
        }

    except Exception as e:

        print("MULTI MATCH ERROR:", e)

        return {"error": str(e)}