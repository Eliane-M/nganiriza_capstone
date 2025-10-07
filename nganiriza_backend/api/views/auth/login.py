from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

@api_view(["POST"])
def login_api(request):
    username = request.data.get("username")
    password = request.data.get("password")
    try:  
        if username and password:
            user = authenticate(username=username, password=password)
            if user:

                if user.is_active:
                    refresh = RefreshToken.for_user(user)

                    role = "staff" if user.is_staff else "client"

                    user_info = {
                        "first_name": user.first_name,
                        "last_name": user.last_name
                    }

                    return Response({
                    "message": "Login Successful.",
                    "refresh": str(refresh),
                    "access":str(refresh.access_token),
                    "role": role,
                    "user": user_info}, status=status.HTTP_200_OK)
                else:
                    return Response({"error":"error occur"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
           
            else:
                return Response({"error": "There is no user with those credentials"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response({"error":f"There was an error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)