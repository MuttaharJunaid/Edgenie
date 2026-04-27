from django.urls import path
from .billing_views import (
    CreateCheckoutSessionView, StripeWebhookView, BillingStatusView
)

urlpatterns = [
    path('create-checkout/', CreateCheckoutSessionView.as_view(), name='create_checkout'),
    path('webhook/', StripeWebhookView.as_view(), name='stripe_webhook'),
    path('status/', BillingStatusView.as_view(), name='billing_status'),
]
