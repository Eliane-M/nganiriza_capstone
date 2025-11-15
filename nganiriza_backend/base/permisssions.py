from rest_framework import permissions

class IsSpecialist(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Specialist').exists()

class IsUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='User').exists()
