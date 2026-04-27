from django.urls import path
from . import views

urlpatterns = [
    # Admin dashboard overview
    path('dashboard/',     views.AdminDashboardView.as_view(), name='admin_dashboard'),
    
    # Users management
    path('users/',         views.AdminUsersView.as_view(), name='admin_users'),
    path('users/<uuid:pk>/',views.AdminUserDetailView.as_view(), name='admin_user_detail'),
    
    # AI Scraper
    path('scraper/jobs/',  views.ScraperJobListCreateView.as_view(), name='scraper_jobs'),
    path('scraper/jobs/<uuid:pk>/', views.ScraperJobDetailView.as_view(), name='scraper_job_detail'),
    path('scraper/jobs/<uuid:pk>/cancel/', views.ScraperJobCancelView.as_view(), name='scraper_job_cancel'),
    
    # Logs
    path('logs/',          views.SystemLogsView.as_view(), name='system_logs'),
    
    # AI analytics
    path('ai-stats/',      views.AIStatsView.as_view(), name='admin_ai_stats'),
    
    # Settings
    path('settings/',      views.SystemSettingsView.as_view(), name='system_settings'),
]
