from django.db import models
from django.conf import settings


class DeliverySettings(models.Model):
    """Настройки доставки — singleton, редактируется в админке"""
    city_price = models.DecimalField('Город', max_digits=10, decimal_places=2, default=250)
    remote_price = models.DecimalField('Отдалённые районы', max_digits=10, decimal_places=2, default=350)
    free_delivery_threshold = models.DecimalField(
        'Бесплатная доставка от', max_digits=10, decimal_places=2, default=0,
        help_text='0 = не используется',
    )

    class Meta:
        verbose_name = 'Настройки доставки'
        verbose_name_plural = 'Настройки доставки'

    def __str__(self):
        return f'Доставка: город {self.city_price}₽ / отдалённые {self.remote_price}₽'

    def save(self, *args, **kwargs):
        # Singleton: always use pk=1
        self.pk = 1
        super().save(*args, **kwargs)

    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class GlobalSettings(models.Model):
    """Глобальные настройки приложения"""
    is_builder_enabled = models.BooleanField("Конструктор включен", default=True)
    builder_min_price = models.DecimalField("Минимальная цена сборки", max_digits=10, decimal_places=2, default=1500)

    class Meta:
        verbose_name = 'Глобальные настройки'
        verbose_name_plural = 'Глобальные настройки'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает подтверждения'),
        ('awaiting_payment', 'Ожидает оплаты'),
        ('paid', 'Оплачен'),
        ('in_progress', 'Собирается'),
        ('ready', 'Готов'),
        ('delivering', 'Доставляется'),
        ('completed', 'Завершён'),
        ('cancelled', 'Отменён'),
    ]
    DELIVERY_CHOICES = [
        ('pickup', 'Самовывоз'),
        ('delivery_city', 'Доставка (город)'),
        ('delivery_remote', 'Доставка (отдалённые)'),
    ]

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders', verbose_name="Клиент")
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE, null=True, blank=True, verbose_name="Магазин")
    assigned_florist = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                         null=True, blank=True, related_name='assigned_orders', verbose_name="Флорист")
    status = models.CharField("Статус", max_length=20, choices=STATUS_CHOICES, default='pending')
    delivery_type = models.CharField("Тип получения", max_length=20, choices=DELIVERY_CHOICES)

    # Данные получателя
    recipient_name = models.CharField("Имя получателя", max_length=100)
    recipient_phone = models.CharField("Телефон получателя", max_length=20)
    delivery_address = models.CharField("Адрес доставки", max_length=255, blank=True)
    delivery_date = models.DateField("Дата доставки")
    delivery_time = models.TimeField("Время доставки")

    # Открытка
    card_text = models.TextField("Текст открытки", blank=True)

    # Суммы
    subtotal = models.DecimalField("Подытог", max_digits=10, decimal_places=2)
    discount = models.DecimalField("Скидка", max_digits=10, decimal_places=2, default=0)
    delivery_fee = models.DecimalField("Стоимость доставки", max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField("Итого", max_digits=10, decimal_places=2)

    # Оплата — ссылка генерируется после подтверждения флористом
    payment_url = models.URLField(blank=True, help_text='Ссылка на оплату (генерируется автоматически)', verbose_name="Ссылка на оплату")
    is_paid = models.BooleanField("Оплачен", default=False)

    comment = models.TextField("Комментарий к заказу", blank=True)
    created_at = models.DateTimeField("Дата создания", auto_now_add=True)
    updated_at = models.DateTimeField("Дата обновления", auto_now=True)

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']

    def __str__(self):
        return f"Заказ #{self.id}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, verbose_name="Товар")
    quantity = models.PositiveIntegerField("Количество", default=1)
    price = models.DecimalField("Цена за единицу", max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = 'Позиция заказа'
        verbose_name_plural = 'Позиции заказа'

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

