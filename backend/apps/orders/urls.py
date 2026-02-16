from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, FloristTaskViewSet, delivery_settings

router = DefaultRouter()
router.register('orders', OrderViewSet, basename='order')
router.register('florist-tasks', FloristTaskViewSet, basename='florist-task')

urlpatterns = [
    path('', include(router.urls)),
    path('delivery-settings/', delivery_settings, name='delivery-settings'),
]

