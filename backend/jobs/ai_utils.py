import requests
import re
import pdfplumber

AI_BASE_URL = "http://127.0.0.1:8001"


# =========================================================
# 🔥 PARSE RESUME (AI + FALLBACK)
# =========================================================
def parse_resume(file_path):

    url = f"{AI_BASE_URL}/parse-resume/"

    # ✅ TRY AI FIRST
    try:
        with open(file_path, "rb") as f:
            files = {"file": f}
            response = requests.post(url, files=files, timeout=30)

            if response.status_code == 200:
                data = response.json()

                if "preview" in data:
                    return data

    except Exception as e:
        print("AI ERROR:", e)

    print("⚠ AI failed → using fallback")

    # =========================================================
    # 🔥 FALLBACK PARSER
    # =========================================================
    text = ""

    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + " "
    except Exception as e:
        print("PDF ERROR:", e)

    words = re.findall(r'\b\w+\b', text.lower())

    return {
    "word_count": len(words),
    "words": words,
    "resume_text": text,   # 🔥 IMPORTANT
    "preview": text[:300],
}


# =========================================================
# 🔥 DEMAND SKILLS
# =========================================================
DEMAND_SKILLS = [
    "python", "django", "fastapi",
    "react", "node", "javascript",
    "sql", "mongodb", "aws",
    "machine learning", "ai"
]


# =========================================================
# 🔥 EXTRACT SKILLS
# =========================================================
def extract_skills_from_resume(resume_data):

    words = resume_data.get("words", [])
    text = " ".join(words).lower()

    return [skill for skill in DEMAND_SKILLS if skill in text]


# =========================================================
# 🔥 MATCH JOB (AI ONLY)
# =========================================================
def match_job(resume_text, job_description):

    url = f"{AI_BASE_URL}/match-job/"

    try:
        response = requests.post(url, json={
            "resume_text": resume_text,
            "job_description": job_description
        }, timeout=10)

        if response.status_code == 200:
            return response.json()

    except Exception as e:
        print("AI FAILED:", e)

    return {"match_score": 0}


# =========================================================
# 🔥 PROFILE SCORE
# =========================================================
def calculate_profile_score(resume_data):

    words = resume_data.get("words", [])

    if not words:
        return 0, [], [], "No data found", ""

    text = " ".join(words).lower()

    skills_db = ["python", "django", "react", "node", "sql", "ai"]

    matched = [s for s in skills_db if s in text]
    missing = [s for s in skills_db if s not in text]

    score = int((len(matched) / len(skills_db)) * 100)

    feedback = "Good profile 👍" if score > 50 else "Improve your skills ⚠"

    suggestion = generate_ai_suggestions(missing)

    return score, matched, missing, feedback, suggestion


# =========================================================
# 🔥 SUGGESTIONS
# =========================================================
def generate_ai_suggestions(missing_skills):

    if not missing_skills:
        return "Your profile is strong 🔥"

    return "Learn: " + ", ".join(missing_skills[:3])


# =========================================================
# 🔥 AUTO SHORTLIST
# =========================================================
def auto_shortlist(application):

    if application.match_score >= 80:
        application.status = "shortlisted"
    elif application.match_score < 40:
        application.status = "rejected"

    application.save()