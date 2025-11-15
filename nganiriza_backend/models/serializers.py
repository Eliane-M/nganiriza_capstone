from rest_framework import serializers
from models.models import *


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

        read_only_fields = ["id", "slug", "created_at", "updated_at", "user", "account", "is_anonymized"]

    def validate_preferred_language(self, value):
        valid = dict(Profile.LANGUAGE_CHOICES)
        if value not in valid:
            raise serializers.ValidationError(f"Invalid language. Choose one of {list(valid.keys())}")
        return value


class LoginRequestSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class LoginUserInfoSerializer(serializers.Serializer):
    first_name = serializers.CharField(allow_blank=True, required=False)
    last_name = serializers.CharField(allow_blank=True, required=False)

class LoginResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    refresh = serializers.CharField()
    access = serializers.CharField()
    role = serializers.ChoiceField(choices=[("admin","admin"),("user","user")])
    user = LoginUserInfoSerializer()

class LogoutRequestSerializer(serializers.Serializer):
    refresh = serializers.CharField()

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)

class SignupRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    full_name = serializers.CharField()
    password = serializers.CharField(write_only=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    place_of_origin = serializers.CharField(required=False, allow_null=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)


class ConversationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversations
        fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user
        return Conversations.objects.create(user=user, **validated_data)

    def get_last_message(self, obj):
        m = obj.messages.order_by("-id").first()
        if not m:
            return None
        return {"id": m.id, "role": m.role, "content": m.content[:160], "created_at": m.created_at}

    def validate_language(self, val):
        valid = {c[0] for c in LANGUAGE_CHOICES}
        if val not in valid:
            raise serializers.ValidationError(f"language must be one of {sorted(valid)}")
        return val

class ConversationCreateSerializer(serializers.Serializer):
    title = serializers.CharField(required=False, allow_blank=True)
    language = serializers.ChoiceField(choices=[c[0] for c in LANGUAGE_CHOICES], default="eng")
    channel = serializers.ChoiceField(choices=["web", "sms", "ussd"], default="web")


class MessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messages
        fields = '__all__'

    def validate_role(self, value):
        if value not in dict(Messages.ROLE_CHOICES):
            raise serializers.ValidationError("Invalid role")
        return value

class MessageCreateSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=["user", "assistant", "system"], default="user")
    content = serializers.CharField()


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        indexes = [models.Index(fields=["locale","is_published","updated_at"])]
        ordering = ["-updated_at"]
        fields = '__all__'

class MessageFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageFeedback
        fields = '__all__'

class ServiceProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceProvider
        fields = '__all__'

class QuerySerializer(serializers.Serializer):
    query = serializers.CharField(required=True, max_length=2000)
    context = serializers.JSONField(required=False, default=dict)
    max_tokens = serializers.IntegerField(required=False, min_value=1, max_value=2048)
    temperature = serializers.FloatField(required=False, min_value=0.0, max_value=2.0)
    system_prompt = serializers.CharField(required=False, max_length=1000)
    use_cache = serializers.BooleanField(required=False, default=True)


class AIResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    response = serializers.CharField(allow_blank=True, required=False)
    error = serializers.CharField(allow_blank=True, required=False)
    usage = serializers.DictField(required=False)

class SpecialistProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    specialty_display = serializers.CharField(source='get_specialty_display', read_only=True)
    
    class Meta:
        model = SpecialistProfile
        fields = [
            'id', 'user', 'specialty', 'specialty_display', 'license_number',
            'years_of_experience', 'bio', 'education', 'certifications',
            'languages_spoken', 'availability', 'consultation_fee',
            'is_verified', 'profile_completed', 'profile_image',
            'average_rating', 'total_reviews', 'clinic_name', 'clinic_address',
            'location', 'created_at', 'updated_at'
        ]
        read_only_fields = ['is_verified', 'average_rating', 'total_reviews', 'profile_completed']
    
    def get_user(self, obj):
        return {
            'id': obj.account.user.id,
            'name': obj.account.user.get_full_name(),
            'email': obj.account.user.email,
        }
    
    def get_location(self, obj):
        account = obj.account
        if account.sector:
            return {
                'province': account.sector.district.province.name if account.sector.district.province else None,
                'district': account.sector.district.name if account.sector.district else None,
                'sector': account.sector.name,
            }
        return None


