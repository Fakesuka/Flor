from django.db import models


class Story(models.Model):
    """Группа историй (один кружок)"""
    title = models.CharField("Заголовок", max_length=100)
    cover_image = models.ImageField("Обложка", upload_to='stories/covers/')
    is_active = models.BooleanField("Активна", default=True)
    sort_order = models.PositiveIntegerField("Порядок", default=0)
    created_at = models.DateTimeField("Создана", auto_now_add=True)

    class Meta:
        ordering = ['sort_order', '-created_at']
        verbose_name = 'История'
        verbose_name_plural = 'Истории'

    def __str__(self):
        return self.title


class StorySlide(models.Model):
    """Отдельный слайд внутри истории"""
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='slides', verbose_name="История")
    image = models.ImageField("Изображение", upload_to='stories/slides/')
    sort_order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        ordering = ['sort_order']
        verbose_name = 'Слайд'
        verbose_name_plural = 'Слайды'

    def __str__(self):
        return f"{self.story.title} — слайд {self.sort_order}"
