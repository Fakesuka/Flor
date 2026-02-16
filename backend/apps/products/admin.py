from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Category, Product, ProductImage, ProductAvailability


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductAvailabilityInline(admin.TabularInline):
    model = ProductAvailability
    extra = 1


@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ['name', 'slug', 'image_preview', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['order', 'is_active']

    def image_preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" width="50" style="border-radius: 5px;" />'
        return "-"
    image_preview.allow_tags = True
    image_preview.short_description = "Фото"


@admin.register(Product)
class ProductAdmin(ModelAdmin):
    list_display = ['image_preview', 'name', 'category', 'price', 'discount_price', 'is_popular', 'is_new', 'is_active']
    list_filter = ['category', 'is_popular', 'is_new', 'is_active', 'store_availability']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline, ProductAvailabilityInline]
    actions = ['make_popular', 'make_new', 'deactivate']
    list_editable = ['price', 'is_active', 'is_popular']
    autocomplete_fields = ['category']

    def image_preview(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img and img.image:
            return f'<img src="{img.image.url}" width="50" style="border-radius: 5px;" />'
        return "-"
    image_preview.allow_tags = True
    image_preview.short_description = "Фото"

    @admin.action(description='Пометить как популярные')
    def make_popular(self, request, queryset):
        queryset.update(is_popular=True)

    @admin.action(description='Пометить как новинки')
    def make_new(self, request, queryset):
        queryset.update(is_new=True)

    @admin.action(description='Деактивировать')
    def deactivate(self, request, queryset):
        queryset.update(is_active=False)
