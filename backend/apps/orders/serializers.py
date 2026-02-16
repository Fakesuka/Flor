from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']
        read_only_fields = ['price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'delivery_type', 'store', 'assigned_florist',
            'recipient_name', 'recipient_phone', 'delivery_address',
            'delivery_date', 'delivery_time', 'card_text', 'comment',
            'total_price', 'payment_method', 'is_paid',
            'created_at', 'items',
        ]
        read_only_fields = ['status', 'assigned_florist', 'total_price', 'is_paid', 'created_at']


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new order with items"""
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            'delivery_type', 'store', 'recipient_name', 'recipient_phone',
            'delivery_address', 'delivery_date', 'delivery_time',
            'card_text', 'comment', 'payment_method', 'items',
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        total = 0
        for item_data in items_data:
            product = item_data['product']
            price = product.discount_price or product.price
            item = OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item_data['quantity'],
                price=price,
            )
            total += price * item.quantity
        order.total_price = total
        order.save()
        return order
