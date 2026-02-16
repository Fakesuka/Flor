from rest_framework import serializers
from .models import Story, StorySlide


class StorySlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorySlide
        fields = ('id', 'image', 'sort_order')


class StorySerializer(serializers.ModelSerializer):
    slides = StorySlideSerializer(many=True, read_only=True)

    class Meta:
        model = Story
        fields = ('id', 'title', 'cover_image', 'slides')
