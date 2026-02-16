from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Story
from .serializers import StorySerializer


class StoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Публичный API для получения активных историй"""
    queryset = Story.objects.filter(is_active=True).prefetch_related('slides')
    serializer_class = StorySerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Return all stories without pagination
