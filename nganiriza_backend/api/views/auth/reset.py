from django.utils import timezone
import random
import string
from models.models import ResetPassword, ResetPasswordConfirmation
from models.serializers import PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from authentication.services.emails.emails import *
from django.contrib.auth.hashers import make_password
from drf_spectacular.utils import extend_schema
from models.serializers import LogoutRequestSerializer


@extend_schema(
    tags=["Auth"],
    request=PasswordResetRequestSerializer,
    responses={200: dict, 400: dict, 404: dict, 500: dict},
    auth=[]
)
@api_view(["POST"])
@permission_classes([])
def password_reset_request(request):
    email = request.data.get("email")
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        ResetPassword.objects.create(
            email=email,
            code=code,
            expires=timezone.now() + timezone.timedelta(minutes=5),
        )
        # Send the email with the code to the user's email address
        reset_email_password(email, user.first_name, code)
        return Response({"message": "Password reset instructions sent to email"}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({"error": "User with that email does not exist"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Log the error here for debugging
        print(f'An error occurred: {str(e)}')
        return Response({"error": "An error occurred while sending password reset email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@extend_schema(
    tags=["Auth"],
    request=PasswordResetConfirmSerializer,
    responses={200: dict, 400: dict, 500: dict},
    auth=[]
)
@api_view(["POST"])
@permission_classes([])
def password_reset_confirm(request):
    code = request.data.get("code")
    email = request.data.get("email")
    new_password = request.data.get("new_password")

    if not code or not email or not new_password:
        return Response({"error": "Code, Email, and new password are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        reset_password_entry = ResetPassword.objects.get(email=email, code=code)

        if timezone.now() > reset_password_entry.expires:
            return Response({"error": "The reset code has expired"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(email=email)
        user.password = make_password(new_password)
        user.save()

        reset_password_entry.delete()

        try:
            # Send email to confirm new password to the user's email address
            user = User.objects.get(email=email)
            confirm_reset_email(email, user.first_name)
        except Exception as e:
                return Response({"error": "An error occurred while sending confirmation email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"success":"Password has been reset successfully. An email has been sent to your email address"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "Invalid user ID"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": f"There was an error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)