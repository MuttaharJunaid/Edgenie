from rest_framework.views import exception_handler
from rest_framework.response import Response
import logging

logger = logging.getLogger('edgenie')

MESSAGE_MAP = {
    400: 'Validation error. Check your input.',
    401: 'Authentication required.',
    403: 'Permission denied.',
    404: 'Resource not found.',
    429: 'Too many requests. Slow down.',
}


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        response.data = {
            'error': True,
            'status_code': response.status_code,
            'message': MESSAGE_MAP.get(response.status_code, 'An error occurred.'),
            'details': response.data,
        }
    else:
        logger.error(f'Unhandled exception: {exc}', exc_info=True)
        response = Response({
            'error': True,
            'status_code': 500,
            'message': 'Internal server error.',
            'details': {},
        }, status=500)
    return response
