from rest_framework import viewsets, filters
from django.core.mail import send_mail
from rest_framework.views import APIView, PermissionDenied
from rest_framework.generics import RetrieveAPIView
from rest_framework.decorators import permission_classes, action, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from accounts.models import JobSeekerProfile
from .models import Job, Notification, Message, Resume, Application, SavedJob
from .serializers import JobSerializer, ApplicationSerializer, MessageSerializer, NotificationSerializer, ResumeSerializer
from .permissions import IsAdmin, IsRecruiter
from .ai_utils import parse_resume, match_job
from django.core.mail import send_mail
from django.db.models import Q
import re

User = get_user_model()


# =========================================================
# ADMIN PASSWORDS
# =========================================================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user

    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not user.check_password(old_password):
        return Response({"error": "Wrong Password"}, status=400)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Password Updated"})


# =========================================================
# ADMIN PROFILE
# =========================================================
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def admin_profile(request):
    user = request.user

    if request.method == "GET":
        return Response({
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone_no": user.phone_no,
            "last_login": user.last_login,
            "date_joined": user.date_joined,
            "profile_picture": (
                request.build_absolute_uri(user.profile_picture.url)
                if user.profile_picture else None
            )
        })

    if request.method == "PATCH":
        user.first_name = request.data.get("first_name", user.first_name)
        user.last_name = request.data.get("last_name", user.last_name)
        user.phone_no = request.data.get("phone_no", user.phone_no)

        if request.FILES.get("profile_picture"):
            user.profile_picture = request.FILES["profile_picture"]

        user.save()

        return Response({"message": "Profile updated"})


# =========================================================
# ADMIN EMAILS
# =========================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_invite_email(request):
    email = request.data.get("email")

    if not email:
        return Response({"error": "Email required"}, status=400)

    send_mail(
        subject="You're invited 🎉",
        message="You are Invited to Join our Job Portal... Register here: http://localhost:3000/register",
        from_email="your_email@gmail.com",
        recipient_list=[email],
        fail_silently=False 
    )

    return Response({"message": "Invite Sent"})



# =========================================================
# RECRUITER EMAILS
# =========================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def recruiter_send_email(request):
    email = request.data.get("email")
    message = request.data.get("message")

    send_mail(
        subject="Job Update",
        message=message,
        from_email="your_email@gmail.com",
        recipient_list=[email],
    )

    return Response({"message": "Email sent"})


# =========================================================
# SEND MESSAGE
# =========================================================
from django.utils import timezone
from django.core.mail import send_mail
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):

    sender = request.user
    receiver_id = request.data.get("receiver_id")
    content = request.data.get("content")

    try:
        receiver = User.objects.get(id=receiver_id)

        # =====================================
        # ⏱️ STEP 1 — PREVENT SPAM (ADD HERE)
        # =====================================
        last_message = Message.objects.filter(sender=sender).last()

        if last_message and (timezone.now() - last_message.created_at).seconds < 10:
            return Response({"error": "Wait before sending again"}, status=400)


        # =====================================
        # 💬 STEP 2 — SAVE MESSAGE
        # =====================================
        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            content=content
        )


        # =====================================
        # 🧠 STEP 3 — SEND EMAIL (ONLY IF OFFLINE)
        # =====================================
        if not getattr(receiver, "is_online", False):

            send_mail(
                subject=f"New message from {sender.username}",
                message=f"""
Hello {receiver.username},

You have a New Message from {sender.username}:

"{content}"

Login to Reply: http://localhost:3000/chat

© B⚡H AI BRIGHT SKILL HUB
""",
                from_email="your_email@gmail.com",
                recipient_list=[receiver.email],
                fail_silently=True
            )


        # =====================================
        # ✅ RESPONSE
        # =====================================
        return Response({"message": "Sent Successfully"})

    except User.DoesNotExist:
        return Response({"error": "User not Found"}, status=404)


