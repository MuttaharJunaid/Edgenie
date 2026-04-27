import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edgenie.settings.development')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

if not User.objects.filter(email='admin@edgenie.io').exists():
    User.objects.create_superuser('admin@edgenie.io', 'admin')
    print('Superuser created successfully.')
else:
    print('Superuser already exists.')
