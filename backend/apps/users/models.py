from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    """Пользователь системы"""
    ROLE_CHOICES = [
        ('client', 'Клиент'),
        ('florist', 'Флорист'),
        ('owner', 'Владелец'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    phone = models.CharField(max_length=20, unique=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    loyalty_card_number = models.CharField(max_length=20, blank=True)  # Скидочная карта
    loyalty_discount = models.DecimalField(max_digits=4, decimal_places=2, default=0)
    is_loyalty_confirmed = models.BooleanField(default=False, verbose_name="Карта подтверждена")
    push_token = models.CharField(max_length=255, blank=True)  # FCM token

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'


class FloristProfile(models.Model):
    """Профиль флориста — привязка к точке"""
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='florist_profile', verbose_name="Пользователь")
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE, related_name='florists', verbose_name="Магазин")
    is_on_shift = models.BooleanField("На смене", default=False)
    specialization = models.CharField("Специализация", max_length=100, blank=True)  # "Свадебные букеты"

    class Meta:
        verbose_name = 'Профиль флориста'
        verbose_name_plural = 'Профили флористов'

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.store})"


class FloristSchedule(models.Model):
    """График работы флористов"""
    florist = models.ForeignKey(FloristProfile, on_delete=models.CASCADE, related_name='shifts')
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField(default='09:00')
    end_time = models.TimeField(default='21:00')

    class Meta:
        ordering = ['-date', 'start_time']
        verbose_name = 'Смена'
        verbose_name_plural = 'График работы'

    def __str__(self):
        return f"{self.date} — {self.florist.user.first_name} ({self.start_time}-{self.end_time})"