# =========================================================
# 📊 ADMIN STATS
# =========================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_stats(request):

    jobs = Job.objects.all()

    return Response({
        "total_users": User.objects.count(),
        "job_seekers": User.objects.filter(user_type="job_seeker").count(),
        "recruiters": User.objects.filter(user_type="recruiter").count(),

        "total_jobs": jobs.count(),
        "open_jobs": jobs.filter(status="open").count(),
        "closed_jobs": jobs.filter(status="closed").count(),

        "applications": Application.objects.count(),

        # 🔥 chart data
        "chart": [
            {"name": "Users", "value": User.objects.count()},
            {"name": "Jobs", "value": jobs.count()},
            {"name": "Applications", "value": Application.objects.count()},
        ]
    })


# =========================================================
# 👥 ALL USERS
# =========================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_users(request):
    users = User.objects.filter(is_active=True)
    data = []

    for u in users:
        data.append({
            "id": u.id,
            "username": u.username,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "email": u.email,
            "phone_no": u.phone_no,
            "user_type": u.user_type,
            "profile_picture": request.build_absolute_uri(u.profile_picture.url) if u.profile_picture else None,
            "is_active": u.is_active,
        })

    return Response(data)


# =========================================================
# 👥 ADD USER (ADMIN CREATES)
# =========================================================
from django.contrib.auth.hashers import make_password

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_create_user(request):
    try:
        data = request.data

        if User.objects.filter(username=data.get("username")).exists():
            return Response({"error": "Username already exists"}, status=400)

        if User.objects.filter(email=data.get("email")).exists():
            return Response({"error": "Email already exists"}, status=400)

        user = User.objects.create(
            username=data.get("username"),
            first_name=request.data.get("first_name"),
            last_name=request.data.get("last_name"),
            email=data.get("email"),
            phone_no=data.get("phone_no"),
            user_type=data.get("user_type"),
        )
        
        user.set_password(data.get("password"))  # ✅ MUST
        user.save()
        
        return Response({"message": "User Created Successfully"})

    except Exception as e:
        return Response({"error": str(e)}, status=400)


# =========================================================
# 👥 EDIT USER
# =========================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_single_user(request, id):
    try:
        user = User.objects.get(id=id)

        return Response({
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone_no": user.phone_no,
            "user_type": user.user_type,
        })

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user(request, id):
    try:
        user = User.objects.get(id=id)

        # 🚫 Protect admin
        if user.user_type == "admin":
            return Response({"error": "Cannot modify admin"}, status=403)

        user.username = request.data.get("username", user.username)
        user.first_name = request.data.get("first_name", user.first_name)
        user.last_name = request.data.get("last_name", user.last_name)
        user.email = request.data.get("email", user.email)
        user.phone_no = request.data.get("phone_no", user.phone_no)
        user.user_type = request.data.get("user_type", user.user_type)

        user.save()

        return Response({"message": "User updated"})

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)



# =========================================================
# 👥 CHANGE USER ROLE
# =========================================================
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsAdmin])
def change_user_role(request, user_id):
    try:
        user = User.objects.get(id=user_id)

        # 🚫 Protect admin
        if user.user_type == "admin":
            return Response({"error": "Cannot modify admin"}, status=403)

        role = request.data.get("user_type")

        if role not in ["job_seeker", "recruiter", "admin"]:
            return Response({"error": "Invalid role"}, status=400)

        user.user_type = role
        user.save()

        return Response({"message": "Role updated"})

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)


# =========================================================
# ❌ SOFT DELETE USER (RECOVERABLE DELETE)
# =========================================================
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdmin])
def delete_user_permanent(request, user_id):
    """
    Instead of permanently deleting the user,
    we deactivate them so the admin can restore later.
    """

    try:
        user = User.objects.get(id=user_id)

        # 🚫 Protect admin accounts
        if user.user_type == "admin":
            return Response(
                {"error": "Cannot delete admin"},
                status=403
            )

        # 🚫 Prevent deleting yourself
        if request.user.id == user.id:
            return Response(
                {"error": "You cannot delete yourself"},
                status=400
            )

        # =====================================================
        # SOFT DELETE
        # =====================================================
        user.is_active = False
        user.save()

        return Response({
            "message": "User moved to recycle bin successfully",
            "recoverable": True,
            "user_id": user.id,
            "username": user.username,
            "is_active": user.is_active
        })

    except User.DoesNotExist:
        return Response(
            {"error": "User Not Found"},
            status=404
        )

