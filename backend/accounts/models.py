from django.db import models
from django.contrib.auth.models import AbstractUser


# =========================================================
# CUSTOM USER MODEL
# =========================================================
class User(AbstractUser):

    USER_TYPE_CHOICES = (
        ("job_seeker", "Job Seeker"),
        ("recruiter", "Recruiter"),
        ("admin", "Admin"),
    )

    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default="job_seeker"
    )

    phone_no = models.CharField(max_length=15, blank=True, null=True)

    profile_picture = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.username


# =========================================================
# JOB SEEKER PROFILE
# =========================================================
class JobSeekerProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="job_seeker_profile"
    )

    bio = models.TextField(blank=True)
    skills = models.TextField(blank=True)
    experience = models.TextField(blank=True)

    resume = models.FileField(
        upload_to="user_resumes/",
        blank=True,
        null=True
    )

    linkedin = models.URLField(blank=True)
    github = models.URLField(blank=True)
    ai_score = models.FloatField(default=0)
    matched_skills = models.TextField(blank=True)
    missing_skills = models.TextField(blank=True)
    ai_feedback = models.TextField(blank=True)

    def __str__(self):
        return f"JobSeeker: {self.user.username}"


# =========================================================
# RECRUITER PROFILE
# =========================================================
class RecruiterProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="recruiter_profile")
    company_name = models.CharField(max_length=255)
    website = models.URLField(blank=True)
    industry = models.TextField(blank=True)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.company_name
    