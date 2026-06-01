from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from .models import User, JobSeekerProfile
from .serializers import UserSerializer, ProfileSerializer
from jobs.ai_utils import parse_resume, calculate_profile_score

from django.shortcuts import get_object_or_404

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request, id):
    # user = User.objects.get(id=id)
    user = get_object_or_404(User, id=id)
    profile = getattr(user, "job_seeker_profile", None)

    return Response({
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "profile_picture": request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None,
        "skills": profile.skills if profile else "",
        "bio": profile.bio if profile else "",
    })

# =========================================================
# REGISTER VIEW
# =========================================================
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    authentication_classes = []


# =========================================================
# PROFILE VIEW (CLEAN + FINAL)
# =========================================================
class ProfileView(generics.RetrieveUpdateAPIView):                                                  

    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user

    def get_serializer_context(self):
        return {"request": self.request}

    # GET (AI score logic kept)
    def get(self, request, *args, **kwargs):
        user = request.user

        # 🔥 Only for job seeker
        if user.user_type == "job_seeker":
            job_profile, _ = JobSeekerProfile.objects.get_or_create(user=user)

            if job_profile.resume and (not job_profile.ai_score or job_profile.ai_score == 0):

                resume_path = job_profile.resume.path
                resume_data = parse_resume(resume_path)

                score, matched, missing, feedback, suggestion = calculate_profile_score(resume_data)

                job_profile.ai_score = score
                job_profile.matched_skills = ", ".join(matched)
                job_profile.missing_skills = ", ".join(missing)
                job_profile.ai_feedback = suggestion
                job_profile.save()

        serializer = self.get_serializer(user)
        return Response(serializer.data)

    # UPDATE (delegated to serializer)
    def update(self, request, *args, **kwargs): 
        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
    

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recruiter_profile_view(request, recruiter_id):
        recruiter = get_object_or_404(
            User,
            id=recruiter_id,
            user_type="recruiter"
        )

        profile = getattr(recruiter, "recruiter_profile", None)

        return Response({
            "id": recruiter.id,
            "username": recruiter.username,
            "first_name": recruiter.first_name,
            "last_name": recruiter.last_name,
            "email": recruiter.email,
            "phone_no": recruiter.phone_no,
            "profile_picture": (
                request.build_absolute_uri(recruiter.profile_picture.url)
                if recruiter.profile_picture else None
            ),

            "company_name": profile.company_name if profile else "",
            "website": profile.website if profile else "",
            "industry": profile.industry if profile else "",
            "description": profile.description if profile else "",
            "location": profile.location if profile else "",
            "last_login": recruiter.last_login,
            "date_joined": recruiter.date_joined,
        })