# =========================================================
# ♻️ RESTORE DELETED USER
# =========================================================
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsAdmin])
def restore_user(request, user_id):
    """
    Restore a previously soft-deleted user.
    """

    try:
        user = User.objects.get(id=user_id)

        # If already active
        if user.is_active:
            return Response({
                "message": "User is already active"
            })

        # Restore
        user.is_active = True
        user.save()

        return Response({
            "message": "User restored successfully",
            "user_id": user.id,
            "username": user.username,
            "is_active": user.is_active
        })

    except User.DoesNotExist:
        return Response(
            {"error": "User Not Found"},
            status=404
        )


# =========================================================
# 🗑️ RECYCLE BIN (LIST DEACTIVATED USERS)
# =========================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def deleted_users(request):
    """
    Show all soft-deleted users.
    """

    users = User.objects.filter(is_active=False)

    data = []

    for u in users:
        data.append({
            "id": u.id,
            "username": u.username,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "email": u.email,
            "phone_no": u.phone_no,
            "user_type": u.user_type,
            "profile_picture": (
                request.build_absolute_uri(u.profile_picture.url)
                if u.profile_picture else None
            ),
            "is_active": u.is_active,
        })

    return Response(data)
    
    
# =========================================================
# ❌ Ban USER
# =========================================================   
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsAdmin])
def ban_unban_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)

        # 🚫 Protect admin
        if user.user_type == "admin":
            return Response({"error": "Cannot modify admin"}, status=403)

        # 🚫 Prevent banning yourself
        if request.user.id == user.id:
            return Response({"error": "You cannot ban yourself"}, status=400)

        user.is_active = not user.is_active
        user.save()

        return Response({
            "message": "User status updated",
            "is_active": user.is_active
        })

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    
# =========================================================
# 📋 ALL JOBS
# =========================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_jobs(request):
    jobs = Job.objects.select_related("recruiter").all().order_by("-created_at")

    data = []

    for job in jobs:
        data.append({
            "id": job.id,
            "title": job.title,
            "company_name": job.company_name,
            "status": job.status,

            # ✅ Recruiter details
            "recruiter": {
                "id": job.recruiter.id if job.recruiter else None,
                "first_name": job.recruiter.first_name if job.recruiter else "",
                "last_name": job.recruiter.last_name if job.recruiter else "",
                "username": job.recruiter.username if job.recruiter else "",
                "email": job.recruiter.email if job.recruiter else "",
            },
        })

    return Response(data)

# =========================================================
# 🚫 CLOSE / BLOCK JOB
# =========================================================

@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsAdmin])
def block_job(request, job_id):
    try:
        job = Job.objects.get(id=job_id)

        # 🔁 TOGGLE STATUS
        if job.status == "closed":
            job.status = "open"
        else:
            job.status = "closed"

        job.save()

        return Response({
            "message": "Job updated",
            "status": job.status   # ✅ IMPORTANT
        })

    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)

# =========================================================
# 📄 ALL APPLICATIONS
# =========================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_applications(request):
    apps = Application.objects.select_related("user", "job")

    serializer = ApplicationSerializer(
        apps,
        many=True,
        context={"request": request}   # 🔥 IMPORTANT for profile picture URL
    )

    return Response(serializer.data)


# =========================================================
# 📄 ADMIN RECRUITERS INSIGHTS
# =========================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def recruiter_insights(request):

    recruiters = User.objects.filter(user_type="recruiter")

    data = []

    for r in recruiters:
        jobs = Job.objects.filter(recruiter=r)
        apps = Application.objects.filter(job__recruiter=r)
        company = jobs.first().company_name if jobs.exists() else "No Company"
        
        data.append({
        "recruiter": r.username,
        "jobs_posted": jobs.count(),
        "applications": apps.count(),
        "profile_picture": (
            request.build_absolute_uri(r.profile_picture.url)
            if r.profile_picture else None
        ),
        "first_name": r.first_name,
        "last_name": r.last_name,
        "company_name": company,
    })

    return Response(data)


