from django.db import models

class Store(models.Model):
    """Точка магазина (ровно 2 штуки)"""
    name = models.CharField(max_length=100)       # "Цветочная Лавка — Центр"
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    working_hours = models.JSONField("Часы работы")  # {"mon": {"open": "09:00", "close": "21:00"}, ...}
    is_active = models.BooleanField("Активен", default=True)

    class Meta:
        verbose_name = 'Магазин'
        verbose_name_plural = 'Магазины'

    def __str__(self):
        return self.name
