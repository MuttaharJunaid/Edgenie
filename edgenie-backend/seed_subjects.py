import django
import os
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edgenie.settings.development')
django.setup()

from apps.papers.models import Subject

subjects = [
    {
        "code": "0580",
        "name": "Mathematics",
        "level": "IGCSE",
        "board": "CAIE"
    },
    {
        "code": "5054",
        "name": "Physics",
        "level": "O-Level",
        "board": "CAIE"
    },
    {
        "code": "5070",
        "name": "Chemistry",
        "level": "O-Level",
        "board": "CAIE"
    },
    {
        "code": "2281",
        "name": "Economics",
        "level": "O-Level",
        "board": "CAIE"
    }
]

for s in subjects:
    obj, created = Subject.objects.get_or_create(code=s['code'], defaults=s)
    if created:
        print(f"Created subject {s['name']}")
    else:
        print(f"Subject {s['name']} already exists")