# =========================================================
# TOP RECRUITERS + PERFORMANCE
# =========================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def recruiter_performance(request):

    recruiters = User.objects.filter(user_type="recruiter")
    leaderboard = []
    chart_data = []

    for r in recruiters:
        jobs = Job.objects.filter(recruiter=r)

        applications = Application.objects.filter(job__in=jobs)
        company = jobs.first().company_name if jobs.exists() else "No Company"

        leaderboard.append({
            "username": r.username,
            "first_name": r.first_name,
            "last_name": r.last_name,
            "profile_picture": request.build_absolute_uri(r.profile_picture.url) if r.profile_picture else None,
            "company_name": company,
            "jobs_posted": jobs.count(),
            "applications": applications.count(),
        })

        chart_data.append({
            "name": f"{r.first_name} {r.last_name}",
            "applications": applications.count()
        })

    # 🔥 sort leaderboard (top recruiters first)
    leaderboard = sorted(
        leaderboard,
        key=lambda x: x["applications"],
        reverse=True
    )

    return Response({
        "leaderboard": leaderboard[:5],  # top 5
        "chart": chart_data
    })

# =========================================================
# JOB VIEWSET
# =========================================================
class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all().order_by("-created_at")
    serializer_class = JobSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "title",
        "company_name",
        "location",
        "job_type",
        "salary",
    ]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]

        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
    
        # Anonymous user
        if not user.is_authenticated:
            return Job.objects.filter(
                status="open"
            ).order_by("-created_at")
    
        # Recruiter
        if getattr(user, "user_type", None) == "recruiter":
            return Job.objects.filter(
                recruiter=user
            ).order_by("-created_at")
    
        # Admin
        if getattr(user, "user_type", None) == "admin" or user.is_staff:
            return Job.objects.all().order_by("-created_at")
    
        # Job Seeker
        return Job.objects.filter(
            status="open"
        ).order_by("-created_at")
    
    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated(), IsRecruiter()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)

    def perform_update(self, serializer):
        user = self.request.user
        job = serializer.instance

        # ✅ Admin can update ANY job and change recruiter
        if user.user_type == "admin" or user.is_staff:
            serializer.save()
            return

        # ✅ Recruiter can update only own jobs
        if user != job.recruiter:
            raise PermissionDenied("Not allowed")

        # Prevent recruiter from changing recruiter field
        serializer.save(recruiter=user)

    def perform_destroy(self, instance):
        user = self.request.user

        # ✅ Admin can delete any job
        if user.user_type == "admin" or user.is_staff:
            instance.delete()
            return

        # ✅ Recruiter can delete only own jobs
        if user != instance.recruiter:
            raise PermissionDenied("Not allowed")

        instance.delete()

    @action(detail=True, methods=["post"])
    def save_job(self, request, pk=None):
        job = self.get_object()

        saved, created = SavedJob.objects.get_or_create(
            user=request.user,
            job=job,
        )

        if not created:
            saved.delete()
            return Response({"message": "Job unsaved"})

        return Response({"message": "Job saved"})

    # ==========================================================
    # DELETE
    # ==========================================================
        user = self.request.user

        # ✅ Admin can delete any job
        if getattr(user, "user_type", "") == "admin":
            instance.delete()
            return

        # ✅ Recruiter can delete only their own job
        if user != instance.recruiter:
            raise PermissionDenied("Not allowed")

        instance.delete()

    # ==========================================================
    # SAVE / UNSAVE JOB
    # ==========================================================
    @action(detail=True, methods=["post"])
    def save_job(self, request, pk=None):
        job = self.get_object()

        saved, created = SavedJob.objects.get_or_create(
            user=request.user,
            job=job
        )

        if not created:
            saved.delete()
            return Response({"message": "Job unsaved"})

        return Response({"message": "Job saved"})


