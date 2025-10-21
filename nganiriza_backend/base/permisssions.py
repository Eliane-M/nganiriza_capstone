from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='admin').exists()

class IsUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='user').exists()

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='superadmin').exists()