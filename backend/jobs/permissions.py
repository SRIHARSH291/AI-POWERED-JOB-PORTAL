from rest_framework.permissions import BasePermission

class IsRecruiter(BasePermission):
    def has_permission(self, request, view):
        return request.user.user_type == "recruiter"

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.user_type == "admin"