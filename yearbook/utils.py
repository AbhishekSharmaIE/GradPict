from django.conf import settings
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        logger.error(f"Unhandled exception: {exc}")
        response = Response({
            'error': 'Internal server error',
            'detail': str(exc) if settings.DEBUG else 'Please contact support'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response 