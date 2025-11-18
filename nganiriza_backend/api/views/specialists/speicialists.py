from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from models.models import (
    SpecialistProfile, 
    Appointment, 
    SpecialistReview,
    SpecialistMessage,
    Account
)
from models.serializers import (
    SpecialistProfileSerializer,
    SpecialistProfileUpdateSerializer,
    SpecialistPublicSerializer,
    AppointmentSerializer,
    AppointmentCreateSerializer,
    SpecialistReviewSerializer,
    SpecialistMessageSerializer,
    SpecialistMessageCreateSerializer,
    ContactedSpecialistSerializer
)
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes


@extend_schema(
    tags=["Specialists"],
    responses={200: SpecialistProfileSerializer, 404: dict}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specialist_profile(request):
    """Get the current specialist's profile"""
    try:
        # Get account first
        account = Account.objects.get(user=request.user, role='specialist')
        
        # Get or create specialist profile
        specialist, created = SpecialistProfile.objects.get_or_create(
            specialist_account=account,
            defaults={
                'specialty': 'general',
                'profile_completed': False,
                'created_by': request.user,
                'updated_by': request.user
            }
        )
        
        serializer = SpecialistProfileSerializer(specialist)
        return Response(serializer.data)
        
    except Account.DoesNotExist:
        return Response(
            {"error": "Specialist account not found. Please ensure your account has specialist role."}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": f"Failed to retrieve profile: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@extend_schema(
    tags=["Specialists"],
    request=SpecialistProfileUpdateSerializer,
    responses={200: SpecialistProfileSerializer, 400: dict, 404: dict}
)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_specialist_profile(request):
    """Update specialist profile (onboarding and profile editing)"""
    try:
        # Get account first
        account = Account.objects.get(user=request.user, role='specialist')
        
        # Get or create specialist profile
        specialist, created = SpecialistProfile.objects.get_or_create(
            specialist_account=account,
            defaults={
                'specialty': 'general',
                'profile_completed': False,
                'created_by': request.user,
                'updated_by': request.user
            }
        )
        
        partial = request.method == 'PATCH'
        serializer = SpecialistProfileUpdateSerializer(
            specialist, 
            data=request.data, 
            partial=partial
        )
        
        if serializer.is_valid():
            # Mark profile as completed if all required fields are filled
            updated_specialist = serializer.save(updated_by=request.user)
            
            # Check if profile is complete
            required_fields = ['specialty', 'license_number', 'years_of_experience']
            is_complete = all(getattr(updated_specialist, field) for field in required_fields)
            
            if is_complete and not updated_specialist.profile_completed:
                updated_specialist.profile_completed = True
                updated_specialist.save()
            
            return Response(
                SpecialistProfileSerializer(updated_specialist).data,
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Account.DoesNotExist:
        return Response(
            {"error": "Specialist account not found. Please ensure your account has specialist role."}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": f"Failed to update profile: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
        profile_completed=True
    ).select_related('specialist_account__user')  # Optimize query
    
    verified_only = request.GET.get('verified_only')
    if verified_only and verified_only.lower() in ['1', 'true', 'yes']:
        queryset = queryset.filter(is_verified=True)
    
    # Filter by specialty
    specialty = request.GET.get('specialty')
    if specialty and specialty != 'all':
        queryset = queryset.filter(specialty=specialty)
    
    # Search
    search = request.GET.get('search')
    if search:
        queryset = queryset.filter(
            Q(specialist_account__user__first_name__icontains=search) |
            Q(specialist_account__user__last_name__icontains=search) |
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
    responses={200: SpecialistPublicSerializer, 404: dict}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_specialist_detail(request, pk):
    """Get details of a specific specialist (public)"""
    try:
        specialist = SpecialistProfile.objects.select_related('specialist_account__user').get(
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
    responses={201: AppointmentSerializer, 400: dict}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_appointment(request):
    """Create a new appointment"""
    serializer = AppointmentCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        appointment = serializer.save(user=request.user, created_by=request.user)
        # Ensure name field is set for BaseModel
        if hasattr(appointment, 'name') and (not appointment.name or appointment.name.strip() == ''):
            appointment.name = f"Appointment - {appointment.user.username} - {appointment.appointment_date}"
            appointment.save()
        return Response(
            AppointmentSerializer(appointment).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["Appointments"],
    parameters=[
        OpenApiParameter('status', OpenApiTypes.STR, description='Filter by status'),
        OpenApiParameter('page', OpenApiTypes.INT),
        OpenApiParameter('page_size', OpenApiTypes.INT),
    ],
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
    parameters=[
        OpenApiParameter('status', OpenApiTypes.STR, description='Filter by status'),
        OpenApiParameter('page', OpenApiTypes.INT),
        OpenApiParameter('page_size', OpenApiTypes.INT),
    ],
    responses={200: AppointmentSerializer(many=True), 404: dict}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_specialist_appointments(request):
    """List appointments for the current specialist"""
    try:
        account = Account.objects.get(user=request.user, role='specialist')
        specialist = SpecialistProfile.objects.get(specialist_account=account)
        
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
        
    except Account.DoesNotExist:
        return Response(
            {"error": "Specialist account not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except SpecialistProfile.DoesNotExist:
        return Response(
            {"error": "Specialist profile not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )


@extend_schema(
    tags=["Appointments"],
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'status': {'type': 'string'},
                'cancellation_reason': {'type': 'string'}
            },
            'required': ['status']
        }
    },
    responses={200: AppointmentSerializer, 400: dict, 403: dict, 404: dict}
)
@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def update_appointment_status(request, pk):
    """Update appointment status (for both users and specialists)"""
    try:
        appointment = Appointment.objects.get(id=pk)
        
        # Check permissions
        is_owner = appointment.user == request.user
        is_specialist = False
        try:
            account = Account.objects.get(user=request.user, role='specialist')
            specialist = SpecialistProfile.objects.get(specialist_account=account)
            is_specialist = appointment.specialist == specialist
        except (Account.DoesNotExist, SpecialistProfile.DoesNotExist):
            pass
        
        if not (is_owner or is_specialist):
            return Response(
                {"error": "You don't have permission to update this appointment"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        new_status = request.data.get('status')
        if not new_status:
            return Response(
                {"error": "Status is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
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
        
        # Update updated_by if the field exists (BaseModel field)
        if hasattr(appointment, 'updated_by'):
            appointment.updated_by = request.user
        
        # Ensure name field exists for BaseModel (required field)
        if hasattr(appointment, 'name'):
            if not appointment.name or appointment.name.strip() == '':
                appointment.name = f"Appointment {appointment.id} - {appointment.user.username}"
        
        appointment.save()
        
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Appointment.DoesNotExist:
        return Response(
            {"error": "Appointment not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error updating appointment status: {str(e)}")
        return Response(
            {"error": f"An error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@extend_schema(
    tags=["Appointments"],
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'appointment_date': {'type': 'string', 'format': 'date'},
                'appointment_time': {'type': 'string', 'format': 'time'},
                'notes': {'type': 'string'}
            },
            'required': ['appointment_date', 'appointment_time']
        }
    },
    responses={200: AppointmentSerializer, 400: dict, 403: dict, 404: dict}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reschedule_appointment(request, pk):
    """Reschedule an appointment (specialist only) and notify patient"""
    try:
        appointment = Appointment.objects.get(id=pk)
        
        # Check if user is the specialist
        try:
            account = Account.objects.get(user=request.user, role='specialist')
            specialist = SpecialistProfile.objects.get(specialist_account=account)
            is_specialist = appointment.specialist == specialist
        except (Account.DoesNotExist, SpecialistProfile.DoesNotExist):
            is_specialist = False
        
        if not is_specialist:
            return Response(
                {"error": "Only the specialist can reschedule this appointment"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        new_date = request.data.get('appointment_date')
        new_time = request.data.get('appointment_time')
        notes = request.data.get('notes', '')
        
        if not new_date or not new_time:
            return Response(
                {"error": "appointment_date and appointment_time are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update appointment
        appointment.appointment_date = new_date
        appointment.appointment_time = new_time
        if notes:
            appointment.notes = f"{appointment.notes}\n[Rescheduled] {notes}".strip() if appointment.notes else f"[Rescheduled] {notes}"
        appointment.status = 'confirmed'  # Rescheduled appointments are confirmed
        appointment.updated_by = request.user
        appointment.save()
        
        # Send notification email to patient
        try:
            from django.core.mail import send_mail
            from django.conf import settings
            patient_email = appointment.user.email
            if patient_email:
                subject = f"Appointment Rescheduled - {appointment.specialist}"
                message = f"""
Hello {appointment.user.get_full_name() or appointment.user.username},

Your appointment with {appointment.specialist} has been rescheduled.

New Date: {appointment.appointment_date}
New Time: {appointment.appointment_time}
{f'Notes: {notes}' if notes else ''}

Please confirm your availability for this new time.

Thank you,
Nganiriza Team
"""
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[patient_email],
                    fail_silently=True
                )
        except Exception as e:
            # Log error but don't fail the request
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send reschedule notification email: {str(e)}")
        
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
    responses={201: SpecialistReviewSerializer, 400: dict}
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
    parameters=[
        OpenApiParameter('page', OpenApiTypes.INT),
        OpenApiParameter('page_size', OpenApiTypes.INT),
    ],
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
    tags=["Messages"],
    request=SpecialistMessageCreateSerializer,
    responses={201: SpecialistMessageSerializer, 400: dict}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_specialist_message(request):
    """Create a message to a specialist (from user) or reply to a user (from specialist)"""
    # Check if user is a specialist replying to a patient
    is_specialist_reply = False
    try:
        account = Account.objects.get(user=request.user, role='specialist')
        specialist = SpecialistProfile.objects.get(specialist_account=account)
        is_specialist_reply = True
    except (Account.DoesNotExist, SpecialistProfile.DoesNotExist):
        pass
    
    if is_specialist_reply:
        # Specialist replying to a patient
        user_id = request.data.get('user')
        subject = request.data.get('subject', 'Re: Follow-up')
        message_text = request.data.get('message')
        
        if not user_id or not message_text:
            return Response(
                {"error": "user and message are required for specialist replies"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from django.contrib.auth.models import User
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Create message with specialist as sender and user as recipient
        message = SpecialistMessage.objects.create(
            user=user,  # Patient receiving the message
            specialist=specialist,  # Specialist sending the message
            subject=subject,
            message=message_text,
            is_read=False,
            status='open'
        )
        
        return Response(
            SpecialistMessageSerializer(message).data,
            status=status.HTTP_201_CREATED
        )
    else:
        # Regular user sending message to specialist
        serializer = SpecialistMessageCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            message = serializer.save()
            return Response(
                SpecialistMessageSerializer(message).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["Messages"],
    responses={200: SpecialistMessageSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_user_messages(request):
    """List messages sent by the current user"""
    messages = SpecialistMessage.objects.filter(user=request.user).order_by('-created_at')
    
    # Pagination
    page = max(int(request.GET.get('page', 1)), 1)
    page_size = min(max(int(request.GET.get('page_size', 20)), 1), 100)
    start, end = (page - 1) * page_size, page * page_size
    
    total = messages.count()
    serializer = SpecialistMessageSerializer(messages[start:end], many=True)
    
    return Response({
        'count': total,
        'next': page + 1 if end < total else None,
        'previous': page - 1 if start > 0 else None,
        'results': serializer.data
    })


@extend_schema(
    tags=["Messages"],
    responses={200: SpecialistMessageSerializer(many=True), 404: dict}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_specialist_messages(request):
    """List messages received by the current specialist"""
    try:
        account = Account.objects.get(user=request.user, role='specialist')
        specialist = SpecialistProfile.objects.get(specialist_account=account)
    except Account.DoesNotExist:
        return Response(
            {"error": "Specialist account not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except SpecialistProfile.DoesNotExist:
        return Response(
            {"error": "Specialist profile not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    messages = SpecialistMessage.objects.filter(specialist=specialist).order_by('is_read', '-created_at')
    
    status_filter = request.GET.get('status')
    if status_filter:
        messages = messages.filter(status=status_filter)
    
    read_filter = request.GET.get('is_read')
    if read_filter in ['true', 'false', '1', '0']:
        is_read = read_filter in ['true', '1']
        messages = messages.filter(is_read=is_read)
    
    # Pagination
    page = max(int(request.GET.get('page', 1)), 1)
    page_size = min(max(int(request.GET.get('page_size', 20)), 1), 100)
    start, end = (page - 1) * page_size, page * page_size
    
    total = messages.count()
    serializer = SpecialistMessageSerializer(messages[start:end], many=True)
    
    return Response({
        'count': total,
        'next': page + 1 if end < total else None,
        'previous': page - 1 if start > 0 else None,
        'results': serializer.data
    })


@extend_schema(
    tags=["Specialists"],
    responses={200: dict, 404: dict}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_stats(request):
    """Get dashboard statistics for specialist"""
    try:
        account = Account.objects.get(user=request.user, role='specialist')
        specialist = SpecialistProfile.objects.get(specialist_account=account)
        
        # Get appointment counts
        from django.utils import timezone
        from datetime import timedelta
        
        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday())
        
        total_appointments = Appointment.objects.filter(specialist=specialist).count()
        today_appointments = Appointment.objects.filter(
            specialist=specialist,
            appointment_date=today
        ).count()
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
        week_appointments = Appointment.objects.filter(
            specialist=specialist,
            appointment_date__gte=week_start
        ).count()
        
        return Response({
            'profile_completed': specialist.profile_completed,
            'is_verified': specialist.is_verified,
            'total_reviews': specialist.total_reviews,
            'average_rating': float(specialist.average_rating),
            'today_appointments': today_appointments,
            'week_appointments': week_appointments,
            'unread_messages': 0,  # Implement when messages are ready
            'active_patients': Appointment.objects.filter(
                specialist=specialist
            ).values('user').distinct().count(),
            'appointments': {
                'total': total_appointments,
                'pending': pending_appointments,
                'confirmed': confirmed_appointments,
                'completed': completed_appointments,
            }
        })
        
    except Account.DoesNotExist:
        return Response(
            {"error": "Specialist account not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except SpecialistProfile.DoesNotExist:
        return Response(
            {"error": "Specialist profile not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )


@extend_schema(
    tags=["Specialists"],
    responses={200: dict},
    summary="List contacted specialists grouped by active/past"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_contacted_specialists(request):
    """List specialists the user has contacted, grouped by active/past"""
    user = request.user
    
    # Get all specialists the user has messaged or made appointments with
    messaged_specialists = SpecialistProfile.objects.filter(
        messages__user=user
    ).distinct()
    
    appointment_specialists = SpecialistProfile.objects.filter(
        appointments__user=user
    ).distinct()
    
    all_specialists = (messaged_specialists | appointment_specialists).distinct()
    
    active_specialists = []
    past_specialists = []
    
    for specialist in all_specialists:
        # Get last message
        last_message = SpecialistMessage.objects.filter(
            user=user,
            specialist=specialist
        ).order_by('-created_at').first()
        
        # Get last appointment
        last_appointment = Appointment.objects.filter(
            user=user,
            specialist=specialist
        ).order_by('-appointment_date', '-appointment_time').first()
        
        # Determine last contact
        last_contact_date = None
        last_contact_type = None
        
        if last_message and last_appointment:
            if last_message.created_at > last_appointment.created_at:
                last_contact_date = last_message.created_at
                last_contact_type = 'message'
            else:
                last_contact_date = last_appointment.created_at
                last_contact_type = 'appointment'
        elif last_message:
            last_contact_date = last_message.created_at
            last_contact_type = 'message'
        elif last_appointment:
            last_contact_date = last_appointment.created_at
            last_contact_type = 'appointment'
        
        if not last_contact_date:
            continue
        
        # Check for active conversation (open messages)
        has_active_conversation = SpecialistMessage.objects.filter(
            user=user,
            specialist=specialist,
            status='open'
        ).exists()
        
        # Check for pending appointments
        has_pending_appointment = Appointment.objects.filter(
            user=user,
            specialist=specialist,
            status__in=['pending', 'confirmed']
        ).exists()
        
        # Unread count
        unread_count = SpecialistMessage.objects.filter(
            user=user,
            specialist=specialist,
            is_read=False
        ).count()
        
        specialist_user = specialist.specialist_account.user
        profile_image = None
        if specialist.profile_image:
            profile_image = request.build_absolute_uri(specialist.profile_image.url)
        
        specialist_data = {
            'specialist_id': specialist.id,
            'specialist_name': specialist_user.get_full_name() or specialist_user.username,
            'specialty': specialist.specialty,
            'specialty_display': specialist.get_specialty_display(),
            'profile_image': profile_image,
            'last_contact_date': last_contact_date,
            'last_contact_type': last_contact_type,
            'unread_count': unread_count,
            'has_active_conversation': has_active_conversation,
            'has_pending_appointment': has_pending_appointment
        }
        
        # Group by active/past
        if has_active_conversation or has_pending_appointment:
            active_specialists.append(specialist_data)
        else:
            past_specialists.append(specialist_data)
    
    # Sort by last contact date
    active_specialists.sort(key=lambda x: x['last_contact_date'], reverse=True)
    past_specialists.sort(key=lambda x: x['last_contact_date'], reverse=True)
    
    return Response({
        'active': active_specialists,
        'past': past_specialists
    })


@extend_schema(
    tags=["Specialists"],
    responses={200: SpecialistMessageSerializer(many=True)},
    summary="Get messages between user and specific specialist"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specialist_messages(request, pk):
    """Get all messages between current user and specific specialist"""
    try:
        specialist = SpecialistProfile.objects.get(pk=pk)
    except SpecialistProfile.DoesNotExist:
        return Response(
            {"error": "Specialist not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    messages = SpecialistMessage.objects.filter(
        user=request.user,
        specialist=specialist
    ).order_by('created_at')
    
    serializer = SpecialistMessageSerializer(messages, many=True)
    return Response(serializer.data)


@extend_schema(
    tags=["Specialists"],
    responses={200: dict},
    summary="List patients for specialist dashboard, ordered by last action"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_specialist_patients(request):
    """List all patients who have interacted with the specialist, ordered by last action"""
    try:
        account = Account.objects.get(user=request.user, role='specialist')
        specialist = SpecialistProfile.objects.get(specialist_account=account)
    except Account.DoesNotExist:
        return Response(
            {"error": "Specialist account not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except SpecialistProfile.DoesNotExist:
        return Response(
            {"error": "Specialist profile not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Get all unique users who have appointments or messages with this specialist
    from django.contrib.auth.models import User
    from django.db.models import Max, Q
    
    # Get users from appointments
    appointment_users = Appointment.objects.filter(specialist=specialist).values_list('user', flat=True).distinct()
    
    # Get users from messages (messages sent to specialist)
    message_users = SpecialistMessage.objects.filter(
        specialist=specialist
    ).values_list('user', flat=True).distinct()
    
    # Combine and get unique users
    all_user_ids = set(list(appointment_users) + list(message_users))
    users = User.objects.filter(id__in=all_user_ids)
    
    # Build patient list with last action info
    patients = []
    for user in users:
        # Get last appointment
        last_appointment = Appointment.objects.filter(
            specialist=specialist,
            user=user
        ).order_by('-appointment_date', '-appointment_time').first()
        
        # Get last message (from patient to specialist)
        last_message_from_patient = SpecialistMessage.objects.filter(
            specialist=specialist,
            user=user
        ).order_by('-created_at').first()
        
        # Get last message (from specialist to patient - these are replies)
        last_message_to_patient = SpecialistMessage.objects.filter(
            specialist=specialist,
            user=user
        ).order_by('-created_at').first()
        
        # Determine last action
        last_action_date = None
        last_action_type = None
        
        if last_appointment:
            apt_datetime = f"{last_appointment.appointment_date} {last_appointment.appointment_time}"
            if not last_action_date or apt_datetime > last_action_date:
                last_action_date = apt_datetime
                last_action_type = 'appointment'
        
        if last_message_from_patient:
            msg_date = last_message_from_patient.created_at.isoformat()
            if not last_action_date or msg_date > last_action_date:
                last_action_date = msg_date
                last_action_type = 'message'
        
        if last_message_to_patient:
            msg_date = last_message_to_patient.created_at.isoformat()
            if not last_action_date or msg_date > last_action_date:
                last_action_date = msg_date
                last_action_type = 'message'
        
        # Count unread messages and pending appointments
        unread_count = SpecialistMessage.objects.filter(
            specialist=specialist,
            user=user,
            is_read=False
        ).count()
        
        pending_appointments = Appointment.objects.filter(
            specialist=specialist,
            user=user,
            status='pending'
        ).count()
        
        patients.append({
            'user_id': user.id,
            'user_name': user.get_full_name() or user.username,
            'user_email': user.email,
            'last_action_date': last_action_date,
            'last_action_type': last_action_type,
            'unread_messages': unread_count,
            'pending_appointments': pending_appointments,
            'has_active_conversation': unread_count > 0 or pending_appointments > 0
        })
    
    # Sort by last_action_date (most recent first)
    patients.sort(key=lambda x: x['last_action_date'] or '', reverse=True)
    
    return Response({
        'count': len(patients),
        'results': patients
    })


@extend_schema(
    tags=["Specialists"],
    responses={200: AppointmentSerializer(many=True)},
    summary="Get appointments between user and specific specialist"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specialist_appointments(request, pk):
    """Get all appointments between current user and specific specialist"""
    try:
        specialist = SpecialistProfile.objects.get(pk=pk)
    except SpecialistProfile.DoesNotExist:
        return Response(
            {"error": "Specialist not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    appointments = Appointment.objects.filter(
        user=request.user,
        specialist=specialist
    ).order_by('-appointment_date', '-appointment_time')
    
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)