# =========================================================
# APPLICATION VIEWSET
# =========================================================
class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        user = self.request.user

        if user.user_type == "recruiter":
            # recruiter sees applicants for their jobs
            return Application.objects.filter(job__recruiter=user)

        # job seeker sees their own applications
        return Application.objects.filter(user=user)
    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            old_status = instance.status  # 🔥 track previous status
            updated_instance = serializer.save()

            # 🔔 Only notify if status actually changed
            if old_status != updated_instance.status:
                Notification.objects.create(
                    user=updated_instance.user,
                    message=f"Your application for {updated_instance.job.title} is {updated_instance.status}"
                )

            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def perform_create(self, serializer):
        application = serializer.save(user=self.request.user)
                

        
        if not application.resume:
            default_resume = Resume.objects.filter(
                user=self.request.user,
                is_default=True
            ).first()

            if default_resume:
                application.resume = default_resume.file
                print("✅ Default resume attached")
            else:
                print("❌ No resume + no default resume")
                application.match_score = 0
                application.save()
                return

        try:
            resume_path = application.resume.path

            resume_data = parse_resume(resume_path)

            resume_text = resume_data.get(
                "resume_text",
                ""
            )

            if not resume_text.strip():
                application.match_score = 0
                application.save()
                return

            match_result = match_job(
                resume_text,
                application.job.description or ""
            )

            score = match_result.get("match_score", 0)

            application.match_score = round(score, 2)

        except Exception as e:
            print("ERROR:", e)
            application.match_score = 0

        application.save()


        full_name = f"{self.request.user.first_name} {self.request.user.last_name}".strip()

        Notification.objects.create(
        user=application.job.recruiter,
        message=f"{full_name} applied to {application.job.title}"
    )
        
    
    
    
# =========================================================
# NOTIFICATIONS
# =========================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    notifications = Notification.objects.filter(user=request.user).order_by("-created_at")
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, pk):
    notif = Notification.objects.get(id=pk, user=request.user)
    notif.is_read = True
    notif.save()
    return Response({"status": "read"})

# =========================================================
# MESSAGES
# =========================================================
class MessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, app_id):
        messages = Message.objects.filter(application_id=app_id).order_by("created_at")
        return Response(MessageSerializer(messages, many=True).data)

    def post(self, request):
        serializer = MessageSerializer(data=request.data)

        if serializer.is_valid():
            application = serializer.validated_data.get("application")

            # ✅ DETERMINE RECEIVER FIRST
            if request.user == application.user:
                receiver = application.job.recruiter
            else:
                receiver = application.user

            # ✅ SAVE WITH RECEIVER (FIX)
            message = serializer.save(
                sender=request.user,
                receiver=receiver
            )

            # ✅ CREATE NOTIFICATION
            Notification.objects.create(
                user=receiver,
                message=f"{request.user.first_name} {request.user.last_name}: {message.content[:30]}",
                link=f"/chat/{application.id}/{request.user.id}"
            )

            return Response(MessageSerializer(message).data)

        return Response(serializer.errors, status=400)
            


