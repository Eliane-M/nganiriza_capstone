from email.policy import default
from random import choice
from django.db import models
from django.contrib.auth.models import User
from base.models import BaseModel
from django.utils import timezone
from django.utils.text import slugify
from django.conf import settings
import uuid


LANGUAGE_CHOICES = [
    ('eng', 'English'),
    ('kny', 'Kinyarwanda'),
    ('fr', 'Français')
]

USER_ROLES = [
    ('user', 'User'),
    ('specialist', 'Specialist'),
    ('admin', 'Admin')
]

SPECIALTY_CHOICES = [
    ('gynecology', 'Gynecology'),
    ('adolescent', 'Adolescent Medicine'),
    ('reproductive', 'Reproductive Health'),
    ('mental', 'Mental Health'),
    ('nutrition', 'Nutrition'),
    ('general', 'General Practice')
]


class Province(models.Model):
    name = models.CharField(max_length=100)

class District(models.Model):
    name = models.CharField(max_length=100)
    province = models.ForeignKey(Province, on_delete=models.CASCADE, related_name="districts")

class Sector(models.Model):
    name = models.CharField(max_length=100)
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name="sectors")

class Cell(models.Model):
    name = models.CharField(max_length=100)
    sector = models.ForeignKey(Sector, on_delete=models.CASCADE, related_name="cells")

class Village(models.Model):
    name = models.CharField(max_length=100)
    cell = models.ForeignKey(Cell, on_delete=models.CASCADE, related_name="villages")

# For General Users

class Account(BaseModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    role = models.CharField(choices=USER_ROLES, max_length=25, default='user')
    province = models.ForeignKey(Province, on_delete=models.SET_NULL, null=True, blank=True)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True)
    sector = models.ForeignKey(Sector, on_delete=models.SET_NULL, null=True, blank=True)
    cell = models.ForeignKey(Cell, on_delete=models.SET_NULL, null=True, blank=True)
    village = models.ForeignKey(Village, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.user.username} - {self.name}"

    

class AccountEmail(models.Model):
    email = models.EmailField(max_length=255)
    # user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return str(self.email)


class ResetPassword(models.Model):
    email = models.EmailField(max_length=255)
    code = models.CharField(max_length=6)
    expires = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return str(self.email)
    
class ResetPasswordConfirmation(models.Model):
    email = models.EmailField(max_length=255)
    user = models.ForeignKey(User, blank=True, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return str(self.email)
    
class Profile(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    ]
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
        db_index=True,
    )
    account = models.ForeignKey(Account, on_delete=models.CASCADE, null=True, blank=True)
    preferred_language = models.CharField(max_length=25, choices=LANGUAGE_CHOICES, default='eng')
    gender = models.CharField(max_length=25, choices=GENDER_CHOICES, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    consent_data_processing = models.BooleanField(default=False)

    is_anonymized = models.BooleanField(default=False)
    slug = models.SlugField(unique=True, blank=True, max_length=50)
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="created_by_who"
    )
    updated_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="updated_by_who"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(getattr(self.user, "username", str(self.user)))
            unique = base or "profile"
            i = 1
            while Profile.objects.filter(slug=unique).exists():
                i += 1
                unique = f"{base}-{i}"
            self.slug = unique
        super().save(*args, **kwargs)

    def __str__(self):
        return getattr(self.user, "username", str(self.user))

# For Specialists

class SpecialistProfile(BaseModel):
    specialist_account = models.OneToOneField(
        Account,
        on_delete=models.CASCADE,
        related_name='specialist_profile'
    )
    specialty = models.CharField(max_length=50, choices=SPECIALTY_CHOICES)
    license_number = models.CharField(max_length=100, unique=True, blank=True, null=True)
    years_of_experience = models.IntegerField(default=0)
    bio = models.TextField(blank=True)
    education = models.TextField(blank=True, help_text="Educational background")
    certifications = models.JSONField(default=list, blank=True, help_text="List of certifications")
    languages_spoken = models.JSONField(default=list, blank=True, help_text="Languages the specialist speaks")
    
    # Availability
    availability = models.CharField(max_length=255, blank=True, help_text="e.g., Mon-Fri 9AM-5PM")
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Profile completeness
    is_verified = models.BooleanField(default=False, help_text="Admin verification status")
    profile_completed = models.BooleanField(default=False)
    profile_image = models.ImageField(upload_to='specialist_profiles/', blank=True, null=True)
    
    # Ratings
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_reviews = models.IntegerField(default=0)
    
    # Practice location
    clinic_name = models.CharField(max_length=255, blank=True)
    clinic_address = models.TextField(blank=True)
    
    def __str__(self):
        user = self.specialist_account.user
        return f"{user.get_full_name()} - {self.get_specialty_display()}"
    
    def calculate_profile_completeness(self):
        """Calculate if profile is complete"""
        required_fields = [
            self.specialty,
            self.education,
            self.years_of_experience > 0,
            self.consultation_fee > 0,
            self.availability,
            len(self.languages_spoken) > 0,
        ]
        self.profile_completed = all(required_fields)
        return self.profile_completed

