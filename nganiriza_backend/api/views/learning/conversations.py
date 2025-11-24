from django.http import response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from models.models import Conversations, Messages
from models.serializers import ConversationsSerializer, MessagesSerializer, ConversationCreateSerializer, MessageCreateSerializer
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from api.views.ai.ollama_service import OllamaService
import logging

logger = logging.getLogger(__name__)

@extend_schema(
    tags=["Conversations"],
    request=ConversationCreateSerializer,
    responses={201: ConversationsSerializer},
    summary="Create a new conversation"
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_conversation(request):
    try:
        # Validate input data
        serializer = ConversationCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create conversation
        conv = Conversations.objects.create(
            user=request.user,
            title=serializer.validated_data.get("title", ""),
            language=serializer.validated_data.get("language", "eng"),
            channel=serializer.validated_data.get("channel", "web"),
        )
        
        # Return serialized conversation with context
        response_serializer = ConversationsSerializer(conv, context={'request': request})
        return Response(response_serializer.data, status=201)
    except Exception as e:
        logger.error(f"Error creating conversation: {e}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["Conversations"],
    parameters=[
        OpenApiParameter(name="page", location=OpenApiParameter.QUERY, required=False, type=OpenApiTypes.INT),
        OpenApiParameter(name="page_size", location=OpenApiParameter.QUERY, required=False, type=OpenApiTypes.INT),
    ],
    responses={200: dict, 404: dict},
    summary="List my conversations"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_conversations(request):
    try:
        qs = Conversations.objects.filter(user=request.user, is_deleted=False).order_by("-updated_at")
        # simple manual pagination
        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 20))
        start, end = (page-1)*page_size, page*page_size
        total = qs.count()
        serializer = ConversationsSerializer(qs[start:end], many=True, context={'request': request})
        return Response({
            "count": total,
            "next": page+1 if end < total else None,
            "previous": page-1 if start > 0 else None,
            "results": serializer.data
        }, status=200)
    except Conversations.DoesNotExist:
        return Response({"error": "No conversations found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["Conversations"],
    responses={200: ConversationsSerializer, 404: OpenApiResponse(description="Not found")},
    summary="Get one conversation"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversation(request, pk):
    try:
        conversation = Conversations.objects.get(id_number=pk, user=request.user, is_deleted=False)
        serializer = ConversationsSerializer(conversation)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Conversations.DoesNotExist:
        return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["Conversations"],
    responses={200: dict, 404: dict},
    summary="Delete my conversation (by current user)"
)
@api_view(['DELETE'])
def delete_conversation(request):
    # Extract the user from the request
    user = getattr(request, 'user', None)
    try:
        # Find the conversation associated with the user
        conversation = Conversations.objects.get(user=user)
        conversation.delete()
        return Response({"message": "Conversation deleted successfully"}, status=status.HTTP_200_OK)
    except Conversations.DoesNotExist:
        return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# messages for a conversation
@extend_schema(
    tags=["Messages"],
    parameters=[
        OpenApiParameter(name="before", location=OpenApiParameter.QUERY, required=False, type=str, description="message id"),
        OpenApiParameter(name="limit", location=OpenApiParameter.QUERY, required=False, type=OpenApiTypes.INT),
    ],
    responses={200: MessagesSerializer(many=True)},
    summary="List messages in a conversation"
)
@extend_schema(
    tags=["Messages"],
    request=MessageCreateSerializer,
    responses={201: MessagesSerializer, 404: dict, 400: dict},
    summary="Post a new user message to a conversation"
)
@api_view(["GET","POST"])
@permission_classes([IsAuthenticated])
def conversation_messages(request, pk):
    conv = Conversations.objects.filter(id_number=pk, user=request.user, is_deleted=False).first()
    if not conv:
        return Response({"error":"Conversation not found"}, status=404)

    if request.method == "GET":
        # optional `before` / `limit`
        before = request.GET.get("before")  # ISO datetime or message id (extend later)
        
        # Use Messages model directly to avoid RelatedObjectDoesNotExist error
        from models.models import Messages
        qs = Messages.objects.filter(conversation=conv)
        
        if before:
            qs = qs.filter(id_number=before)
        page_size = min(int(request.GET.get("limit", 50)), 200)
        data = MessagesSerializer(qs.order_by("-created_at")[:page_size], many=True).data
        return Response(list(reversed(data)), status=200)

    # POST create user message
    payload = {"role": request.data.get("role","user"), "content": request.data.get("content","")}
    if not payload["content"].strip():
        return Response({"error":"content is required"}, status=400)

    ser = MessagesSerializer(data=payload)
    ser.is_valid(raise_exception=True)
    user_msg = ser.save(conversation=conv)

    # Auto-generate assistant reply if this is a user message
    assistant_msg = None
    if payload["role"] == "user":
        try:
            # Get conversation history (before adding current message)
            all_messages = conv.messages.all().order_by('created_at')
            conversation_history = [
                {"role": msg.role, "content": msg.content}
                for msg in all_messages
            ]
            
            # Generate response using Ollama
            ollama_service = OllamaService()
            system_prompt = """You are a helpful, culturally sensitive assistant in Kinyarwanda that provides age-appropriate guidance for young girls (ages 12-18) on:
- Sex education and reproductive health (medically accurate, age-appropriate)
- Self-protection and personal safety
- Mental health awareness and counseling
- Social behavior and healthy relationships
- Body awareness, consent, and boundaries

Always respond in natural, fluent Kinyarwanda. Be empathetic, supportive, and non-judgmental."""
            
            result = ollama_service.generate_response(
                query=payload["content"],
                conversation_history=conversation_history[:-1],  # Exclude current message
                system_prompt=system_prompt,
                max_tokens=512,
                temperature=0.7
            )
            
            if result.get("success"):
                # Save assistant reply
                assistant_payload = {
                    "role": "assistant",
                    "content": result.get("response", "")
                }
                assistant_ser = MessagesSerializer(data=assistant_payload)
                assistant_ser.is_valid(raise_exception=True)
                assistant_msg = assistant_ser.save(conversation=conv)
            
            # Generate title if this is one of the first few messages and title is empty
            if not conv.title or conv.title.strip() == "":
                message_count = conv.messages.filter(role='user').count()
                if message_count >= 1:  # Generate title after 1 user message
                    try:
                        # Get fresh conversation history including the new assistant message
                        all_messages_updated = conv.messages.all().order_by('created_at')
                        full_history = [
                            {"role": msg.role, "content": msg.content}
                            for msg in all_messages_updated
                        ]
                        
                        title = ollama_service.generate_title(full_history)
                        if title and title.strip():
                            conv.title = title
                            conv.save(update_fields=['title'])
                            logger.info(f"Generated title for conversation {conv.id}: {title}")
                    except Exception as e:
                        logger.warning(f"Failed to generate title: {e}")
                        # Fallback: use first user message as title
                        first_user_msg = conv.messages.filter(role='user').first()
                        if first_user_msg and first_user_msg.content:
                            conv.title = first_user_msg.content[:50]
                            conv.save(update_fields=['title'])
        
        except Exception as e:
            logger.error(f"Error generating assistant reply: {e}")
            # Continue even if assistant reply generation fails
    
    response_data = {
        "user_message": MessagesSerializer(user_msg).data
    }
    if assistant_msg:
        response_data["assistant_message"] = MessagesSerializer(assistant_msg).data
    
    return Response(response_data, status=201)