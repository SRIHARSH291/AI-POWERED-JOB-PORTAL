from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


# =========================================================
# JOB MODEL
# =========================================================
class Job(models.Model):
    
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('closed', 'Closed'),
    )

    JOB_TYPE_CHOICES = (
        ('Full Time', 'Full Time'),
        ('Part Time', 'Part Time'),
        ('Internship', 'Internship'),
        ('Contract', 'Contract'),
    )

    title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    company_logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    description = models.TextField()
    location = models.CharField(max_length=255)
    salary = models.CharField(max_length=100, blank=True)
    experience = models.CharField(max_length=100, blank=True, default="")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="open") 
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES)
    skills = models.TextField(blank=True, null=True)

    recruiter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='posted_jobs'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    

# =========================================================
# APPLICATION MODEL
# =========================================================
class Application(models.Model):

    STATUS_CHOICES = (
        ('applied', 'Applied'),
        ('reviewed', 'Reviewed'),
        ('shortlisted', 'Shortlisted'),
        ('interview', 'Interview'),
        ('offer', 'Offer'),
        ('hired', 'Hired'),
        ('rejected', 'Rejected'),
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='applications'
    )

    user = models.ForeignKey(
        User,   
        on_delete=models.CASCADE,
        related_name='applications'
    )

    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    cover_letter = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='applied'
    )

    applied_at = models.DateTimeField(auto_now_add=True)
    
    match_score = models.FloatField(null=True, blank=True)
    ai_summary = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user} → {self.job}"
    

# =========================================================
# NOTIFICATIONS
# =========================================================
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    link = models.CharField(max_length=255, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.message}"
    

# =========================================================
# MESSAGE MODEL
# =========================================================
class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


# =========================================================
# SAVED JOB MODEL (FIXED)
# =========================================================
class SavedJob(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='saved_jobs'
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='saved_by'
    )

    saved_at = models.DateTimeField(auto_now_add=True)

    # ✅ FIXED: moved inside class
    match_score = models.FloatField(null=True, blank=True)
    ai_summary = models.TextField(blank=True)

    class Meta:
        unique_together = ('user', 'job')

    def __str__(self):
        return f"{self.user} saved {self.job}"


# =========================================================
# RESUME MODEL
# =========================================================
class Resume(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='resumes'
    )

    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='resumes/')
    is_default = models.BooleanField(default=False)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.name}"







































# from django.db import models
# from django.conf import settings

# User = settings.AUTH_USER_MODEL

# # JOB MODEL
# class Job(models.Model):
    
#     STATUS_CHOICES = (
#         ('open', 'Open'),
#         ('closed', 'Closed'),
#     )

#     JOB_TYPE_CHOICES = (
#         ('Full Time', 'Full Time'),
#         ('Part Time', 'Part Time'),
#         ('Internship', 'Internship'),
#         ('Contract', 'Contract'),
#     )

#     title = models.CharField(max_length=255)
#     company_name = models.CharField(max_length=255)
#     company_logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
#     description = models.TextField()
#     location = models.CharField(max_length=255)
#     salary = models.CharField(max_length=100, blank=True)
#     experience = models.CharField(max_length=100, blank=True, default="")
#     status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="open") 
#     job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES)
#     skills = models.TextField(blank=True, null=True)
#     recruiter = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#         related_name='posted_jobs'
#     )

#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.title
    

# # APPLICATION MODEL
# class Application(models.Model):

#     STATUS_CHOICES = (
#         ('applied', 'Applied'),
#         ('reviewed', 'Reviewed'),
#         ('shortlisted', 'Shortlisted'),
#         ('interview', 'Interview'),
#         ('offer', 'Offer'),
#         ('hired', 'Hired'),
#         ('rejected', 'Rejected'),
#     )

#     job = models.ForeignKey(
#         Job,
#         on_delete=models.CASCADE,
#         related_name='applications'
#     )

#     user = models.ForeignKey(
#         User,   
#         on_delete=models.CASCADE,
#         related_name='applications'
#     )

#     resume = models.FileField(upload_to='resumes/', blank=True, null=True)
#     cover_letter = models.TextField(blank=True)

#     status = models.CharField(
#         max_length=20,
#         choices=STATUS_CHOICES,
#         default='applied'
#     )
#     applied_at = models.DateTimeField(auto_now_add=True)
    
#     match_score = models.FloatField(null=True, blank=True)
#     ai_summary = models.TextField(blank=True, null=True)

    
#     def __str__(self):
#         return f"{self.user} → {self.job}"
    
    
# class Notification(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
#     message = models.TextField()
#     link = models.CharField(max_length=255, null=True, blank=True)
#     is_read = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.user} - {self.message}"
    

# class Message(models.Model):
#     sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
#     receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")
#     application = models.ForeignKey(Application, on_delete=models.CASCADE)
#     content = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)

# # SAVE JOBS MODEL
# class SavedJob(models.Model):

#     user = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#         related_name='saved_jobs'
#     )

#     job = models.ForeignKey(
#         Job,
#         on_delete=models.CASCADE,
#         related_name='saved_by'
#     )

#     saved_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         unique_together = ('user', 'job')

#     def __str__(self):
#         return f"{self.user} saved {self.job}"
    
#     match_score = models.FloatField(null=True, blank=True)
#     ai_summary = models.TextField(blank=True)
    

# # RESUME MODEL
# class Resume(models.Model):

#     user = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#         related_name='resumes'
#     )

#     name = models.CharField(max_length=255)
#     file = models.FileField(upload_to='resumes/')
#     is_default = models.BooleanField(default=False)

#     uploaded_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.user} - {self.name}"