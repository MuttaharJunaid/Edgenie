from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.conf import settings
from django.contrib.auth import get_user_model
import logging
import json

logger = logging.getLogger('edgenie')
User = get_user_model()


class CreateCheckoutSessionView(APIView):
    """POST /api/billing/create-checkout/"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Stub implementation since Stripe isn't installed.
        # Check settings.STRIPE_PRO_PRICE_ID
        return Response({'checkout_url': 'https://checkout.stripe.com/test-url-stub'})


class StripeWebhookView(APIView):
    """POST /api/billing/webhook/"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

        # Stub verification:
        # In a real app we do stripe.Webhook.construct_event(payload, sig_header, secret)
        try:
            event = json.loads(payload)
            if event['type'] == 'checkout.session.completed':
                session = event['data']['object']
                # Assume client_reference_id contains user id
                user_id = session.get('client_reference_id')
                if user_id:
                    user = User.objects.get(id=user_id)
                    user.plan = 'pro'
                    user.stripe_customer_id = session.get('customer')
                    user.save(update_fields=['plan', 'stripe_customer_id'])
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Stripe webhook error: {e}")
            return Response(status=status.HTTP_400_BAD_REQUEST)


class BillingStatusView(APIView):
    """GET /api/billing/status/"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        plan = request.user.plan
        features = {
            'free': {
                'daily_ai_limit': 20,
                'mock_exams_per_month': 5,
                'chat_sessions': True,
                'analytics': 'basic',
            },
            'pro': {
                'daily_ai_limit': 500,
                'mock_exams_per_month': 100,
                'chat_sessions': True,
                'analytics': 'advanced',
            },
        }
        return Response({
            'plan': plan,
            'stripe_customer_id': request.user.stripe_customer_id,
            'features': features.get(plan, features['free']),
        })
