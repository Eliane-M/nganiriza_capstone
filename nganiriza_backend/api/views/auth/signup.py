from django.contrib.auth.models import User
from authentication.services.emails.emails import new_account_email
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view
from models.models import Account, AccountEmail, Sector
from models.serializers import UserSerializer

@api_view(["POST"])
def new_user(request):
    if request.method == "POST":
        
        email = request.data.get("email")
        full_name = request.data.get("full_name")
        password = request.data.get("password")
        date_of_birth = request.data.get("date_of_birth")
        place_of_origin = request.data.get("place_of_origin")
        phone_number = request.data.get("phone_number")
        first_name,last_name = "" , ""

        if email is None or full_name is None or password is None:
            return Response({"error":"Email, password and names must not be empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        if full_name:
            parts = full_name.split()
            first_name = parts[0]
            if len(parts) > 1:
                last_name = parts[1]

        try:
            validate_email(email)
            if User.objects.filter(email=email).exists():
                return Response({"error":"User with same credentials exist"}, status=status.HTTP_409_CONFLICT)
            user = User.objects.create(
                email=email,
                username=email,
                first_name = first_name,
                last_name=last_name,
                password=make_password(password)
            )

            account = Account.objects.create(
                user = user,
                sector = Sector.objects.get(id=place_of_origin) if place_of_origin else None,
                phone_number = phone_number,
                date_of_birth = date_of_birth,
            )

            if user is not None:
                try:
                    AccountEmail.objects.create(
                        email = user.email,
                    )
                    print("account email created")
                    new_account_email(user.email, user.first_name)
                except Exception as e:
                    return Response({"error":f"Error sending email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            else:
                return Response({"error":"Failed to send confirmation email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            user_info = UserSerializer(user).data
            return Response({"user":user_info, "account": {
                "province": account.village.cell.sector.district.province.name if account.village else None,
                "district": account.village.cell.sector.district.name if account.village else None,
                "sector": account.village.cell.sector.name if account.village else None,
                "cell": account.village.cell.name if account.village else None,
                "village": account.village.name if account.village else None,
            }}, status=status.HTTP_201_CREATED)        
        
        except Exception as e:
            return Response({"error":f"There was an error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({"error":"Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)