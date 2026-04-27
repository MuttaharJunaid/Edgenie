from django.urls import path
from .views import WaitlistView, ContactView, PublicStatsView

urlpatterns = [
    path('waitlist/', WaitlistView.as_view(), name='waitlist'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('stats/', PublicStatsView.as_view(), name='public_stats'),
]
