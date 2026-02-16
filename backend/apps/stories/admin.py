from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from .models import Story, StorySlide


class StorySlideInline(TabularInline):
    model = StorySlide
    extra = 1
    fields = ['image', 'sort_order']
    ordering = ['sort_order']


@admin.register(Story)
class StoryAdmin(ModelAdmin):
    list_display = ['title', 'is_active', 'sort_order', 'slide_count', 'created_at']
    list_editable = ['is_active', 'sort_order']
    list_filter = ['is_active']
    search_fields = ['title']
    inlines = [StorySlideInline]

    def slide_count(self, obj):
        return obj.slides.count()
    slide_count.short_description = 'Слайдов'
