from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
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
    art = Article.objects.filter(id=pk, is_published=True).first()
    if not art:
        return Response({"error":"Article not found"}, status=404)
    return Response(ArticleSerializer(art).data, status=200)

# Admin-only
@api_view(["POST"])
@permission_classes([IsAdminUser])
def create_article(request):
    ser = ArticleSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    art = ser.save()
    return Response(ArticleSerializer(art).data, status=201)

@api_view(["PUT","PATCH"])
@permission_classes([IsAdminUser])
def update_article(request, pk):
    art = Article.objects.filter(id=pk).first()
    if not art:
        return Response({"error":"Article not found"}, status=404)
    ser = ArticleSerializer(art, data=request.data, partial=(request.method=="PATCH"))
    ser.is_valid(raise_exception=True)
    art = ser.save()
    return Response(ArticleSerializer(art).data, status=200)

@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_article(request, pk):
    art = Article.objects.filter(id=pk).first()
    if not art:
        return Response({"error":"Article not found"}, status=404)
    art.delete()
    return Response(status=204)
