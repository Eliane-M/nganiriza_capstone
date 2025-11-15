from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from models.models import (
    SpecialistProfile, 
    Appointment, 
    SpecialistReview,
    Account
)
from models.serializers import (
    SpecialistProfileSerializer,
    SpecialistProfileUpdateSerializer,
    SpecialistPublicSerializer,
    AppointmentSerializer,
    AppointmentCreateSerializer,
    SpecialistReviewSerializer
)
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes


@extend_schema(
    tags=["Specialists"],
    responses={200: SpecialistProfileSerializer}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specialist_profile(request):
    """Get the current specialist's profile"""
    try:
        account = Account.objects.get(user=request.user, role='specialist')
        specialist = SpecialistProfile.objects.get(account=account)
        serializer = SpecialistProfileSerializer(specialist)
        return Response(serializer.data)
    except (Account.DoesNotExist, SpecialistProfile.DoesNotExist):
        return Response(
            {"error": "Specialist profile not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )


@extend_schema(
    tags=["Specialists"],
    request=SpecialistProfileUpdateSerializer,
    responses={200: SpecialistProfileSerializer}
)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_specialist_profile(request):
    """Update specialist profile (onboarding and profile editing)"""
    try:
        account = Account.objects.get(user=request.user, role='specialist')
        specialist = SpecialistProfile.objects.get(account=account)
        
        partial = request.method == 'PATCH'
        serializer = SpecialistProfileUpdateSerializer(
            specialist, 
            data=request.data, 
            partial=partial
        )
        
        if serializer.is_valid():
            serializer.save(updated_by=request.user)
            return Response(
                SpecialistProfileSerializer(specialist).data,
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except (Account.DoesNotExist, SpecialistProfile.DoesNotExist):
        return Response(
            {"error": "Specialist profile not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )


@extend_schema(
    tags=["Specialists"],
    parameters=[
        OpenApiParameter('specialty', OpenApiTypes.STR, description='Filter by specialty'),
        OpenApiParameter('search', OpenApiTypes.STR, description='Search by name or clinic'),
        OpenApiParameter('page', OpenApiTypes.INT),
        OpenApiParameter('page_size', OpenApiTypes.INT),
    ],
    responses={200: SpecialistPublicSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def list_specialists(request):
    """List all verified specialists (public endpoint)"""
    queryset = SpecialistProfile.objects.filter(
        is_verified=True,
        profile_completed=True
    )
    
    # Filter by specialty
    specialty = request.GET.get('specialty')
    if specialty and specialty != 'all':
        queryset = queryset.filter(specialty=specialty)
    
    # Search
    search = request.GET.get('search')
    if search:
        queryset = queryset.filter(
            Q(account__user__first_name__icontains=search) |
            Q(account__user__last_name__icontains=search) |
            Q(clinic_name__icontains=search) |
            Q(specialty__icontains=search)
        )
    
    # Pagination
    page = max(int(request.GET.get('page', 1)), 1)
    page_size = min(max(int(request.GET.get('page_size', 20)), 1), 100)
    start, end = (page - 1) * page_size, page * page_size
    
    total = queryset.count()
    specialists = queryset.order_by('-average_rating', '-created_at')[start:end]
    
    serializer = SpecialistPublicSerializer(specialists, many=True)
    
    return Response({
        'count': total,
        'next': page + 1 if end < total else None,
        'previous': page - 1 if start > 0 else None,
        'results': serializer.data
    })


@extend_schema(
    tags=["Specialists"],
    responses={200: SpecialistPublicSerializer}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_specialist_detail(request, pk):
    """Get details of a specific specialist (public)"""
    try:
        specialist = SpecialistProfile.objects.get(
            id=pk,
            is_verified=True,
            profile_completed=True
        )
        serializer = SpecialistPublicSerializer(specialist)
        return Response(serializer.data)
    except SpecialistProfile.DoesNotExist:
        return Response(
            {"error": "Specialist not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )


# Appointments
@extend_schema(
    tags=["Appointments"],
    request=AppointmentCreateSerializer,
    responses={201: AppointmentSerializer}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_appointment(request):
    """Create a new appointment"""
    serializer = AppointmentCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        appointment = serializer.save(user=request.user, created_by=request.user)
        return Response(
            AppointmentSerializer(appointment).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["Appointments"],
    responses={200: AppointmentSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_user_appointments(request):
    """List appointments for the current user"""
    appointments = Appointment.objects.filter(user=request.user).order_by('-appointment_date')
    
    # Filter by status
    status_filter = request.GET.get('status')
    if status_filter:
        appointments = appointments.filter(status=status_filter)
    
    # Pagination
    page = max(int(request.GET.get('page', 1)), 1)
    page_size = min(max(int(request.GET.get('page_size', 20)), 1), 100)
    start, end = (page - 1) * page_size, page * page_size
    
    total = appointments.count()
    serializer = AppointmentSerializer(appointments[start:end], many=True)
    
    return Response({
        'count': total,
        'next': page + 1 if end < total else None,
        'previous': page - 1 if start > 0 else None,
        'results': serializer.data
    })


@extend_schema(
    tags=["Appointments"],
    responses={200: AppointmentSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_specialist_appointments(request):
    """List appointments for the current specialist"""
    try:
        account = Account.objects.get(user=request.user, role='specialist')
        specialist = SpecialistProfile.objects.get(account=account)
        
        appointments = Appointment.objects.filter(specialist=specialist).order_by('-appointment_date')
        
        # Filter by status
        status_filter = request.GET.get('status')
        if status_filter:
            appointments = appointments.filter(status=status_filter)
        
        # Pagination
        page = max(int(request.GET.get('page', 1)), 1)
        page_size = min(max(int(request.GET.get('page_size', 20)), 1), 100)
        start, end = (page - 1) * page_size, page * page_size
        
        total = appointments.count()
        serializer = AppointmentSerializer(appointments[start:end], many=True)
        
        return Response({
            'count': total,
            'next': page + 1 if end < total else None,
            'previous': page - 1 if start > 0 else None,
            'results': serializer.data
        })
        
    except (Account.DoesNotExist, SpecialistProfile.DoesNotExist):
        return Response(
            {"error": "Specialist profile not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )


@extend_schema(
    tags=["Appointments"],
    request={'status': str, 'cancellation_reason': str},
    responses={200: AppointmentSerializer}
)
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_appointment_status(request, pk):
    """Update appointment status (for both users and specialists)"""
    try:
        appointment = Appointment.objects.get(id=pk)
        
        # Check permissions
        is_owner = appointment.user == request.user
        is_specialist = hasattr(request.user, 'account') and \
                       request.user.account.role == 'specialist' and \
                       appointment.specialist.account.user == request.user
        
        if not (is_owner or is_specialist):
            return Response(
                {"error": "You don't have permission to update this appointment"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        new_status = request.data.get('status')
        if new_status:
            valid_statuses = ['pending', 'confirmed', 'cancelled', 'completed']
            if new_status not in valid_statuses:
                return Response(
                    {"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            appointment.status = new_status
        
        if new_status == 'cancelled':
            cancellation_reason = request.data.get('cancellation_reason', '')
            appointment.cancellation_reason = cancellation_reason
        
        appointment.updated_by = request.user
        appointment.save()
        
        return Response(AppointmentSerializer(appointment).data)
        
    except Appointment.DoesNotExist:
        return Response(
            {"error": "Appointment not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )


# Reviews
@extend_schema(
    tags=["Reviews"],
    request=SpecialistReviewSerializer,
    responses={201: SpecialistReviewSerializer}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request):
    """Create a review for a specialist"""
    serializer = SpecialistReviewSerializer(
        data=request.data,
        context={'request': request}
    )
    
    if serializer.is_valid():
        # Check if user has completed appointment with specialist
        specialist_id = request.data.get('specialist')
        has_appointment = Appointment.objects.filter(
            user=request.user,
            specialist_id=specialist_id,
            status='completed'
        ).exists()
        
        if not has_appointment:
            return Response(
                {"error": "You must have a completed appointment to leave a review"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["Reviews"],
    responses={200: SpecialistReviewSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def list_specialist_reviews(request, specialist_id):
    """List reviews for a specific specialist"""
    reviews = SpecialistReview.objects.filter(specialist_id=specialist_id).order_by('-created_at')
    
    # Pagination
    page = max(int(request.GET.get('page', 1)), 1)
    page_size = min(max(int(request.GET.get('page_size', 20)), 1), 100)
    start, end = (page - 1) * page_size, page * page_size
    
    total = reviews.count()
    serializer = SpecialistReviewSerializer(reviews[start:end], many=True)
    
    return Response({
        'count': total,
        'next': page + 1 if end < total else None,
        'previous': page - 1 if start > 0 else None,
        'results': serializer.data
    })


@extend_schema(
    tags=["Specialists"],
    responses={200: dict}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_stats(request):
    """Get dashboard statistics for specialist"""
    try:
        account = Account.objects.get(user=request.user, role='specialist')
        specialist = SpecialistProfile.objects.get(account=account)
        
        # Get appointment counts
        total_appointments = Appointment.objects.filter(specialist=specialist).count()
        pending_appointments = Appointment.objects.filter(
            specialist=specialist, 
            status='pending'
        ).count()
        confirmed_appointments = Appointment.objects.filter(
            specialist=specialist, 
            status='confirmed'
        ).count()
        completed_appointments = Appointment.objects.filter(
            specialist=specialist, 
            status='completed'
        ).count()
        
        return Response({
            'profile_completed': specialist.profile_completed,
            'is_verified': specialist.is_verified,
            'total_reviews': specialist.total_reviews,
            'average_rating': float(specialist.average_rating),
            'appointments': {
                'total': total_appointments,
                'pending': pending_appointments,
                'confirmed': confirmed_appointments,
                'completed': completed_appointments,
            }
        })
        
    except (Account.DoesNotExist, SpecialistProfile.DoesNotExist):
        return Response(
            {"error": "Specialist profile not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )