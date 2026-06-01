from rest_framework import serializers
from .models import Job, Notification, Message, Resume, Application, SavedJob
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from datetime import timedelta

User = get_user_model()

class JobSerializer(serializers.ModelSerializer):
    recruiter_details = serializers.SerializerMethodField()
    applicant_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = "__all__"

        # ✅ Recruiter should not be editable by normal recruiters,
        # but admins can still update it through the API.
        read_only_fields = []

    # =====================================================
    # VALIDATE JOB TYPE
    # =====================================================
    def validate_job_type(self, value):
        valid_types = [choice[0] for choice in Job.JOB_TYPE_CHOICES]

        if value not in valid_types:
            raise serializers.ValidationError("Invalid job type")

        return value

    # =====================================================
    # APPLICANT COUNT
    # =====================================================
    def get_applicant_count(self, obj):
        return obj.applications.count()

    # =====================================================
    # RECRUITER DETAILS
    # =====================================================
    def get_recruiter_details(self, obj):
        if not obj.recruiter:
            return None

        full_name = (
            f"{obj.recruiter.first_name} {obj.recruiter.last_name}"
        ).strip()

        return {
            "id": obj.recruiter.id,
            "username": obj.recruiter.username,
            "first_name": obj.recruiter.first_name or "",
            "last_name": obj.recruiter.last_name or "",
            "full_name": full_name or obj.recruiter.username,
            "email": obj.recruiter.email or "No email available",
            "phone_no": getattr(obj.recruiter, "phone_no", "N/A"),
        }

    # =====================================================
    # UPDATE METHOD
    # Allows admin to change recruiter from AdminEditJob.jsx
    # =====================================================
    def update(self, instance, validated_data):
        recruiter = validated_data.pop("recruiter", None)

        # Update all other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Update recruiter if provided
        if recruiter is not None:
            instance.recruiter = recruiter

        instance.save()
        return instance

class ApplicationSerializer(serializers.ModelSerializer):
    resume_url = serializers.SerializerMethodField()

    selected_resume = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True
    )

    user = serializers.SerializerMethodField()
    recruiter_job_details = serializers.SerializerMethodField()
    recruiter_id = serializers.IntegerField(source="job.recruiter.id", read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)
    company_name = serializers.CharField(source="job.company_name", read_only=True)
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    job_id = serializers.IntegerField(source="job.id", read_only=True)
    recruiter_name = serializers.CharField(
        source="job.recruiter.username",
        read_only=True
    )
    recruiter_first_name = serializers.CharField(
        source="job.recruiter.first_name",
        read_only=True
    )
    recruiter_last_name = serializers.CharField(
        source="job.recruiter.last_name",
        read_only=True
    )
    # Writable field for POST/PUT
    job = serializers.PrimaryKeyRelatedField(
        queryset=Job.objects.all()
    )

    # Read-only detailed job info for GET responses
    job_details = serializers.SerializerMethodField()
    last_seen = serializers.DateTimeField(
        source="job.recruiter.last_login",
        read_only=True
    )
    is_online = serializers.SerializerMethodField()
    recruiter_profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = "__all__"
        read_only_fields = ["user", "applied_at"]

    # =====================================================
    # CREATE APPLICATION
    # =====================================================
    def create(self, validated_data):
        selected_resume = validated_data.pop("selected_resume", None)

        # If no new file uploaded but existing resume selected
        if not validated_data.get("resume") and selected_resume:
            # Convert full URL to relative media path if needed
            if "/media/" in selected_resume:
                selected_resume = selected_resume.split("/media/")[-1]

            # Save relative path into FileField
            validated_data["resume"] = selected_resume

        return super().create(validated_data)

    # =====================================================
    # RECRUITER PROFILE PICTURE
    # =====================================================
    def get_recruiter_profile_picture(self, obj):
        request = self.context.get("request")
        recruiter = obj.job.recruiter
        pic = getattr(recruiter, "profile_picture", None)

        if pic and request:
            return request.build_absolute_uri(pic.url)
        return None

    # =====================================================
    # ONLINE STATUS
    # =====================================================
    def get_is_online(self, obj):
        last_login = obj.job.recruiter.last_login
        if not last_login:
            return False
        return (now() - last_login) < timedelta(minutes=5)

    # =====================================================
    # RECRUITER JOB DETAILS
    # =====================================================
    def get_recruiter_job_details(self, obj):
        return {
            "id": obj.job.id,
            "title": obj.job.title,
        }

    # =====================================================
    # USER DETAILS
    # =====================================================
    def get_user(self, obj):
        request = self.context.get("request")
        profile_pic = obj.user.profile_picture
        profile = getattr(obj.user, "job_seeker_profile", None)

        return {
            "id": obj.user.id,
            "username": obj.user.username,
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name,
            "email": obj.user.email,
            "profile_picture": (
                request.build_absolute_uri(profile_pic.url)
                if profile_pic and request else None
            ),
            "skills": profile.skills if profile else "",
            "bio": profile.bio if profile else "",
        }

    # =====================================================
    # RESUME URL
    # =====================================================
    def get_resume_url(self, obj):
        request = self.context.get("request")
        if obj.resume and request:
            return request.build_absolute_uri(obj.resume.url)
        return None

    # =====================================================
    # JOB DETAILS
    # =====================================================
    def get_job_details(self, obj):
        return {
            "id": obj.job.id,
            "title": obj.job.title,
            "company_name": obj.job.company_name,
            "location": obj.job.location,
        }
    
class SavedJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedJob
        fields = '__all__'
        
class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'
        
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
        
class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = "__all__"
        read_only_fields = ["sender", "receiver"]
        
    def get_sender_name(self, obj):
        first = obj.sender.first_name or ""
        last = obj.sender.last_name or ""
        full_name = f"{first} {last}".strip()
        return full_name if full_name else obj.sender.username