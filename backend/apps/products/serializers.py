from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductAvailability


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'order']


class ProductAvailabilitySerializer(serializers.ModelSerializer):
    store_name = serializers.CharField(source='store.name', read_only=True)

    class Meta:
        model = ProductAvailability
        fields = ['store', 'store_name', 'quantity']


class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'image', 'order', 'products_count']


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product lists"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'price', 'discount_price',
            'is_popular', 'is_new', 'category', 'category_name',
            'primary_image',
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first()
        if img:
            return ProductImageSerializer(img).data
        img = obj.images.first()
        return ProductImageSerializer(img).data if img else None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer for product detail page"""
    images = ProductImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    availability = ProductAvailabilitySerializer(
        source='productavailability_set', many=True, read_only=True
    )

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'discount_price',
            'is_popular', 'is_new', 'category', 'images', 'availability',
            'created_at',
        ]
