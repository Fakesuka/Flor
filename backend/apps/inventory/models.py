from django.db import models
from django.conf import settings

class StockItem(models.Model):
    """Учёт товаров на складе по точкам"""
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    min_quantity = models.IntegerField("Минимальный остаток", default=5)

    class Meta:
        verbose_name = 'Складской остаток'
        verbose_name_plural = 'Остатки на складе'
        unique_together = ['product', 'store']

    def __str__(self):
        return f"{self.product.name} ({self.store.name})"


class StockMovement(models.Model):
    """История движения товаров"""
    TYPE_CHOICES = [
        ('in', 'Приход'),
        ('out', 'Расход'),
        ('transfer', 'Перемещение'),
        ('write_off', 'Списание'),
    ]
    stock_item = models.ForeignKey(StockItem, on_delete=models.CASCADE, verbose_name="Товар на складе")
    movement_type = models.CharField("Тип операции", max_length=10, choices=TYPE_CHOICES)
    quantity = models.IntegerField("Количество")
    reason = models.CharField("Причина", max_length=255, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name="Сотрудник")
    created_at = models.DateTimeField("Дата операции", auto_now_add=True)

    class Meta:
        verbose_name = 'Движение товара'
        verbose_name_plural = 'Движение товаров'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_movement_type_display()} {self.quantity} шт."
