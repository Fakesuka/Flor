from django.contrib import admin
from unfold.admin import ModelAdmin
from unfold.contrib.import_export.forms import ExportForm, ImportForm, SelectableFieldsExportForm
from import_export.admin import ImportExportModelAdmin
from .models import Order, OrderItem, DeliverySettings, GlobalSettings


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['price']


@admin.register(DeliverySettings)
class DeliverySettingsAdmin(ModelAdmin):
    """Singleton — настройки доставки"""
    list_display = ['city_price', 'remote_price', 'free_delivery_threshold']

    def has_add_permission(self, request):
        return not DeliverySettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(GlobalSettings)
class GlobalSettingsAdmin(ModelAdmin):
    """Singleton — глобальные настройки"""
    list_display = ['is_builder_enabled', 'builder_min_price']

    def has_add_permission(self, request):
        return not GlobalSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Order)
class OrderAdmin(ModelAdmin, ImportExportModelAdmin):
    import_form_class = ImportForm
    export_form_class = ExportForm
    list_display = ['id', 'customer', 'status', 'delivery_type', 'total', 'is_paid', 'created_at']
    list_filter = ['status', 'delivery_type', 'is_paid', 'store']
    search_fields = ['recipient_name', 'recipient_phone', 'customer__phone']
    readonly_fields = ['payment_url', 'is_paid', 'created_at', 'updated_at']
    inlines = [OrderItemInline]
    actions = ['mark_accept', 'mark_in_progress', 'mark_ready', 'mark_delivered']

    @admin.action(description='✅ Принять (отправить ссылку на оплату)')
    def mark_accept(self, request, queryset):
        for order in queryset.filter(status='pending'):
            order.status = 'awaiting_payment'
            order.payment_url = f'https://pay.example.com/order/{order.id}?amount={order.total}'
            order.save()

    @admin.action(description='🔨 Начать сборку')
    def mark_in_progress(self, request, queryset):
        queryset.filter(status='paid').update(status='in_progress')

    @admin.action(description='📦 Готов к выдаче/доставке')
    def mark_ready(self, request, queryset):
        queryset.filter(status='in_progress').update(status='ready')

    @admin.action(description='✔️ Доставлен')
    def mark_delivered(self, request, queryset):
        queryset.update(status='completed')
