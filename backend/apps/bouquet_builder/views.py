from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import BouquetComponent, CustomBouquet
from .serializers import (
    BouquetComponentSerializer,
    CustomBouquetSerializer,
    CustomBouquetCreateSerializer,
    PhotoBouquetCreateSerializer,
)


class BouquetComponentViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/builder/components/?type=flower"""
    queryset = BouquetComponent.objects.filter(is_active=True)
    serializer_class = BouquetComponentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['component_type']
    permission_classes = [permissions.AllowAny]


class CustomBouquetViewSet(viewsets.ModelViewSet):
    serializer_class = CustomBouquetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role in ('florist', 'owner'):
            return CustomBouquet.objects.all()
        if user.is_authenticated:
            return CustomBouquet.objects.filter(customer=user)
        return CustomBouquet.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return CustomBouquetCreateSerializer
        if self.action == 'from_photo':
            return PhotoBouquetCreateSerializer
        return CustomBouquetSerializer

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=False, methods=['post'], url_path='from-photo')
    def from_photo(self, request):
        """POST /api/builder/bouquets/from-photo/ — создание по фото"""
        serializer = PhotoBouquetCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        bouquet = serializer.save()
        return Response(
            CustomBouquetSerializer(bouquet).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=['post'])
    def set_price(self, request, pk=None):
        """Флорист назначает цену"""
        bouquet = self.get_object()
        price = request.data.get('price')
        comment = request.data.get('comment', '')
        if not price:
            return Response({'error': 'Укажите цену'}, status=status.HTTP_400_BAD_REQUEST)
        bouquet.florist_price = price
        bouquet.florist_comment = comment
        bouquet.status = 'priced'
        bouquet.save()
        return Response(CustomBouquetSerializer(bouquet).data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Клиент одобряет цену → букет можно добавить в заказ"""
        bouquet = self.get_object()
        if bouquet.status != 'priced':
            return Response({'error': 'Букет ещё не оценён'}, status=status.HTTP_400_BAD_REQUEST)
        bouquet.status = 'approved'
        bouquet.save()
        return Response(CustomBouquetSerializer(bouquet).data)
