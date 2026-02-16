from rest_framework import serializers
from .models import BouquetComponent, CustomBouquet, CustomBouquetItem


class BouquetComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BouquetComponent
        fields = ['id', 'name', 'component_type', 'price', 'image', 'color']


class CustomBouquetItemSerializer(serializers.ModelSerializer):
    component_name = serializers.CharField(source='component.name', read_only=True)
    component_price = serializers.DecimalField(source='component.price', max_digits=8, decimal_places=2, read_only=True)
    component_image = serializers.ImageField(source='component.image', read_only=True)

    class Meta:
        model = CustomBouquetItem
        fields = ['id', 'component', 'component_name', 'component_price', 'component_image', 'quantity']


class CustomBouquetSerializer(serializers.ModelSerializer):
    bouquet_items = CustomBouquetItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CustomBouquet
        fields = [
            'id', 'status', 'is_from_photo',
            'reference_photo', 'customer_notes', 'budget_min', 'budget_max',
            'estimated_price', 'florist_price', 'florist_comment',
            'total_price', 'bouquet_items',
            'created_at',
        ]


class CustomBouquetCreateSerializer(serializers.Serializer):
    """Создание букета из конструктора"""
    items = serializers.ListField(child=serializers.DictField(), write_only=True)
    customer_notes = serializers.CharField(required=False, default='')

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        customer = self.context['request'].user if self.context['request'].user.is_authenticated else None
        bouquet = CustomBouquet.objects.create(
            customer=customer,
            customer_notes=validated_data.get('customer_notes', ''),
            status='pending',
        )
        total = 0
        for item in items_data:
            component = BouquetComponent.objects.get(id=item['component_id'])
            qty = item.get('quantity', 1)
            CustomBouquetItem.objects.create(
                bouquet=bouquet,
                component=component,
                quantity=qty,
            )
            total += component.price * qty
        bouquet.estimated_price = total
        bouquet.save()
        return bouquet


class PhotoBouquetCreateSerializer(serializers.Serializer):
    """Создание букета по фото"""
    reference_photo = serializers.ImageField()
    customer_notes = serializers.CharField(required=False, default='')
    budget_min = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    budget_max = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

    def create(self, validated_data):
        customer = self.context['request'].user if self.context['request'].user.is_authenticated else None
        bouquet = CustomBouquet.objects.create(
            customer=customer,
            is_from_photo=True,
            status='pending',
            **validated_data,
        )
        return bouquet
