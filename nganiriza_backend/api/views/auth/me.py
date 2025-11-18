from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    if getattr(user, "is_superuser", False):
        role = "admin"
    elif getattr(user, "is_staff", False):
        role = "specialist"
    else:
        role = "user"
    return Response(
        {
            "id": user.id,
            "email": getattr(user, "email", ""),
            "first_name": getattr(user, "first_name", ""),
            "last_name": getattr(user, "last_name", ""),
            "role": role,
        }
    )

