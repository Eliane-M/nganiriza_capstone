from django.http import response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from models.models import Conversations
from models.serializers import ConversationsSerializer, MessagesSerializer, ConversationCreateSerializer, MessageCreateSerializer
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from .services.docs_helper import *

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
        conv = Conversations.objects.create(
            user=request.user,
            title=request.data.get("title", ""),
            language=request.data.get("language", "eng"),
            channel=request.data.get("channel", "web"),
        )
        return Response(ConversationsSerializer(conv).data, status=201)
    except Exception as e:
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
        conversation = Conversations.objects.get(id=pk, user=request.user, is_deleted=False)
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
    conv = Conversations.objects.filter(id=pk, user=request.user, is_deleted=False).first()
    if not conv:
        return Response({"error":"Conversation not found"}, status=404)

    if request.method == "GET":
        # optional `before` / `limit`
        before = request.GET.get("before")  # ISO datetime or message id (extend later)
        qs = conv.messages.all()
        if before:
            qs = qs.filter(id=before)
        page_size = min(int(request.GET.get("limit", 50)), 200)
        data = MessagesSerializer(qs.order_by("-created_at")[:page_size], many=True).data
        return Response(list(reversed(data)), status=200)

    # POST create user message
    payload = {"role": request.data.get("role","user"), "content": request.data.get("content","")}
    if not payload["content"].strip():
        return Response({"error":"content is required"}, status=400)

    ser = MessagesSerializer(data=payload)
    ser.is_valid(raise_exception=True)
    msg = ser.save(conversation=conv)

    # TODO: moderation + generate assistant reply (sync or async)
    return Response(MessagesSerializer(msg).data, status=201)