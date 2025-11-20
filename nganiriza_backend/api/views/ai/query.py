# api/views/ai/query_view.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from models.serializers import QuerySerializer, AIResponseSerializer
from models.models import Conversations, Messages
from .ollama_service import OllamaService
import logging

logger = logging.getLogger(__name__)

# Instantiate Ollama service
_ollama_service = None

def get_ollama_service():
    global _ollama_service
    if _ollama_service is None:
        _ollama_service = OllamaService()
    return _ollama_service

@extend_schema(
    tags=["AI"],
    request=QuerySerializer,
    responses={200: AIResponseSerializer, 400: dict, 500: dict},
    auth=[]
)
@api_view(["POST"])
@permission_classes([AllowAny])
def ai_query(request):
    """
    Unified chat endpoint that:
    1. Creates/gets conversation if authenticated
    2. Saves user message
    3. Calls Ollama with conversation history
    4. Saves assistant reply
    5. Generates title if needed
    6. Returns response
    """
    serializer = QuerySerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            {"error": "Invalid request data", "details": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    data = serializer.validated_data
    query = data.get("query", "")
    conversation_id = data.get("conversation_id")
    language = data.get("language", "eng")
    
    # Get or create conversation if user is authenticated
    conv = None
    conversation_history = []
    
    if request.user.is_authenticated:
        try:
            if conversation_id:
                # Get existing conversation (using id_number as primary key)
                conv = Conversations.objects.get(id_number=conversation_id, user=request.user, is_deleted=False)
            else:
                # Create new conversation
                conv = Conversations.objects.create(
                    user=request.user,
                    title="",
                    language=language,
                    channel="web"
                )
                conversation_id = conv.id_number
            
            # Save user message directly
            user_msg = Messages.objects.create(
                conversation=conv,
                role="user",
                content=query
            )
            
            # Get conversation history (excluding the message we just added for the query)
            messages = conv.messages.all().order_by('created_at')
            conversation_history = [
                {"role": msg.role, "content": msg.content}
                for msg in messages
                if msg.id_number != user_msg.id_number  # Exclude current user message from history
            ]
            
        except Conversations.DoesNotExist:
            logger.warning(f"Conversation {conversation_id} not found for user {request.user}")
            # If conversation doesn't exist, create a new one
            try:
                conv = Conversations.objects.create(
                    user=request.user,
                    title="",
                    language=language,
                    channel="web"
                )
                conversation_id = conv.id_number
                # Save user message to new conversation directly
                user_msg = Messages.objects.create(
                    conversation=conv,
                    role="user",
                    content=query
                )
                conversation_history = []
            except Exception as e:
                logger.error(f"Error creating new conversation: {e}")
                conv = None
        except Exception as e:
            logger.error(f"Error handling conversation: {e}")
            conv = None
    
    # Get system prompt (default for Kinyarwanda counseling)
    system_prompt = data.get("system_prompt") or """You are a helpful, culturally sensitive assistant in Kinyarwanda that provides age-appropriate guidance for young girls (ages 12-18) on:
- Sex education and reproductive health (medically accurate, age-appropriate)
- Self-protection and personal safety
- Mental health awareness and counseling
- Social behavior and healthy relationships
- Body awareness, consent, and boundaries

Always respond in natural, fluent Kinyarwanda. Be empathetic, supportive, and non-judgmental."""
    
    ollama_service = get_ollama_service()
    
    try:
        # Generate AI response
        result = ollama_service.generate_response(
            query=query,
            conversation_history=conversation_history,
            system_prompt=system_prompt,
            max_tokens=data.get("max_tokens", 512),
            temperature=data.get("temperature", 0.7),
            use_cache=data.get("use_cache", True),
        )

        if not result.get("success", False):
            return Response(
                {"error": result.get("error", "Ollama service failed"), "details": result},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        assistant_response = result.get("response", "")
        
        # Save assistant reply if conversation exists
        assistant_msg = None
        if conv and assistant_response:
            try:
                # Save assistant reply directly
                assistant_msg = Messages.objects.create(
                    conversation=conv,
                    role="assistant",
                    content=assistant_response
                )
                
                # Generate title if needed (after first user message)
                if not conv.title or conv.title.strip() == "":
                    user_message_count = conv.messages.filter(role='user').count()
                    if user_message_count >= 1:
                        try:
                            # Get full conversation history for title generation
                            all_messages = conv.messages.all().order_by('created_at')
                            full_history = [
                                {"role": msg.role, "content": msg.content}
                                for msg in all_messages
                            ]
                            title = ollama_service.generate_title(full_history)
                            if title and title.strip():
                                conv.title = title
                                conv.save(update_fields=['title'])
                                logger.info(f"Generated title for conversation {conv.id_number}: {title}")
                        except Exception as e:
                            logger.warning(f"Failed to generate title: {e}")
                            # Fallback: use first user message
                            first_user_msg = conv.messages.filter(role='user').first()
                            if first_user_msg and first_user_msg.content:
                                conv.title = first_user_msg.content[:50]
                                conv.save(update_fields=['title'])
            except Exception as e:
                logger.error(f"Error saving assistant message: {e}")
        
        # Return response with conversation info
        response_data = {
            "success": True,
            "response": assistant_response,
            "cached": result.get("cached", False)
        }
        
        if conv:
            response_data["conversation_id"] = str(conv.id_number)
            response_data["title"] = conv.title
        
        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        logger.exception("ai_query_api error")
        return Response(
            {"error": f"There was an error: {str(e)}", "success": False},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@extend_schema(
    tags=["AI"],
    responses={200: dict},
    auth=[]
)
@api_view(["GET"])
@permission_classes([AllowAny])
def ai_health(request):
    """Check Ollama service health"""
    ollama_service = get_ollama_service()
    health_status = ollama_service.health_check()
    is_healthy = health_status.get("status") == "healthy"
    return Response(
        {
            "status": "healthy" if is_healthy else "unhealthy",
            "ollama_available": is_healthy,
            "details": health_status
        },
        status=status.HTTP_200_OK if is_healthy else status.HTTP_503_SERVICE_UNAVAILABLE
    )


@extend_schema(
    tags=["AI"],
    responses={200: dict},
    auth=[]
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_conversation_title(request):
    """Generate a title for a conversation"""
    conversation_id = request.data.get("conversation_id")
    
    if not conversation_id:
        return Response(
            {"error": "conversation_id is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        conv = Conversations.objects.get(id_number=conversation_id, user=request.user)
        messages = conv.messages.all().order_by('created_at')
        
        conversation_history = [
            {"role": msg.role, "content": msg.content}
            for msg in messages
        ]
        
        ollama_service = get_ollama_service()
        title = ollama_service.generate_title(conversation_history)
        
        # Update conversation title
        conv.title = title
        conv.save(update_fields=['title'])
        
        return Response(
            {"title": title, "conversation_id": str(conversation_id)},
            status=status.HTTP_200_OK
        )
        
    except Conversations.DoesNotExist:
        return Response(
            {"error": "Conversation not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.exception("Error generating conversation title")
        return Response(
            {"error": f"Error generating title: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
