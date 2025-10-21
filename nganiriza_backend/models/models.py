from email.policy import default
from random import choice
from tkinter import CASCADE
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


class Account(BaseModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
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


