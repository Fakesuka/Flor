from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import CustomUser, FloristProfile, FloristSchedule


@admin.register(CustomUser)
class CustomUserAdmin(ModelAdmin):
    list_display = ['username', 'phone', 'role', 'loyalty_card_number', 'loyalty_discount', 'is_loyalty_confirmed', 'is_active']
    list_filter = ['role', 'is_active', 'is_loyalty_confirmed']
    search_fields = ['username', 'phone', 'first_name', 'last_name', 'loyalty_card_number']
    list_editable = ['loyalty_discount', 'is_loyalty_confirmed']
    actions = ['confirm_loyalty']

    @admin.action(description='💳 Подтвердить карту лояльности (установить 5%%)')
    def confirm_loyalty(self, request, queryset):
        # Set 5% discount for selected users
        queryset.update(loyalty_discount=5.00)
        self.message_user(request, f"Скидка 5% установлена для {queryset.count()} пользователей.")


@admin.register(FloristProfile)
class FloristProfileAdmin(ModelAdmin):
    list_display = ['user', 'store', 'is_on_shift', 'specialization']
    list_filter = ['store', 'is_on_shift']
    search_fields = ['user__username', 'user__first_name', 'user__last_name']
    autocomplete_fields = ['user', 'store']


@admin.register(FloristSchedule)
class FloristScheduleAdmin(ModelAdmin):
    list_display = ['date', 'florist', 'store', 'start_time', 'end_time']
    list_filter = ['store', 'florist']
    date_hierarchy = 'date'
    autocomplete_fields = ['florist', 'store']
