from django.utils import timezone
from django.db.models import Sum, Count, F
from django.db.models.functions import TruncDay
from apps.orders.models import Order
from apps.inventory.models import StockItem
from apps.users.models import CustomUser

def dashboard_callback(request, context):
    # --- KPI Cards ---
    today = timezone.now().date()
    week_ago = today - timezone.timedelta(days=7)

    # 1. Total Revenue (Today)
    daily_revenue = Order.objects.filter(
        created_at__date=today, status__in=['paid', 'completed', 'delivering']
    ).aggregate(Sum('total'))['total__sum'] or 0

    # 2. New Orders (Today)
    new_orders_count = Order.objects.filter(
        created_at__date=today
    ).count()

    # 3. Low Stock Items
    low_stock_count = StockItem.objects.filter(
        quantity__lte=F('min_quantity')
    ).count()

    # --- Charts ---

    # 1. Sales Last 7 Days (Line Chart)
    sales_data = Order.objects.filter(
        created_at__date__gte=week_ago,
        status__in=['paid', 'completed', 'delivering']
    ).annotate(day=TruncDay('created_at')).values('day').annotate(total=Sum('total')).order_by('day')

    days = []
    totals = []
    # Fill in missing days
    for i in range(7):
        date = week_ago + timezone.timedelta(days=i)
        day_str = date.strftime('%d.%m')
        days.append(day_str)
        
        # Find matching data or 0
        val = next((item['total'] for item in sales_data if item['day'].date() == date), 0)
        totals.append(float(val))

    sales_chart = {
        "labels": days,
        "datasets": [
            {
                "label": "Выручка (₽)",
                "data": totals,
                "borderColor": "#4ade80",
                "backgroundColor": "rgba(74, 222, 128, 0.2)",
            }
        ],
    }

    # 2. Orders by Status (Pie Chart)
    status_counts = Order.objects.values('status').annotate(count=Count('id'))
    status_map = dict(Order.STATUS_CHOICES)
    
    pie_labels = []
    pie_data = []
    pie_colors = []
    
    color_map = {
        'pending': '#facc15', # yellow
        'awaiting_payment': '#fbbf24', # amber
        'paid': '#34d399', # green
        'in_progress': '#60a5fa', # blue
        'ready': '#818cf8', # indigo
        'delivering': '#a78bfa', # purple
        'completed': '#2dd4bf', # teal
        'cancelled': '#f87171', # red
    }

    for item in status_counts:
        pie_labels.append(status_map.get(item['status'], item['status']))
        pie_data.append(item['count'])
        pie_colors.append(color_map.get(item['status'], '#9ca3af'))

    status_chart = {
        "labels": pie_labels,
        "datasets": [
            {
                "data": pie_data,
                "backgroundColor": pie_colors,
            }
        ],
    }

    context.update({
        "kpi": [
            {
                "title": "Выручка за сегодня",
                "metric": f"{daily_revenue} ₽",
                "footer": "Оплаченные заказы",
            },
            {
                "title": "Новые заказы",
                "metric": new_orders_count,
                "footer": "За сегодня",
            },
            {
                "title": "Мало на складе",
                "metric": low_stock_count,
                "footer": "Позиций требуют внимания",
                "footer_class": "text-red-600",
            },
        ],
        "charts": [
            {"title": "Продажи за 7 дней", "chart": sales_chart, "type": "line"},
            {"title": "Статусы заказов", "chart": status_chart, "type": "pie"},
        ]
    })
    return context