class SpecialistAvailability(models.Model):
    """Detailed availability schedule for specialists"""
    specialist = models.ForeignKey(SpecialistProfile, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.CharField(max_length=10, choices=[
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ])
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['specialist', 'day_of_week']
        ordering = ['day_of_week', 'start_time']


class Appointment(BaseModel):
    """Appointment booking system"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='appointments')
    specialist = models.ForeignKey(SpecialistProfile, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    duration_minutes = models.IntegerField(default=30)
    
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ], default='pending')
    
    notes = models.TextField(blank=True)
    cancellation_reason = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-appointment_date', '-appointment_time']
    
    def __str__(self):
        return f"{self.user.username} with {self.specialist} on {self.appointment_date}"


class AppointmentHistory(models.Model):
    """Track appointment changes (reschedules, status changes, etc.)"""
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='history')
    action_type = models.CharField(max_length=50, choices=[
        ('created', 'Created'),
        ('rescheduled', 'Rescheduled'),
        ('status_changed', 'Status Changed'),
        ('cancelled', 'Cancelled'),
        ('notes_updated', 'Notes Updated'),
    ])
    previous_date = models.DateField(null=True, blank=True)
    previous_time = models.TimeField(null=True, blank=True)
    previous_status = models.CharField(max_length=20, null=True, blank=True)
    new_date = models.DateField(null=True, blank=True)
    new_time = models.TimeField(null=True, blank=True)
    new_status = models.CharField(max_length=20, null=True, blank=True)
    notes = models.TextField(blank=True, help_text="Additional notes about this change")
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='appointment_changes')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Appointment Histories'
    
    def __str__(self):
        return f"{self.appointment} - {self.action_type} on {self.created_at}"


class SpecialistReview(models.Model):
    """Reviews for specialists"""
    specialist = models.ForeignKey(SpecialistProfile, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 stars
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['specialist', 'user']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.rating} stars"


class SpecialistMessage(BaseModel):
    """Messaging between users and specialists"""
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='specialist_messages'
    )
    specialist = models.ForeignKey(
        SpecialistProfile,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    subject = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')

    class Meta:
        ordering = ['is_read', '-created_at']

    def __str__(self):
        return f"{self.user.get_full_name()} -> {self.specialist} ({self.subject})"


class Conversations(BaseModel):
    CHANNEL_CHOICES = [
        ('web', 'web'),
        ('sms', 'sms'),
        ('ussd', 'ussd')
    ]
    id_number = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES, default='web')
    language = models.CharField(max_length=20, default='eng')
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)


    def __str__(self) -> str:
        return f"{self.user} - {self.channel}"

class Messages(BaseModel):
    ROLE_CHOICES = [
        ('user', 'user'),
        ('assistant', 'assistant'),
        ('system', 'system')
    ]

    id_number = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(Conversations, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    content = models.TextField()
    detected_intent = models.CharField(max_length=100, blank=True, null=True)
    safety_flags = models.JSONField(default=dict, blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self) -> str:
        return self.role + " - " + self.content


class Article(BaseModel):
    id_number = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    locale = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, default="eng")
    title = models.CharField(max_length=255)
    body_md = models.TextField()
    tags = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.title

class MessageFeedback(models.Model):
    message = models.OneToOneField(Messages, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(-1,"down"),(0,"neutral"),(1,"up")], default=0)
    comment = models.TextField(blank=True)

    def __str__(self) -> str:
        return self.rating


class ServiceProvider(BaseModel):
    type = models.CharField(max_length=50)  # clinic, hotline, counselor, NGO
    phone = models.CharField(max_length=32, blank=True)
    province = models.ForeignKey(Province, on_delete=models.SET_NULL, null=True, blank=True)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True)
    sector = models.ForeignKey(Sector, on_delete=models.SET_NULL, null=True, blank=True)
    open_hours = models.CharField(max_length=128, blank=True)
    verified = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.name + " - " + self.type


class QueryCache(models.Model):
    query_hash = models.CharField(max_length=64, unique=True, db_index=True)
    query_text = models.TextField()
    response = models.TextField()
    context = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    accessed_count = models.IntegerField(default=0)
    last_accessed = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-last_accessed']
        indexes = [
            models.Index(fields=['query_hash']),
            models.Index(fields=['-last_accessed']),
        ]