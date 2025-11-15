# api/views/ai/query_view.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from models.serializers import QuerySerializer, AIResponseSerializer  # make AIResponseSerializer if you don’t have it
from .llm_service import LLMService

# Instantiate once so the model isn't reloaded per request
_LLM = None

def get_llm():
    global _LLM
    if _LLM is None:
        _LLM = LLMService()
    return _LLM

@extend_schema(
    tags=["AI"],
    request=QuerySerializer,
    responses={200: AIResponseSerializer, 400: dict, 500: dict},
    auth=[]
)
@api_view(["POST"])
@permission_classes([AllowAny])
def ai_query(request):
    serializer = QuerySerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            {"error": "Invalid request data", "details": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    data = serializer.validated_data
    llm = get_llm()
    try:
        result = llm.generate_response(
            query=data["query"],
            context=data.get("context"),
            max_tokens=data.get("max_tokens"),
            temperature=data.get("temperature"),
            system_prompt=data.get("system_prompt"),
            use_cache=data.get("use_cache", True),
        )

        # If your service returns success=False on model errors, surface that as 500 to match your login style
        if not result.get("success", False):
            return Response(
                {"error": result.get("error", "LLM failed"), "details": result},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(result, status=status.HTTP_200_OK)

    except Exception as e:
        # optional: log.exception("ai_query_api error")
        return Response(
            {"error": f"There was an error: {str(e)}"},
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
    # If LLM failed to initialize, _model will be None in your service
    llm = get_llm()
    is_loaded = getattr(llm, "_model", None) is not None
    return Response(
        {"status": "healthy" if is_loaded else "unhealthy", "model_loaded": is_loaded},
        status=status.HTTP_200_OK
    )
