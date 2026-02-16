from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import StockItem, StockMovement


@admin.register(StockItem)
class StockItemAdmin(ModelAdmin):
    list_display = ['product', 'store', 'quantity', 'min_quantity', 'status']
    list_filter = ['store']
    search_fields = ['product__name']
    list_editable = ['quantity', 'min_quantity']
    autocomplete_fields = ['product', 'store']

    def status(self, obj):
        if obj.quantity <= obj.min_quantity:
            return f'<span style="color: red; font-weight: bold;">Мало ({obj.quantity})</span>'
        return "OK"
    status.allow_tags = True
    status.short_description = "Статус"


@admin.register(StockMovement)
class StockMovementAdmin(ModelAdmin):
    list_display = ['created_at', 'stock_item', 'movement_type', 'quantity', 'reason', 'created_by']
    list_filter = ['movement_type', 'created_at']
    readonly_fields = ['created_at', 'created_by']

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
