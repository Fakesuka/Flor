from django.db import models

class Category(models.Model):
    """Категории: букеты, горшечные, шары, открытки, игрушки, сад, сувениры"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50)  # Lucide icon name
    image = models.ImageField(upload_to='categories/')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['order']

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name="Категория")
    name = models.CharField("Название", max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField("Описание", blank=True)
    price = models.DecimalField("Цена", max_digits=10, decimal_places=2)
    discount_price = models.DecimalField("Цена со скидкой", max_digits=10, decimal_places=2, null=True, blank=True)
    is_popular = models.BooleanField("Популярный", default=False)
    is_new = models.BooleanField("Новинка", default=False)
    is_active = models.BooleanField("Активен", default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # Наличие по точкам
    store_availability = models.ManyToManyField('stores.Store', through='ProductAvailability', verbose_name="Наличие в магазинах")

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Фото товара'
        verbose_name_plural = 'Фото товаров'

class ProductAvailability(models.Model):
    """Наличие товара по каждой точке"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Наличие'
        verbose_name_plural = 'Наличие'
