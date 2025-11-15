from django.urls import path
from api.views.ai.query import *


urlpatterns = [
    path('query/', ai_query, name='ai_query'),
    path('health/', ai_health, name='health_check'),
]

