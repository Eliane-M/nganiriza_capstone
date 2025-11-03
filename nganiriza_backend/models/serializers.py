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

