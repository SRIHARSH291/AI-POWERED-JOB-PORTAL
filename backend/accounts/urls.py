from django.urls import path
from .views import RegisterView, ProfileView, user_profile, recruiter_profile_view
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [

    # Registration
    path("register/", RegisterView.as_view(), name="register"),

    # JWT Login
    path("login/", TokenObtainPairView.as_view(), name="login"),

    # Refresh Token
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # User Profile
    path("profile/", ProfileView.as_view(), name="profile"),
    
    path("users/<int:id>/", user_profile, name="user_profile"),
    
    # Recruiter Profile View to User
    path(
        "recruiter-profile/<int:recruiter_id>/",
        recruiter_profile_view,
        name="recruiter-profile",
    ),
    
]