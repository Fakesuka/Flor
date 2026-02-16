from django.db import models
from django.conf import settings

class FloristTask(models.Model):
    """Задача на день для флориста"""
    PRIORITY_CHOICES = [('low', 'Низкий'), ('medium', 'Средний'), ('high', 'Высокий')]

    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    due_date = models.DateField()
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                    null=True, related_name='created_tasks')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Задача флориста'
        verbose_name_plural = 'Задачи флористов'
        ordering = ['due_date', '-priority']

    def __str__(self):
        return self.title
