from .base import *  # noqa: F401,F403

DEBUG = True
CORS_ALLOW_ALL_ORIGINS = True
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Optional dev tools — only add if installed
try:
    import silk  # noqa: F401
    INSTALLED_APPS += ['silk']  # noqa: F405
    MIDDLEWARE += ['silk.middleware.SilkyMiddleware']  # noqa: F405
except ImportError:
    pass

try:
    import debug_toolbar  # noqa: F401
    INSTALLED_APPS += ['debug_toolbar']  # noqa: F405
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']  # noqa: F405
    INTERNAL_IPS = ['127.0.0.1']
except ImportError:
    pass
