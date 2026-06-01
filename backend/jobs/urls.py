from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    JobViewSet, 
    ApplicationViewSet,
    MessageView,
    JobDetailView,
    JobSearchView,
    admin_profile,
    recommended_jobs,
    change_password,
    send_invite_email,
    admin_stats,
    admin_users,
    get_single_user,
    update_user,
    delete_user_permanent,
    deleted_users,
    restore_user, 
    change_user_role,
    admin_create_user,
    ban_unban_user,
    admin_jobs,
    block_job,
    admin_applications,
    recruiter_insights,
    recruiter_performance,
    get_notifications,
    mark_notification_read, 
    ranked_applicants, 
    recruiter_dashboard,
    recruiter_applicants, 
    get_resumes, 
    get_default_resume, 
    quick_apply, 
    ai_match_score,
    saved_jobs,
)

router = DefaultRouter()
router.register(r'jobs', JobViewSet)
router.register(r'applications', ApplicationViewSet, basename='applications')

urlpatterns = [
    path('', include(router.urls)),

    path("change-password/", change_password),
    path("admin/profile/", admin_profile),
    path("admin/send-invite/", send_invite_email),

    path("admin/stats/", admin_stats),  # ✅ FIXED (only once)

    path('admin/users/', admin_users), 
    path("admin/create-user/", admin_create_user),
    path("admin/users/<int:id>/", get_single_user),
    path("admin/update-user/<int:id>/", update_user),
    path("admin/delete-user/<int:user_id>/", delete_user_permanent),
    path("admin/deleted-users/", deleted_users),
    path("admin/restore-user/<int:user_id>/", restore_user),
    path("admin/change-role/<int:user_id>/", change_user_role),
    path("admin/ban-user/<int:user_id>/", ban_unban_user),

    path('admin/jobs/', admin_jobs), 
    path('admin/block-job/<int:job_id>/', block_job),
    path('admin/applications/', admin_applications),

    path("admin/recruiters-insights/", recruiter_insights),
    path("admin/recruiters-performance/", recruiter_performance),

    path("notifications/", get_notifications),
    path("notifications/<int:pk>/read/", mark_notification_read),

    path("messages/<int:app_id>/", MessageView.as_view()),
    path("send-message/", MessageView.as_view()),

    path("recommended/", recommended_jobs),
    path('jobs/<int:pk>/', JobDetailView.as_view()),
    path("job-search/", JobSearchView.as_view(), name="job-search"),

    path('job/<int:job_id>/ranked-applicants/', ranked_applicants),
    path('recruiter/dashboard/', recruiter_dashboard),
    path("recruiter/applicants/", recruiter_applicants),

    path('resumes/', get_resumes),
    path('profile/resume/', get_default_resume),

    path('applications/quick-apply/', quick_apply),
    path('ai/match-score/', ai_match_score),

    path('saved-jobs/', saved_jobs),
]