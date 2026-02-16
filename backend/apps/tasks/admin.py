from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import FloristTask


@admin.register(FloristTask)
class FloristTaskAdmin(ModelAdmin):
    list_display = ['title', 'priority', 'store', 'assigned_to', 'due_date', 'is_completed']
    list_filter = ['store', 'priority', 'is_completed', 'due_date']
    search_fields = ['title', 'description']
    list_editable = ['is_completed', 'priority']
    autocomplete_fields = ['store', 'assigned_to']
    date_hierarchy = 'due_date'

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
