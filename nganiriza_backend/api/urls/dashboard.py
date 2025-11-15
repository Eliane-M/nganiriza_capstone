from django.urls import path
from api.views.profile.profile import get_profile, update_profile, patch_profile_language, delete_profile
from api.views.learning.conversations import delete_conversation, list_conversations, get_conversation, create_conversation, delete_conversation, conversation_messages
from api.views.learning.articles import *
from api.views.ai.query import ai_health, ai_query



urlpatterns = [
    # Profile
    path("profile/", get_profile, name="get_profile"),
    path("profile/update/", update_profile, name="update_profile"),
    path("profile/language/", patch_profile_language, name="patch_profile_language"),
    path("profile/delete/", delete_profile, name="delete_profile"),

    # Chats
    path("", list_conversations, name='get_conversation_list'),
    path("conversations/", create_conversation, name='create_conversation'),
    path("conversations/<uuid:pk>/", get_conversation, name='get_conversation'),
    path("conversations/<uuid:pk>/delete/", delete_conversation, name="delete_conversation"),
    path("conversations/<uuid:pk>/messages/", conversation_messages, name='conversation_messages'),
    
    
    #articles
    path("articles/", list_articles, name="list_articles"),
    path("articles/<uuid:pk>/", get_article, name='get_article'),
    path("articles/create/", create_article, name='create_article'),
    path("articles/<uuid:pk>/update/", update_article, name='update_article'),
    path("articles/<uuid:pk>/delete/", delete_article, name='delete_article'),
]