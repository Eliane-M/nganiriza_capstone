from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from api.views.auth.signup import new_user
from api.views.auth.login import login_api
from api.views.auth.logout import logout_api
from api.views.auth.reset import password_reset_request, password_reset_confirm
from api.views.auth.me import me


urlpatterns = [
    path("signup/", new_user, name="signup"),
    path("login/", login_api, name="login"),
    path("logout/", logout_api, name="logout"),
    path("me/", me, name="me"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("reset/", password_reset_request, name="reset"),
    path("reset/confirm/", password_reset_confirm, name="reset_confirm"),
]