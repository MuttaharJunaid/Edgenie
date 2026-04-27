from rest_framework.permissions import BasePermission


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'student'
        )


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.role == 'admin' or request.user.is_staff)
        )


class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        for attr in ('student', 'user'):
            if hasattr(obj, attr):
                return getattr(obj, attr) == request.user
        return False
