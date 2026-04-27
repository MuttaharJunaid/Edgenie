from django.http import JsonResponse
from django.db import connection
from django.core.cache import cache


def health_check(request):
    checks = {}
    try:
        connection.ensure_connection()
        checks['database'] = 'ok'
    except Exception as e:
        checks['database'] = f'error: {e}'
    try:
        cache.set('ping', 'pong', 5)
        checks['cache'] = 'ok' if cache.get('ping') == 'pong' else 'error'
    except Exception as e:
        checks['cache'] = f'error: {e}'
    ok = all(v == 'ok' for v in checks.values())
    return JsonResponse({
        'status': 'healthy' if ok else 'degraded',
        'checks': checks,
        'version': '1.0.0',
    }, status=200 if ok else 503)