# =========================================================
# RECOMMENDED JOBS
# =========================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recommended_jobs(request):

    print("\n🔥 SMART RECOMMENDATION STARTED")

    try:
        # =====================================================
        # 1. GET USER PROFILE
        # =====================================================
        profile = request.user.job_seeker_profile

        if not profile.resume:
            print("❌ NO RESUME FOUND")
            return Response({"results": []})

        resume_path = profile.resume.path
        print("📄 RESUME PATH:", resume_path)

        # =====================================================
        # 2. PARSE RESUME
        # =====================================================
        parsed = parse_resume(resume_path)

        # Try both keys to be safe
        resume_text = (
            parsed.get("resume_text")
            or parsed.get("preview")
            or ""
        )

        print("📝 RESUME LENGTH:", len(resume_text))

        if not resume_text.strip():
            print("❌ NO RESUME TEXT FOUND")
            return Response({"results": []})

        # =====================================================
        # 3. FETCH JOBS (LIMIT FOR SPEED)
        # =====================================================
        jobs = Job.objects.filter(status="open")[:10]
        print("💼 TOTAL JOBS:", jobs.count())

        results = []

        # =====================================================
        # 4. CALCULATE AI MATCH SCORE
        # =====================================================
        for job in jobs:
            try:
                print("\n==============================")
                print("JOB:", job.title)

                match = match_job(
                    resume_text[:1500],
                    f"{job.title} {job.description[:1500]}"
                )

                print("RAW MATCH:", match)

                raw_score = float(match.get("match_score", 0))
                score = round(raw_score * 100, 2)

                print("FINAL SCORE:", score)

                # Keep jobs above threshold
                if (
                    score >= 35
                    and job.title
                    and str(job.title).strip()
                ):
                    # Extract resume and job skills
                    resume_words = set(
                        re.findall(r"[a-zA-Z+#.]{2,}", resume_text.lower())
                    )

                    job_words = set(
                        re.findall(
                            r"[a-zA-Z+#.]{2,}",
                            f"{job.title} {job.description}".lower()
                        )
                    )

                    # Remove common stop words
                    stop_words = {
                        "the", "and", "for", "with", "you", "your",
                        "our", "are", "will", "this", "that",
                        "have", "has", "from", "into", "using",
                        "years", "year", "experience", "knowledge",
                        "skills", "ability", "team", "work"
                    }

                    resume_words -= stop_words
                    job_words -= stop_words

                    matched_skills = sorted(list(resume_words & job_words))[:5]
                    missing_skills = sorted(list(job_words - resume_words))[:5]

                    # AI suggestion
                    if missing_skills:
                        suggestion = (
                            "Learn " + ", ".join(missing_skills[:3])
                            + " to improve your score."
                        )
                    else:
                        suggestion = "Excellent match! Your profile aligns very well."

                    # Match level
                    if score >= 80:
                        match_level = "Excellent Match"
                    elif score >= 60:
                        match_level = "Strong Match"
                    elif score >= 40:
                        match_level = "Moderate Match"
                    else:
                        match_level = "Low Match"

                    results.append({
                        "id": job.id,
                        "title": str(job.title),
                        "company_name": str(job.company_name or "Unknown Company"),
                        "location": str(job.location or "Remote"),
                        "match_score": score,
                        "match_level": match_level,
                        "matched_skills": matched_skills,
                        "missing_skills": missing_skills,
                        "suggestion": suggestion,
                    })

            except Exception as e:
                print("❌ JOB ERROR:", e)

        # =====================================================
        # 5. SORT BY SCORE DESC
        # =====================================================
        results.sort(
            key=lambda x: x["match_score"],
            reverse=True
        )

        # =====================================================
        # 6. REMOVE DUPLICATES
        # =====================================================
        clean_results = []
        seen = set()

        for item in results:
            key = (
                item["title"].strip().lower(),
                item["company_name"].strip().lower()
            )

            if key not in seen:
                seen.add(key)
                clean_results.append(item)

        # =====================================================
        # 7. DEBUG OUTPUT
        # =====================================================
        print("\n✅ FINAL RECOMMENDATIONS:")
        for item in clean_results[:5]:
            print(
                f"{item['title']} | "
                f"{item['company_name']} | "
                f"{item['match_score']}%"
            )

        # =====================================================
        # 8. RETURN TOP 5
        # =====================================================
        return Response({
            "results": clean_results[:5]
        })

    except Exception as e:
        print("❌ RECOMMENDATION ERROR:", str(e))
        return Response({
            "results": [],
            "error": str(e)
        }, status=500)



# =========================================================
# RANKED APPLICANTS
# =========================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsRecruiter])
def ranked_applicants(request, job_id):

    applications = Application.objects.filter(job_id=job_id)

    ranked = [{
        "id": app.id,
        "applicant": app.user.username,
        "match_score": app.match_score or 0,
        "status": app.status,
    } for app in applications]

    ranked.sort(key=lambda x: x["match_score"], reverse=True)

    return Response(ranked)


