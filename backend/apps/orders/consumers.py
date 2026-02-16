import json
from channels.generic.websocket import AsyncWebsocketConsumer


class OrderStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.order_id = self.scope['url_route']['kwargs']['order_id']
        self.room_group_name = f'order_{self.order_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    async def order_status_update(self, event):
        """Handler for order.status.update type messages"""
        await self.send(text_data=json.dumps({
            'type': 'status_update',
            'order_id': event['order_id'],
            'status': event['status'],
            'message': event.get('message', ''),
        }))


class FloristStoreConsumer(AsyncWebsocketConsumer):
    """
    WebSocket для флориста — получение заказов по точке в real-time.
    Подключение: ws://host/ws/florist/store/<store_id>/
    
    Логика «кто быстрее принял»:
    - Все флористы точки подключены к одному каналу store_<id>
    - При новом заказе все получают уведомление
    - Первый, кто вызывает POST /orders/{id}/accept/, забирает заказ
    - После accept отправляется order_claimed — остальные видят, что заказ занят
    """
    async def connect(self):
        self.store_id = self.scope['url_route']['kwargs']['store_id']
        self.room_group_name = f'store_{self.store_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )
        await self.accept()
        await self.send(text_data=json.dumps({
            'type': 'connected',
            'store_id': self.store_id,
            'message': 'Подключён к точке',
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    async def new_order(self, event):
        """Новый заказ пришёл на точку"""
        await self.send(text_data=json.dumps({
            'type': 'new_order',
            'order': event['order'],
        }))

    async def order_claimed(self, event):
        """Заказ принят флористом (для оповещения остальных)"""
        await self.send(text_data=json.dumps({
            'type': 'order_claimed',
            'order_id': event['order_id'],
            'florist_name': event['florist_name'],
        }))

    async def order_status_changed(self, event):
        """Статус заказа изменился"""
        await self.send(text_data=json.dumps({
            'type': 'order_status_changed',
            'order_id': event['order_id'],
            'status': event['status'],
        }))
