from sentence_transformers import SentenceTransformer, util
from .models import Job

model = SentenceTransformer('all-MiniLM-L6-v2')

def recommend_jobs_for_user(user):

    user_skills = getattr(user, "skills", "") or ""
    user_bio = getattr(user, "bio", "") or ""

    user_text = f"{user_skills} {user_bio}".strip()

    jobs = list(Job.objects.all())

    if not jobs:
        return []

    job_texts = [
        f"{job.title} {job.description} {job.skills or ''}"
        for job in jobs
    ]

    # 🔥 Embeddings
    user_embedding = model.encode(user_text, convert_to_tensor=True)
    job_embeddings = model.encode(job_texts, convert_to_tensor=True)

    # 🔥 Semantic similarity
    similarities = util.cos_sim(user_embedding, job_embeddings)[0]

    ranked_jobs = sorted(
        zip(jobs, similarities),
        key=lambda x: x[1],
        reverse=True
    )

    return ranked_jobs









# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
# from .models import Job


# def recommend_jobs_for_user(user):

#     # ---- Build user profile text safely ----
#     user_skills = getattr(user, "skills", "") or ""
#     user_bio = getattr(user, "bio", "") or ""

#     user_profile_text = f"{user_skills} {user_bio}".strip()

#     # ---- Fetch jobs ----
#     jobs = list(Job.objects.all())

#     if not jobs:
#         return []

#     # ---- Build job texts (use multiple fields for better matching) ----
#     job_texts = [
#         f"{job.title} {job.description} {job.location} {job.job_type}"
#         for job in jobs
#     ]

#     # ---- TF-IDF Vectorization ----
#     vectorizer = TfidfVectorizer(stop_words="english")

#     vectors = vectorizer.fit_transform([user_profile_text] + job_texts)

#     # ---- Cosine Similarity ----
#     similarities = cosine_similarity(
#         vectors[0:1], vectors[1:]
#     ).flatten()

#     # ---- Rank jobs by similarity ----
#     ranked_jobs = sorted(
#         zip(jobs, similarities),
#         key=lambda x: x[1],
#         reverse=True
#     )

#     return ranked_jobs