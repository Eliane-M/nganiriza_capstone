from models.models import Profile
from models.serializers import ProfileSerializer
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    # Create profile if it doesn't exist (for users created before signal was added)
    profile, created = Profile.objects.get_or_create(
        user=request.user,
        defaults={
            'created_by': request.user,
            'updated_by': request.user
        }
    )
    ser = ProfileSerializer(profile)
    return Response({"success": True, "profile": ser.data}, status=200)

@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])  # supports image upload
def update_profile(request):
    profile = Profile.objects.filter(user=request.user).first()
    if not profile:
        return Response({"success": False, "error": "Profile not found."}, status=404)

    partial = request.method == "PATCH"
    data = request.data.copy()
    # server-controlled fields
    data.pop("user", None)
    data.pop("account", None)
    data.pop("is_anonymized", None)
    data.pop("slug", None)

    ser = ProfileSerializer(profile, data=data, partial=partial)
    ser.is_valid(raise_exception=True)
    # set updated_by on save
    with transaction.atomic():
        obj = ser.save(updated_by=request.user)
    return Response({"success": True, "profile": ProfileSerializer(obj).data}, status=200)

@api_view(['PATCH'])
def patch_profile_language(request):
    """
    Partially update a user's profile - only the 'preferred_language' field.
    PATCH data: { "preferred_language": "<new_language_code>" }
    """

    user = getattr(request, 'user', None)
    if not user or not user.is_authenticated:
        from rest_framework.response import Response
        return Response({"success": False, "error": "Authentication credentials were not provided."}, status=401)

    preferred_language = request.data.get("preferred_language")
    if not preferred_language:
        from rest_framework.response import Response
        return Response({"success": False, "error": "'preferred_language' is required."}, status=400)

    try:
        profile = Profile.objects.get(user=user)
        # Validate preferred_language
        valid_choices = [c[0] for c in profile.language_choices]
        if preferred_language not in valid_choices:
            from rest_framework.response import Response
            return Response({
                "success": False,
                "error": f"Invalid preferred_language. Must be one of: {valid_choices}"
            }, status=400)

        profile.preferred_language = preferred_language
        profile.save()

        from rest_framework.response import Response
        return Response(
            {"success": True, "preferred_language": profile.preferred_language},
            status=200,
        )
    except Profile.DoesNotExist:
        from rest_framework.response import Response
        return Response({"success": False, "error": "Profile not found."}, status=404)
    except Exception as e:
        from rest_framework.response import Response
        return Response({"success": False, "error": str(e)}, status=400)

@api_view(['DELETE'])
def delete_profile(request):
    """
    Soft-delete/anonymize the profile.
    """
    profile = Profile.objects.filter(user=request.user).first()
    if not profile:
        return Response({"success": False, "error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

    with transaction.atomic():
        # remove PII-like fields, delete picture file if exists
        if profile.profile_picture:
            profile.profile_picture.delete(save=False)
        profile.is_anonymized = True
        profile.gender = None
        profile.preferred_language = profile.preferred_language or "rw"
        profile.consent_data_processing = False
        profile.account = None
        profile.save(update_fields=[
            "is_anonymized", "gender", "preferred_language", "consent_data_processing", "account", "updated_at"
        ])

    return Response(status=status.HTTP_204_NO_CONTENT)