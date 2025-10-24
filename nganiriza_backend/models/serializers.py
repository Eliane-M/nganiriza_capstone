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

class ConversationCreateSerialzer(serializers.Serializer):
    title = serializers.CharField(required=False, allow_blank=True, max_length=255)
    language = serializers.ChoiceField(choices=[("rw","rw"),("en","en"),("fr","fr")], default="en")
    channel  = serializers.ChoiceField(choices=[("web","web"),("sms","sms"),("ussd","ussd")], default="web")

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

class MessageCreateSerializer(serializers.Serializer):
    role    = serializers.ChoiceField(choices=[("user","user"),("assistant","assistant"),("system","system")], default="user")
    content = serializers.CharField()

class MessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messages
        fields = '__all__'

    def validate_role(self, value):
        if value not in dict(Messages.ROLE_CHOICES):
            raise serializers.ValidationError("Invalid role")
        return value

class ArticleCreateSerializer(serializers.Serializer):
    locale = serializers.ChoiceField(choices=[("rw","rw"),("en","en"),("fr","fr")], default="rw")
    title  = serializers.CharField(max_length=255)
    body_md = serializers.CharField()
    tags   = serializers.ListField(child=serializers.CharField(), required=False)
    is_published = serializers.BooleanField(default=True)

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

