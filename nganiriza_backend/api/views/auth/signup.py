from django.contrib.auth.models import User
from authentication.services.emails.emails import new_account_email
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from models.models import Account, AccountEmail, Sector
from models.serializers import UserSerializer, SignupRequestSerializer
from drf_spectacular.utils import extend_schema


@extend_schema(
    tags=["Auth"],
    request=SignupRequestSerializer,
    responses={
        201: {
            "description": "User created successfully",
            "content": {
                "application/json": {
                    "example": {
                        "user": {
                            "id": 1,
                            "email": "user@example.com",
                            "username": "user@example.com",
                            "first_name": "John",
                            "last_name": "Doe"
                        },
                        "account": {
                            "province": "Kigali City",
                            "district": "Gasabo",
                            "sector": "Remera",
                            "cell": None,
                            "village": None
                        }
                    }
                }
            }
        },
        400: {
            "description": "Bad request",
            "content": {
                "application/json": {
                    "example": {"error": "Email, password and names must not be empty"}
                }
            }
        },
        409: {
            "description": "Conflict - user already exists",
            "content": {
                "application/json": {
                    "example": {"error": "User with same credentials exist"}
                }
            }
        },
        500: {
            "description": "Internal server error",
            "content": {
                "application/json": {
                    "example": {"error": "There was an error: ..."}
                }
            }
        }
    },
    auth=[],  # No authentication required
)
@api_view(["POST"])
@permission_classes([AllowAny])
def new_user(request):
    email = request.data.get("email")
    full_name = request.data.get("full_name")
    password = request.data.get("password")
    date_of_birth = request.data.get("date_of_birth")
    place_of_origin = request.data.get("place_of_origin")
    phone_number = request.data.get("phone_number")
    
    # Validate required fields
    if not email or not full_name or not password:
        return Response(
            {"error": "Email, password and names must not be empty"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Parse full name
    first_name, last_name = "", ""
    if full_name:
        parts = full_name.strip().split()
        first_name = parts[0]
        if len(parts) > 1:
            last_name = " ".join(parts[1:])

    try:
        # Validate email format
        validate_email(email)
        
        # Check if user exists
        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "User with same credentials exist"}, 
                status=status.HTTP_409_CONFLICT
            )
        
        # Create user
        user = User.objects.create(
            email=email,
            username=email,
            first_name=first_name,
            last_name=last_name,
            password=make_password(password)
        )

        # Create account with location
        sector = None
        if place_of_origin:
            try:
                sector_id = int(place_of_origin) if isinstance(place_of_origin, str) else place_of_origin
                sector = Sector.objects.get(id=sector_id)
            except (ValueError, TypeError):
                return Response(
                    {"error": "Place of origin must be a valid sector ID number"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Sector.DoesNotExist:
                return Response(
                    {"error": "Invalid place of origin"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        account = Account.objects.create(
            user=user,
            sector=sector,
            phone_number=phone_number,
            date_of_birth=date_of_birth,
        )

        # Send welcome email (don't fail signup if email fails)
        try:
            AccountEmail.objects.create(email=user.email)
            new_account_email(user.email, user.first_name)
        except Exception as e:
            print(f"Warning: Could not send welcome email - {str(e)}")

        # Prepare response
        user_info = UserSerializer(user).data
        
        # Build account location info
        account_data = {
            "province": None,
            "district": None,
            "sector": None,
            "cell": None,
            "village": None,
        }
        
        if account.village:
            account_data = {
                "province": account.village.cell.sector.district.province.name,
                "district": account.village.cell.sector.district.name,
                "sector": account.village.cell.sector.name,
                "cell": account.village.cell.name,
                "village": account.village.name,
            }
        elif account.sector:
            account_data["sector"] = account.sector.name
            account_data["district"] = account.sector.district.name
            account_data["province"] = account.sector.district.province.name
        
        return Response({
            "user": user_info, 
            "account": account_data
        }, status=status.HTTP_201_CREATED)        
    
    except ValidationError:
        return Response(
            {"error": "Invalid email format"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"error": f"There was an error: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )