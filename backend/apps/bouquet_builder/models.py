from django.db import models
from django.conf import settings


class BouquetComponent(models.Model):
    """Элементы конструктора: цветы, зелень, обёртка, ленты, аксессуары"""
    TYPE_CHOICES = [
        ('flower', 'Цветок'),
        ('greenery', 'Зелень'),
        ('wrap', 'Обёртка'),
        ('ribbon', 'Лента'),
        ('accessory', 'Аксессуар'),
    ]
    name = models.CharField(max_length=100)
    component_type = models.CharField(max_length=15, choices=TYPE_CHOICES)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='components/', blank=True)
    color = models.CharField(max_length=30, blank=True, help_text='Цвет для фильтрации (hex или название)')
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Компонент букета'
        verbose_name_plural = 'Компоненты букетов'

    def __str__(self):
        return f'{self.get_component_type_display()}: {self.name}'


class CustomBouquet(models.Model):
    """Пользовательский букет из конструктора ИЛИ по фото"""
    STATUS_CHOICES = [
        ('draft', 'Черновик'),
        ('pending', 'Ожидает оценки'),
        ('priced', 'Оценён флористом'),
        ('approved', 'Подтверждён клиентом'),
        ('ordered', 'В заказе'),
        ('cancelled', 'Отменён'),
    ]

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='custom_bouquets', null=True, blank=True,
    )

    # Вариант 1: конструктор
    components = models.ManyToManyField(BouquetComponent, through='CustomBouquetItem', blank=True)

    # Вариант 2: фото-пример
    reference_photo = models.ImageField(upload_to='bouquet_references/', blank=True)
    customer_notes = models.TextField(blank=True, verbose_name='Пожелания клиента')
    budget_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    budget_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # Цена: расчётная (конструктор) или назначенная флористом
    estimated_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    florist_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        verbose_name='Цена от флориста',
    )
    florist_comment = models.TextField(blank=True, verbose_name='Комментарий флориста')

    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='draft')
    is_from_photo = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Кастомный букет'
        verbose_name_plural = 'Кастомные букеты'

    def __str__(self):
        return f'Букет #{self.pk} — {self.get_status_display()}'

    @property
    def total_price(self):
        """Итого из конструктора"""
        return sum(
            item.component.price * item.quantity
            for item in self.bouquet_items.all()
        )


class CustomBouquetItem(models.Model):
    bouquet = models.ForeignKey(CustomBouquet, on_delete=models.CASCADE, related_name='bouquet_items')
    component = models.ForeignKey(BouquetComponent, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        verbose_name = 'Элемент букета'
        verbose_name_plural = 'Элементы букета'

    def __str__(self):
        return f'{self.component.name} ×{self.quantity}'
