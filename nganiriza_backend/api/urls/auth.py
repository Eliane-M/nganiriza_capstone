from django.urls import path
from api.views.auth.signup import new_user


urlpatterns = [
    path("signup/", new_user, name="signup"),
]