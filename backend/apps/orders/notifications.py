"""
Push Notification Service (FCM stub)

In production, configure:
  FIREBASE_CREDENTIALS = os.environ.get('FIREBASE_CREDENTIALS_JSON')
  and use firebase-admin SDK.

For now, this is a stub that logs notifications.
"""
import logging

logger = logging.getLogger(__name__)


def send_push_notification(token: str, title: str, body: str, data: dict = None):
    """
    Send a push notification via FCM.
    In production: use firebase_admin.messaging.send()
    """
    logger.info(f"[FCM STUB] Sending push to {token}: {title} — {body}")
    # TODO: Replace with actual FCM implementation
    # import firebase_admin
    # from firebase_admin import messaging
    # message = messaging.Message(
    #     notification=messaging.Notification(title=title, body=body),
    #     data=data or {},
    #     token=token,
    # )
    # messaging.send(message)
    return True


def notify_order_status(order):
    """Notify customer about order status change"""
    status_messages = {
        'confirmed': 'Ваш заказ подтверждён!',
        'in_progress': 'Флорист собирает ваш букет 💐',
        'ready': 'Ваш заказ готов!',
        'delivering': 'Курьер в пути 🚗',
        'delivered': 'Заказ доставлен! Приятного дня ✨',
    }
    message = status_messages.get(order.status, f'Статус заказа: {order.status}')

    if order.customer.push_token:
        send_push_notification(
            token=order.customer.push_token,
            title='Цветочная Лавка',
            body=message,
            data={'order_id': str(order.id), 'status': order.status},
        )
