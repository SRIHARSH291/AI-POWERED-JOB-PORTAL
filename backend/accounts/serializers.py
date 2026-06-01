from rest_framework import serializers
from .models import User, JobSeekerProfile, RecruiterProfile


# =========================================================
# USER REGISTRATION SERIALIZER
# =========================================================
class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    # frontend support
    firstname = serializers.CharField(write_only=True, required=False)
    lastname = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "firstname",
            "lastname",
            "email",
            "phone_no",
            "password",
            "user_type",
            "is_active",
        ]

    def create(self, validated_data):

        first_name = validated_data.pop("firstname", "")
        last_name = validated_data.pop("lastname", "")
        password = validated_data.pop("password")

        user = User(**validated_data)
        user.first_name = first_name
        user.last_name = last_name
        user.set_password(password)
        user.save()

        # ✅ PROFILE CREATION REMOVED (handled by signals)

        return user


# =========================================================
# JOB SEEKER PROFILE SERIALIZER
# =========================================================
class JobSeekerProfileSerializer(serializers.ModelSerializer):

    resume_url = serializers.SerializerMethodField()

    class Meta:
        model = JobSeekerProfile
        fields = "__all__"

    def get_resume_url(self, obj):
        request = self.context.get("request")

        if obj.resume:
            if request:
                return request.build_absolute_uri(obj.resume.url)
            return f"http://127.0.0.1:8000{obj.resume.url}"

        return None


# =========================================================
# RECRUITER PROFILE SERIALIZER
# =========================================================
class RecruiterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruiterProfile
        fields = "__all__"


# =========================================================
# PROFILE SERIALIZER
# =========================================================
class ProfileSerializer(serializers.ModelSerializer):

    job_seeker_profile = JobSeekerProfileSerializer(read_only=True)
    recruiter_profile = RecruiterProfileSerializer(read_only=True)
    profile_picture_url = serializers.SerializerMethodField()
    last_login = serializers.DateTimeField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone_no",
            "user_type",
            "profile_picture",
            "profile_picture_url",
            "job_seeker_profile",
            "recruiter_profile",
            "last_login",
            "date_joined",
        ]

    def update(self, instance, validated_data):
        request = self.context.get("request")

        # ==========================================
        # UPDATE USER BASIC FIELDS
        # ==========================================
        instance.username = validated_data.get(
            "username",
            instance.username
        )
        instance.first_name = validated_data.get(
            "first_name",
            instance.first_name
        )
        instance.last_name = validated_data.get(
            "last_name",
            instance.last_name
        )
        instance.email = validated_data.get(
            "email",
            instance.email
        )
        instance.phone_no = validated_data.get(
            "phone_no",
            instance.phone_no
        )

        # Profile picture update
        if request and request.FILES.get("profile_picture"):
            instance.profile_picture = request.FILES["profile_picture"]

        instance.save()

        # ==========================================
        # UPDATE JOB SEEKER PROFILE
        # ==========================================
        if instance.user_type == "job_seeker":
            profile, _ = JobSeekerProfile.objects.get_or_create(
                user=instance
            )

            profile.bio = request.data.get(
                "bio",
                profile.bio
            )
            profile.skills = request.data.get(
                "skills",
                profile.skills
            )
            profile.experience = request.data.get(
                "experience",
                profile.experience
            )

            if request.FILES.get("resume"):
                profile.resume = request.FILES["resume"]

            profile.save()

        # ==========================================
        # UPDATE RECRUITER PROFILE
        # ==========================================
        elif instance.user_type == "recruiter":
            profile, _ = RecruiterProfile.objects.get_or_create(
                user=instance
            )

            profile.company_name = request.data.get(
                "company_name",
                profile.company_name
            )
            profile.website = request.data.get(
                "website",
                profile.website
            )
            profile.description = request.data.get(
                "description",
                profile.description
            )
            profile.industry = request.data.get(
                "industry",
                profile.industry
            )
            profile.location = request.data.get(
                "location",
                profile.location
            )

            profile.save()

        return instance

    def get_profile_picture_url(self, obj):
        request = self.context.get("request")
        if obj.profile_picture and request:
            return request.build_absolute_uri(obj.profile_picture.url)
        return None