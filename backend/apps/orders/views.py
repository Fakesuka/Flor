from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes as perm_classes
from rest_framework.response import Response
from django.utils import timezone
from .models import Order, DeliverySettings
from .florist_models import FloristTask
from .serializers import OrderSerializer, OrderCreateSerializer


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ('florist', 'owner'):
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(customer=user).order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Флорист принимает заказ → генерируется ссылка на оплату → клиент получает"""
        order = self.get_object()
        if order.status != 'pending':
            return Response(
                {'error': 'Заказ уже обработан'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # TODO: Integrate with payment provider (YooKassa, Stripe, etc.)
        # For now, generate a stub payment URL
        order.payment_url = f'https://pay.example.com/order/{order.id}?amount={order.total}'
        order.status = 'awaiting_payment'
        order.assigned_florist = request.user
        order.save()

        # TODO: Send push notification to customer with payment_url
        # from .notifications import notify_order_status
        # notify_order_status(order)

        return Response({
            'status': 'awaiting_payment',
            'payment_url': order.payment_url,
        })

    @action(detail=True, methods=['post'])
    def confirm_payment(self, request, pk=None):
        """Подтверждение оплаты (вызывается webhook'ом платёжной системы)"""
        order = self.get_object()
        if order.status != 'awaiting_payment':
            return Response(
                {'error': 'Заказ не ожидает оплаты'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        order.status = 'paid'
        order.is_paid = True
        order.save()
        return Response({'status': 'paid'})

    @action(detail=True, methods=['post'])
    def start_assembly(self, request, pk=None):
        """Флорист начинает сборку после оплаты"""
        order = self.get_object()
        if order.status != 'paid':
            return Response(
                {'error': 'Заказ не оплачен'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        order.status = 'in_progress'
        order.save()
        return Response({'status': 'in_progress'})

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status in ('pending', 'awaiting_payment'):
            order.status = 'cancelled'
            order.save()
            return Response({'status': 'cancelled'})
        return Response(
            {'error': 'Невозможно отменить заказ в текущем статусе'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Флорист отклоняет заказ"""
        order = self.get_object()
        if order.status != 'pending':
            return Response(
                {'error': 'Заказ уже обработан'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        reason = request.data.get('reason', 'Отклонён флористом')
        order.status = 'cancelled'
        order.comment = reason
        order.save()
        return Response({'status': 'cancelled', 'reason': reason})

    @action(detail=True, methods=['post'])
    def mark_ready(self, request, pk=None):
        """Букет собран"""
        order = self.get_object()
        if order.status != 'in_progress':
            return Response({'error': 'Заказ не в сборке'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'ready'
        order.save()
        return Response({'status': 'ready'})

    @action(detail=True, methods=['post'])
    def start_delivery(self, request, pk=None):
        """Заказ передан курьеру"""
        order = self.get_object()
        if order.status != 'ready':
            return Response({'error': 'Заказ не готов'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'delivering'
        order.save()
        return Response({'status': 'delivering'})

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Заказ завершён"""
        order = self.get_object()
        if order.status not in ('ready', 'delivering'):
            return Response({'error': 'Невозможно завершить'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'completed'
        order.save()
        return Response({'status': 'completed'})


class IsFlorist(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('florist', 'owner')


class FloristTaskViewSet(viewsets.ModelViewSet):
    """CRUD задач флориста"""
    permission_classes = [IsFlorist]

    class FloristTaskSerializer(viewsets.ModelViewSet):
        pass

    from rest_framework import serializers as sz

    class TaskSerializer(sz.ModelSerializer):
        class Meta:
            model = FloristTask
            fields = ['id', 'title', 'description', 'priority', 'is_completed',
                      'due_date', 'completed_at', 'created_at']
            read_only_fields = ['completed_at', 'created_at']

    serializer_class = TaskSerializer

    def get_queryset(self):
        qs = FloristTask.objects.filter(florist=self.request.user)
        date = self.request.query_params.get('date')
        if date:
            qs = qs.filter(due_date=date)
        return qs

    def perform_create(self, serializer):
        store = self.request.user.florist_profile.store if hasattr(self.request.user, 'florist_profile') else None
        serializer.save(florist=self.request.user, store=store)

    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        task = self.get_object()
        task.is_completed = not task.is_completed
        task.completed_at = timezone.now() if task.is_completed else None
        task.save()
        return Response(self.TaskSerializer(task).data)


@api_view(['GET'])
@perm_classes([permissions.AllowAny])
def delivery_settings(request):
    """Публичный endpoint — стоимость доставки для корзины"""
    settings = DeliverySettings.load()
    return Response({
        'city_price': str(settings.city_price),
        'remote_price': str(settings.remote_price),
        'free_delivery_threshold': str(settings.free_delivery_threshold),
    })
