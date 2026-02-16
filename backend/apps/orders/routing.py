from django.urls import re_path
from .consumers import OrderStatusConsumer, FloristStoreConsumer

websocket_urlpatterns = [
    re_path(r'ws/orders/(?P<order_id>\d+)/$', OrderStatusConsumer.as_asgi()),
    re_path(r'ws/florist/store/(?P<store_id>\d+)/$', FloristStoreConsumer.as_asgi()),
]
