from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import BouquetComponent, CustomBouquet, CustomBouquetItem


class CustomBouquetItemInline(admin.TabularInline):
    model = CustomBouquetItem
    extra = 0
    readonly_fields = ['price']

    def price(self, obj):
        return obj.component.price
    price.short_description = "Цена"


@admin.register(BouquetComponent)
class BouquetComponentAdmin(ModelAdmin):
    list_display = ['image_preview', 'name', 'component_type', 'price', 'color', 'is_active', 'order']
    list_filter = ['component_type', 'is_active']
    search_fields = ['name']
    list_editable = ['price', 'is_active', 'order', 'color']

    def image_preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" width="50" style="border-radius: 5px;" />'
        return "-"
    image_preview.allow_tags = True
    image_preview.short_description = "Фото"


@admin.register(CustomBouquet)
class CustomBouquetAdmin(ModelAdmin):
    list_display = ['id', 'customer', 'status', 'is_from_photo', 'total_price_display', 'created_at']
    list_filter = ['status', 'is_from_photo', 'created_at']
    inlines = [CustomBouquetItemInline]
    readonly_fields = ['total_price_display']

    def total_price_display(self, obj):
        return f"{obj.total_price} ₽"
    total_price_display.short_description = "Итоговая цена"
