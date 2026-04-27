from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from apps.core.views import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health_check),

    # Mobile app + shared
    path('api/auth/', include('apps.accounts.urls')),
    path('api/', include('apps.papers.urls')),
    path('api/search/', include('apps.search.urls')),
    path('api/', include('apps.submissions.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('api/chat/', include('apps.chat.urls')),

    # Admin dashboard
    path('api/admin-tools/', include('apps.scraper.urls')),

    # Landing page
    path('api/landing/', include('apps.landing.urls')),
]

# Stripe webhooks — only if billing_urls module exists
try:
    urlpatterns += [
        path('api/billing/', include('apps.accounts.billing_urls')),
    ]
except Exception:
    pass

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    try:
        import debug_toolbar
        urlpatterns += [
            path('__debug__/', include(debug_toolbar.urls)),
        ]
    except ImportError:
        pass
    try:
        urlpatterns += [
            path('silk/', include('silk.urls', namespace='silk')),
        ]
    except Exception:
        pass
