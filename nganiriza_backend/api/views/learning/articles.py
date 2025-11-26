from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from models.models import Article
from models.serializers import ArticleSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_articles(request):
    locale = request.GET.get("locale", "eng")
    tag = request.GET.get("tag")
    qs = Article.objects.filter(is_published=True, locale=locale)
    if tag:
        qs = qs.extra(where=["%s = ANY(tags)"], params=[tag])
    page = max(int(request.GET.get("page", 1)), 1)
    page_size = min(max(int(request.GET.get("page_size", 20)), 1), 100)
    start, end = (page-1)*page_size, page*page_size
    total = qs.count()
    data = ArticleSerializer(qs[start:end], many=True).data
    return Response({"count": total, "next": page+1 if end<total else None,
                     "previous": page-1 if start>0 else None, "results": data}, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_article(request, pk):
    art = Article.objects.filter(id_number=pk, is_published=True).first()
    if not art:
        return Response({"error":"Article not found"}, status=404)
    return Response(ArticleSerializer(art).data, status=200)

# Admin-only
@api_view(["POST"])
@permission_classes([AllowAny])
def create_article(request):
    # Convert request.data to dict and handle locale mapping
    data = dict(request.data)
    
    # Map locale values: 'rw' -> 'kny' (Kinyarwanda)
    if 'locale' in data:
        locale = data['locale']
        if locale == 'rw':
            data['locale'] = 'kny'
        elif locale not in ['eng', 'kny', 'fr']:
            return Response(
                {"error": f"Invalid locale. Must be one of: eng, kny, fr"},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Add name field from title if not provided (BaseModel requirement)
    if 'name' not in data and 'title' in data:
        data['name'] = data['title']
    
    # Remove basemodel_ptr if present (it's auto-generated)
    data.pop('basemodel_ptr', None)
    data.pop('id', None)  # Remove id if present, use id_number instead
    
    ser = ArticleSerializer(data=data)
    ser.is_valid(raise_exception=True)
    art = ser.save(created_by=request.user, updated_by=request.user)
    return Response(ArticleSerializer(art).data, status=201)

@api_view(["PUT","PATCH"])
@permission_classes([AllowAny])
def update_article(request, pk):
    art = Article.objects.filter(id_number=pk).first()
    if not art:
        return Response({"error":"Article not found"}, status=404)
    
    # Convert request.data to dict and handle locale mapping
    data = dict(request.data)
    
    # Map locale values: 'rw' -> 'kny' (Kinyarwanda)
    if 'locale' in data:
        locale = data['locale']
        if locale == 'rw':
            data['locale'] = 'kny'
        elif locale not in ['eng', 'kny', 'fr']:
            return Response(
                {"error": f"Invalid locale. Must be one of: eng, kny, fr"},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Update name if title is being updated
    if 'title' in data and 'name' not in data:
        data['name'] = data['title']
    
    # Remove basemodel_ptr if present (it's auto-generated)
    data.pop('basemodel_ptr', None)
    data.pop('id', None)
    data.pop('id_number', None)  # Don't allow changing the primary key
    
    ser = ArticleSerializer(art, data=data, partial=(request.method=="PATCH"))
    ser.is_valid(raise_exception=True)
    art = ser.save(updated_by=request.user)
    return Response(ArticleSerializer(art).data, status=200)

@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_article(request, pk):
    art = Article.objects.filter(id_number=pk).first()
    if not art:
        return Response({"error":"Article not found"}, status=404)
    art.delete()
    return Response(status=204)

# Admin-only: List all articles (including unpublished)
@api_view(["GET"])
@permission_classes([AllowAny])
def list_all_articles(request):
    """List all articles for admin (including unpublished)"""
    locale = request.GET.get("locale")
    tag = request.GET.get("tag")
    qs = Article.objects.all()
    if locale:
        qs = qs.filter(locale=locale)
    if tag:
        qs = qs.extra(where=["%s = ANY(tags)"], params=[tag])
    page = max(int(request.GET.get("page", 1)), 1)
    page_size = min(max(int(request.GET.get("page_size", 20)), 1), 100)
    start, end = (page-1)*page_size, page*page_size
    total = qs.count()
    data = ArticleSerializer(qs[start:end], many=True).data
    return Response({"count": total, "next": page+1 if end<total else None,
                     "previous": page-1 if start>0 else None, "results": data}, status=200)
