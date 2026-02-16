from django.db import models
from django.conf import settings


class FloristTask(models.Model):
    """Задача флориста на день"""
    PRIORITY_CHOICES = [
        ('low', 'Низкий'),
        ('medium', 'Средний'),
        ('high', 'Высокий'),
    ]

    florist = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='florist_tasks',
    )
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    is_completed = models.BooleanField(default=False)
    due_date = models.DateField()
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['due_date', '-priority', 'created_at']
        verbose_name = 'Задача флориста'
        verbose_name_plural = 'Задачи флористов'

    def __str__(self):
        return f'{self.title} ({self.get_priority_display()})'