# =========================================================
# RECRUITER DASHBOARD
# =========================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recruiter_dashboard(request):
    user = request.user

    jobs = Job.objects.filter(recruiter=user)
    applications = Application.objects.filter(job__recruiter=user)

    total_jobs = jobs.count()
    total_apps = applications.count()
    shortlisted = applications.filter(status="shortlisted").count()

    avg_score = (
        sum([a.match_score or 0 for a in applications]) / total_apps
        if total_apps > 0 else 0
    )

    return Response({
        "total_jobs_posted": total_jobs,
        "total_applications_received": total_apps,
        "shortlisted": shortlisted,
        "avg_score": round(avg_score, 2),
        "chart": [
            {"name": "Jobs", "applications": total_jobs},
            {"name": "Applications", "applications": total_apps},
            {"name": "Shortlisted", "applications": shortlisted},
        ]
    })


# =========================================================
# RECRUITER APPLICANTS
# =========================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsRecruiter])
def recruiter_applicants(request):
    applications = Application.objects.filter(job__recruiter=request.user)

    serializer = ApplicationSerializer(
        applications,
        many=True,
        context={"request": request}
    )
    return Response(serializer.data)

# =========================================================
# RESUME APIs
# =========================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_resumes(request):
    resumes = Resume.objects.filter(user=request.user)
    serializer = ResumeSerializer(resumes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_default_resume(request):
    resume = Resume.objects.filter(user=request.user, is_default=True).first()

    if not resume:
        return Response({"resume": None})

    return Response({"resume": resume.file.url})


# =========================================================
# QUICK APPLY
# =========================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def quick_apply(request):

    user = request.user
    job_id = request.data.get('job')

    default_resume = Resume.objects.filter(user=user, is_default=True).first()

    if not default_resume:
        return Response({"error": "No default resume"}, status=400)

    if Application.objects.filter(user=user, job_id=job_id).exists():
        return Response({"error": "Already applied"}, status=400)

    application = Application.objects.create(
        user=user,
        job_id=job_id,
        resume=default_resume.file
    )

    try:
        resume_data = parse_resume(application.resume.path)
        resume_text = resume_data.get(
            "resume_text",
            ""
        )
        match_result = match_job(resume_text, application.job.description)
        score = match_result.get("match_score", 0)
        reason = match_result.get("reason", "")

        if score == 0:
            if application.job.skills:
                skills = application.job.skills.lower().split(",")
                matches = sum(
                    1 for skill in skills 
                    if skill.strip() and skill.strip() in resume_text.lower()
                )
                if len(skills) > 0:
                    score = matches / len(skills)

        application.match_score = round(score * 100, 2)

        application.ai_summary = str(resume_data)

    except Exception as e:
        print("AI ERROR:", e)

    application.save()

    return Response({"message": "Quick applied"})


# =========================================================
# AI MATCH SCORE
# =========================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_match_score(request):

    job_id = request.data.get('job_id')

    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)

    resume = Resume.objects.filter(user=request.user, is_default=True).first()

    if not resume:
        return Response({"error": "No resume"}, status=400)

    try:
        resume_data = parse_resume(resume.file.path)
        resume_text = resume_data.get(
            "resume_text",
            ""
        )
        result = match_job(resume_text, job.description)

        score = result.get("match_score", 0)
        return Response({"match_score": round(score * 100, 2)})

    except Exception as e:
        return Response({"error": "AI failed"}, status=500)


# =========================================================
# SAVED JOBS
# =========================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def saved_jobs(request):
    saved = SavedJob.objects.filter(user=request.user)
    jobs = [s.job for s in saved]

    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)


class JobDetailView(RetrieveAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer


class JobSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.GET.get("q", "")
        location = request.GET.get("location", "")
        skill = request.GET.get("skill", "")
        user = request.user

        if user.is_staff or getattr(user, "user_type", None) == "recruiter":
            jobs = Job.objects.all()   # recruiter sees all jobs
        else:
            jobs = Job.objects.filter(status="open")  # jobseeker only open jobs

        if query:
            jobs = jobs.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query)
            )

        if location:
            jobs = jobs.filter(location__icontains=location)

        if skill:
            jobs = jobs.filter(
                Q(description__icontains=skill) |
                Q(title__icontains=skill)
            )

        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    
