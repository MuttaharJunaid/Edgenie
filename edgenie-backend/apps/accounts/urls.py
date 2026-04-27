from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, LogoutView, MeView,
    UserStatsView, VerifyEmailView, ChangePasswordView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify-email/<str:token>/', VerifyEmailView.as_view(), name='verify_email'),
    path('me/', MeView.as_view(), name='me'),
    path('me/stats/', UserStatsView.as_view(), name='me_stats'),
    path('me/change-password/', ChangePasswordView.as_view(), name='change_password'),
]