class SpecialistProfileUpdateSerializer(serializers.ModelSerializer):
    """For updating specialist profile during onboarding"""
    class Meta:
        model = SpecialistProfile
        fields = [
            'specialty', 'license_number', 'years_of_experience', 'bio',
            'education', 'certifications', 'languages_spoken', 'availability',
            'consultation_fee', 'profile_image', 'clinic_name', 'clinic_address'
        ]
    
    def validate_specialty(self, value):
        valid_specialties = [choice[0] for choice in SPECIALTY_CHOICES]
        if value not in valid_specialties:
            raise serializers.ValidationError(
                f"Invalid specialty. Must be one of: {', '.join(valid_specialties)}"
            )
        return value
    
    def validate_years_of_experience(self, value):
        if value < 0:
            raise serializers.ValidationError("Years of experience cannot be negative")
        if value > 70:
            raise serializers.ValidationError("Years of experience seems unrealistic")
        return value
    
    def validate_consultation_fee(self, value):
        if value < 0:
            raise serializers.ValidationError("Consultation fee cannot be negative")
        return value
    
    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        # Recalculate profile completeness
        instance.calculate_profile_completeness()
        instance.save()
        return instance


class SpecialistPublicSerializer(serializers.ModelSerializer):
    """Public-facing serializer for listing specialists (less detail)"""
    name = serializers.CharField(source='account.user.get_full_name', read_only=True)
    specialty_display = serializers.CharField(source='get_specialty_display', read_only=True)
    location = serializers.SerializerMethodField()
    
    class Meta:
        model = SpecialistProfile
        fields = [
            'id', 'name', 'specialty', 'specialty_display', 'years_of_experience',
            'bio', 'languages_spoken', 'availability', 'consultation_fee',
            'profile_image', 'average_rating', 'total_reviews', 'clinic_name',
            'location', 'is_verified'
        ]
    
    def get_location(self, obj):
        account = obj.account
        if account.sector:
            return {
                'province': account.sector.district.province.name if account.sector.district.province else None,
                'district': account.sector.district.name if account.sector.district else None,
                'sector': account.sector.name,
            }
        return None


class SpecialistAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecialistAvailability
        fields = ['id', 'day_of_week', 'start_time', 'end_time', 'is_available']


class AppointmentSerializer(serializers.ModelSerializer):
    specialist_info = serializers.SerializerMethodField()
    user_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'user', 'specialist', 'appointment_date', 'appointment_time',
            'duration_minutes', 'status', 'notes', 'cancellation_reason',
            'specialist_info', 'user_info', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']
    
    def get_specialist_info(self, obj):
        return {
            'name': obj.specialist.account.user.get_full_name(),
            'specialty': obj.specialist.get_specialty_display(),
            'image': obj.specialist.profile_image.url if obj.specialist.profile_image else None,
        }
    
    def get_user_info(self, obj):
        return {
            'name': obj.user.get_full_name(),
            'email': obj.user.email,
        }


class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'specialist', 'appointment_date', 'appointment_time',
            'duration_minutes', 'notes'
        ]
    
    def validate(self, data):
        # Check if specialist exists and is verified
        specialist = data.get('specialist')
        if not specialist.is_verified:
            raise serializers.ValidationError("This specialist is not yet verified")
        
        # Check for conflicting appointments
        existing = Appointment.objects.filter(
            specialist=specialist,
            appointment_date=data['appointment_date'],
            appointment_time=data['appointment_time'],
            status__in=['pending', 'confirmed']
        ).exists()
        
        if existing:
            raise serializers.ValidationError("This time slot is already booked")
        
        return data


class SpecialistReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = SpecialistReview
        fields = ['id', 'specialist', 'rating', 'comment', 'user_name', 'created_at']
        read_only_fields = ['user', 'created_at']
    
    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
    
    def create(self, validated_data):
        # Add user from request context
        validated_data['user'] = self.context['request'].user
        review = super().create(validated_data)
        
        # Update specialist's average rating
        specialist = review.specialist
        reviews = specialist.reviews.all()
        specialist.average_rating = sum(r.rating for r in reviews) / len(reviews)
        specialist.total_reviews = len(reviews)
        specialist.save()
        
        return review