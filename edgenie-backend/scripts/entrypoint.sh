#!/bin/bash
set -e

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput 2>/dev/null || true

echo "Creating superuser if not exists..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@edgenie.io').exists():
    User.objects.create_superuser(
        email='admin@edgenie.io',
        username='admin',
        password='edgenie_admin_2024',
        role='admin'
    )
    print('Superuser created: admin@edgenie.io')
else:
    print('Superuser already exists.')
" 2>/dev/null || true

echo "Seeding subjects..."
python manage.py shell -c "
from apps.papers.models import Subject
subjects = [
    ('5054', 'Physics', '#3b82f6'),
    ('2281', 'Economics', '#10b981'),
    ('4024', 'Mathematics', '#f59e0b'),
    ('5070', 'Chemistry', '#ef4444'),
    ('5090', 'Biology', '#8b5cf6'),
]
for code, name, color in subjects:
    Subject.objects.get_or_create(code=code, defaults={'name': name, 'color': color})
    print(f'  Subject: {name} ({code})')
" 2>/dev/null || true

echo "Starting server..."
exec "$@"
