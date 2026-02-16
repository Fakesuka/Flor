from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BouquetComponentViewSet, CustomBouquetViewSet

router = DefaultRouter()
router.register('components', BouquetComponentViewSet, basename='component')
router.register('bouquets', CustomBouquetViewSet, basename='custom-bouquet')

urlpatterns = [
    path('', include(router.urls)),
]
