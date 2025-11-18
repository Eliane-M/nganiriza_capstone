from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from django.contrib.auth.models import User
from models.models import Account


@extend_schema(
    tags=["Admin"],
    responses={200: dict}
)
@api_view(["GET"])
@permission_classes([IsAdminUser])
def list_users(request):
    """List all users with pagination"""
    page = max(int(request.GET.get("page", 1)), 1)
    page_size = min(max(int(request.GET.get("page_size", 20)), 1), 100)
    start = (page - 1) * page_size
    end = start + page_size
    
    search = request.GET.get("search", "").strip()
    role_filter = request.GET.get("role", "").strip()
    
    users = User.objects.all().order_by('-date_joined')
    
    # Search filter
    if search:
        users = users.filter(
            username__icontains=search
        ) | users.filter(
            email__icontains=search
        ) | users.filter(
            first_name__icontains=search
        ) | users.filter(
            last_name__icontains=search
        )
    
    # Role filter
    if role_filter:
        if role_filter == "admin":
            users = users.filter(is_superuser=True)
        elif role_filter == "specialist":
            users = users.filter(is_staff=True, is_superuser=False)
        elif role_filter == "user":
            users = users.filter(is_staff=False, is_superuser=False)
    
    total = users.count()
    users_page = users[start:end]
    
    # Get account info for each user
    user_data = []
    for user in users_page:
        try:
            account = Account.objects.get(user=user)
            account_role = account.role
        except Account.DoesNotExist:
            account_role = "user"
        
        # Determine role
        if user.is_superuser:
            role = "admin"
        elif user.is_staff:
            role = "specialist"
        else:
            role = account_role or "user"
        
        user_data.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "full_name": user.get_full_name(),
            "role": role,
            "is_active": user.is_active,
            "date_joined": user.date_joined,
            "last_login": user.last_login,
        })
    
    return Response({
        "count": total,
        "next": page + 1 if end < total else None,
        "previous": page - 1 if start > 0 else None,
        "results": user_data
    }, status=status.HTTP_200_OK)


@extend_schema(
    tags=["Admin"],
    responses={200: dict, 404: dict}
)
@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_user_detail(request, pk):
    """Get detailed information about a specific user"""
    try:
        user = User.objects.get(pk=pk)
        try:
            account = Account.objects.get(user=user)
            account_role = account.role
        except Account.DoesNotExist:
            account_role = "user"
        
        # Determine role
        if user.is_superuser:
            role = "admin"
        elif user.is_staff:
            role = "specialist"
        else:
            role = account_role or "user"
        
        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "full_name": user.get_full_name(),
            "role": role,
            "is_active": user.is_active,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
            "date_joined": user.date_joined,
            "last_login": user.last_login,
        }
        
        return Response(user_data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

