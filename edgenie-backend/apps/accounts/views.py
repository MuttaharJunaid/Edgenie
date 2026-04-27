from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from django.core.cache import cache
from django.db import models

from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer,
    UpdateProfileSerializer, UserStatsSerializer
)
from .tasks import send_verification_email

User = get_user_model()


class RegisterView(APIView):
    """POST /api/auth/register/"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            send_verification_email.delay(str(user.id))
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'message': 'Registration successful. Please verify email.'
            }, status=status.HTTP_201_CREATED)
        return Response({'error': True, 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """POST /api/auth/login/"""
    permission_classes = [permissions.AllowAny]
    # Optionally add LoginRateThrottle in throttle_classes later

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            self._update_streak(user)
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def _update_streak(self, user):
        profile = getattr(user, 'studentprofile', None)
        if not profile:
            return

        now = timezone.now().date()
        if profile.last_active:
            last_active_date = profile.last_active.date()
            if last_active_date == now:
                pass  # same day, don't change streak
            elif last_active_date == now - timedelta(days=1):
                profile.streak_days += 1
            else:
                profile.streak_days = 1
        else:
            profile.streak_days = 1
            
        profile.last_active = timezone.now()
        profile.save(update_fields=['streak_days', 'last_active'])


class LogoutView(APIView):
    """POST /api/auth/logout/"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            pass  # Token already blacklisted or invalid — logout anyway
        return Response({'message': 'Logged out successfully.'})


class MeView(APIView):
    """GET/PATCH /api/auth/me/"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UpdateProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserStatsView(APIView):
    """GET /api/auth/me/stats/"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        cache_key = f'dashboard:stats:{user.id}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
            
        from apps.submissions.models import Submission
        
        subs = Submission.objects.filter(student=user, ai_marks__isnull=False)
        total_q = subs.count()
        
        from django.db.models import Sum, Count
        marks = subs.aggregate(total_obtained=Sum('ai_marks'), total_possible=Sum('question__marks'))
        acc = round((marks['total_obtained'] / marks['total_possible']) * 100, 1) if marks['total_possible'] and marks['total_possible'] > 0 else 0
        
        topics_count = subs.values('question__topic').distinct().count()
        perfect_scores = subs.filter(ai_marks=models.F('question__marks')).exists()
        
        profile = getattr(user, 'studentprofile', None)
        streak = profile.streak_days if profile else 0
        minutes = profile.total_practice_time if profile else 0

        # Questions this week
        week_ago = timezone.now() - timedelta(days=7)
        questions_this_week = Submission.objects.filter(
            student=user, submitted_at__gte=week_ago
        ).count()

        # Best subject
        best_subject = None
        subject_stats = subs.values(
            'question__paper__subject__name'
        ).annotate(
            avg_pct=Sum('ai_marks') * 100 / Sum('question__marks')
        ).order_by('-avg_pct').first()
        if subject_stats:
            best_subject = subject_stats['question__paper__subject__name']

        # Recent submissions
        recent_subs = Submission.objects.filter(student=user).order_by('-submitted_at')[:3]
        recent_submissions = [{
            'id': str(s.id),
            'question_number': s.question.question_number,
            'topic': s.question.topic.name if s.question.topic else '',
            'score_percentage': s.score_percentage,
            'grading_status': s.grading_status,
            'submitted_at': s.submitted_at.isoformat(),
        } for s in recent_subs.select_related('question__topic')]

        data = {
            'total_questions_practiced': total_q,
            'overall_accuracy': acc,
            'streak_days': streak,
            'topics_covered_count': topics_count,
            'total_practice_time_minutes': minutes,
            'has_perfect_score': perfect_scores,
            'questions_this_week': questions_this_week,
            'best_subject': best_subject,
            'recent_submissions': recent_submissions,
        }
        
        cache.set(cache_key, data, 300)  # 5m
        return Response(data)


class VerifyEmailView(APIView):
    """POST /api/auth/verify-email/<token>/"""
    permission_classes = [permissions.AllowAny]

    def post(self, request, token):
        # Implement token validation here
        # E.g. Using django's account activation token system
        return Response({'message': 'Email verified (stubbed).'})


class ChangePasswordView(APIView):
    """POST /api/auth/me/change-password/"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        current = request.data.get('current_password')
        new_pass = request.data.get('new_password')
        
        if not user.check_password(current):
            return Response({'error': 'Incorrect current password.'}, status=status.HTTP_400_BAD_REQUEST)
            
        user.set_password(new_pass)
        user.save()
        return Response({'message': 'Password updated.'})
