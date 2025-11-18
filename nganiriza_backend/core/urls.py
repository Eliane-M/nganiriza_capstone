from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('api.urls.auth')),
    path('api/dashboard/', include('api.urls.dashboard')),
    path('api/ai/', include('api.urls.ai')),
    path("api/specialists/", include('api.urls.specialists')),
    path("api/admin/", include('api.urls.admin')),

    # Swagger UI
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Redoc
    path("api/schema/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
