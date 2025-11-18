from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from models.models import SpecialistProfile
from models.serializers import SpecialistProfileSerializer


@extend_schema(
    tags=["Admin"],
    responses={200: SpecialistProfileSerializer(many=True)}
)
@api_view(["GET"])
@permission_classes([IsAdminUser])
def list_pending_specialists(request):
    """List specialists pending approval (is_verified=False)"""
    pending = SpecialistProfile.objects.filter(
        is_verified=False
    ).select_related('specialist_account__user').order_by('-created_at')
    
    serializer = SpecialistProfileSerializer(pending, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema(
    tags=["Admin"],
    responses={200: SpecialistProfileSerializer, 404: dict}
)
@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_specialist_for_approval(request, pk):
    """Get a specific specialist for approval review"""
    try:
        specialist = SpecialistProfile.objects.select_related(
            'specialist_account__user'
        ).get(pk=pk)
        serializer = SpecialistProfileSerializer(specialist)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except SpecialistProfile.DoesNotExist:
        return Response(
            {"error": "Specialist not found"},
            status=status.HTTP_404_NOT_FOUND
        )


@extend_schema(
    tags=["Admin"],
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'is_verified': {'type': 'boolean'},
                'rejection_reason': {'type': 'string'}
            }
        }
    },
    responses={200: SpecialistProfileSerializer, 400: dict, 404: dict}
)
@api_view(["PUT"])
@permission_classes([IsAdminUser])
def approve_specialist(request, pk):
    """Approve or reject a specialist"""
    try:
        specialist = SpecialistProfile.objects.select_related(
            'specialist_account__user'
        ).get(pk=pk)
        
        is_verified = request.data.get('is_verified')
        
        if is_verified is None:
            return Response(
                {"error": "is_verified field is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        specialist.is_verified = bool(is_verified)
        specialist.save(update_fields=['is_verified'])
        
        # Reload to get fresh data
        specialist.refresh_from_db()
        serializer = SpecialistProfileSerializer(specialist)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except SpecialistProfile.DoesNotExist:
        return Response(
            {"error": "Specialist not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

