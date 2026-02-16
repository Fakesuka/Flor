# 🌸 FLOWER-SHOP PWA — «Цветочная Лавка»

> **Полное техническое задание для AI-агента**
> Проект: PWA-приложение для цветочного магазина с двумя точками продаж

---

## 1. ОБЗОР ПРОЕКТА

### Продукт
«Цветочная Лавка» — PWA-приложение для цветочного магазина с двумя физическими точками. Включает клиентское приложение, панель флориста и Django-админку для владельца.

### Целевые пользователи
- **Клиенты** — заказ букетов, подарков, самовывоз/доставка
- **Флористы** — приём заказов, управление задачами (2 точки)
- **Владелец** — полное управление бизнесом через админку

### Требования к разработке
- Используй **Context7** для получения актуальной документации по всем библиотекам
- Все названия переменных, функций, комментарии — **на английском**
- UI-тексты, контент — **на русском**
- Код должен быть чистым, типизированным, с JSDoc/docstrings

---

## 2. ДИЗАЙН-СИСТЕМА

### Философия
Тренды 2025-2026: мягкий неоморфизм, стеклянный морфизм (glass effect), микроанимации, плавные градиенты, органические формы. Пастельные, тёплые, уютные тона. Дизайн должен вызывать ощущение свежести, нежности и премиальности.

### Палитра цветов

```
/* Основные */
--primary:          #D4A5A5;   /* Пыльная роза — главный акцент */
--primary-light:    #F0D5D5;   /* Светлая роза — hover, фоны */
--primary-dark:     #B8878B;   /* Тёмная роза — pressed, тени */

/* Вторичные */
--secondary:        #A8D5BA;   /* Шалфей — кнопки, акценты */
--secondary-light:  #C8E6D0;   /* Мятный — подложки */

/* Нейтральные */
--background:       #FFF9F5;   /* Кремовый — основной фон */
--surface:          #FFFFFF;   /* Белый — карточки */
--surface-glass:    rgba(255, 255, 255, 0.72);  /* Стеклянный эффект */

/* Текст */
--text-primary:     #3D3D3D;   /* Основной текст */
--text-secondary:   #8A8A8A;   /* Второстепенный */
--text-accent:      #D4A5A5;   /* Акцентный */

/* Статусы */
--success:          #A8D5BA;
--warning:          #F5D6A8;
--error:            #E8A5A5;
--info:             #A5C4D4;

/* Градиенты */
--gradient-hero:    linear-gradient(135deg, #FFF9F5 0%, #F0D5D5 50%, #C8E6D0 100%);
--gradient-card:    linear-gradient(180deg, #FFFFFF 0%, #FFF9F5 100%);
--gradient-button:  linear-gradient(135deg, #D4A5A5 0%, #B8878B 100%);
```

### Типографика

```
/* Google Fonts */
--font-heading: 'Playfair Display', serif;     /* Заголовки — элегантный serif */
--font-body:    'Inter', sans-serif;            /* Тело текста — читаемый sans */
--font-accent:  'Cormorant Garamond', serif;    /* Акценты, цены — утончённый */

/* Размеры */
--text-xs:   0.75rem;    /* 12px — метки, капсы */
--text-sm:   0.875rem;   /* 14px — подписи */
--text-base: 1rem;       /* 16px — основной */
--text-lg:   1.125rem;   /* 18px — выделенный */
--text-xl:   1.25rem;    /* 20px — подзаголовки */
--text-2xl:  1.5rem;     /* 24px — заголовки секций */
--text-3xl:  2rem;       /* 32px — главные заголовки */
--text-4xl:  2.5rem;     /* 40px — hero */
```

### Скругления и тени

```
--radius-sm:  8px;
--radius-md:  16px;
--radius-lg:  24px;
--radius-xl:  32px;
--radius-full: 9999px;

/* Мягкие тени в стиле неоморфизма */
--shadow-sm:    0 2px 8px rgba(212, 165, 165, 0.08);
--shadow-md:    0 4px 16px rgba(212, 165, 165, 0.12);
--shadow-lg:    0 8px 32px rgba(212, 165, 165, 0.16);
--shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.06);
```

### Анимации

```
--ease-smooth:  cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce:  cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-spring:  cubic-bezier(0.25, 0.46, 0.45, 0.94);

--duration-fast:    150ms;
--duration-normal:  300ms;
--duration-slow:    500ms;
```

### Компоненты UI

#### Карточка товара
```
- Соотношение фото: 1:1 (квадрат)
- Скругление: radius-lg (24px)
- Тень: shadow-md
- Hover: scale(1.02) + shadow-lg
- Glass overlay на фото с названием
- Кнопка "В корзину" — gradient-button, radius-full
- Анимация добавления — bounce + ripple
```

#### Кнопки
```
Primary:   gradient-button, белый текст, radius-full, shadow-md
Secondary: border 1.5px solid var(--primary), прозрачный фон
Ghost:     без бордера, text-accent
FAB:       60x60, gradient-button, shadow-lg, radius-full
```

#### Нижний навбар
```
- Glass effect: backdrop-filter: blur(20px) + surface-glass
- 4 вкладки: Главная, Каталог, Корзина, Профиль
- Иконки: Lucide React (линейный стиль, 24px)
- Активная вкладка: primary цвет + filled icon + pill-indicator сверху
- Badge на корзине: error цвет + pulse animation
- Safe area padding снизу
```

---

## 3. ТЕХНИЧЕСКИЙ СТЕК

### Frontend
```
Framework:     Next.js 15 (App Router)
Language:      TypeScript 5.x (strict mode)
Styling:       Tailwind CSS 4 + CSS Variables (дизайн-токены выше)
State:         Zustand (глобальный) + React Query / TanStack Query (серверный)
Animations:    Framer Motion 11+
Icons:         Lucide React
Forms:         React Hook Form + Zod validation
PWA:           next-pwa (Serwist)
HTTP:          Axios с interceptors для JWT refresh
Images:        next/image с blur placeholder
```

### Backend
```
Framework:     Django 5.2+ (LTS)
API:           Django REST Framework 3.15+
Auth:          djangorestframework-simplejwt
Admin:         Django Unfold (современная красивая админка)
WebSocket:     Django Channels + Redis
Task Queue:    Celery + Redis (уведомления, отчёты)
Database:      PostgreSQL 16
Cache:         Redis 7
Storage:       S3-compatible (Cloudflare R2 / MinIO для dev)
Push:          Firebase Cloud Messaging (FCM)
Search:        PostgreSQL Full-Text Search (pg_trgm)
```

### DevOps
```
Containers:    Docker + Docker Compose
CI/CD:         GitHub Actions
Hosting:       Vercel (frontend) + Railway/VPS (backend)
```

---

## 4. АРХИТЕКТУРА ПРОЕКТА

### Структура репозитория

```
flower-shop/
├── docker-compose.yml
├── docker-compose.dev.yml
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── frontend/
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── public/
│   │   ├── manifest.json
│   │   ├── sw.js
│   │   ├── icons/          # PWA icons 192x192, 512x512
│   │   └── images/
│   └── src/
│       ├── app/
│       │   ├── layout.tsx           # RootLayout + providers
│       │   ├── page.tsx             # Главная
│       │   ├── catalog/
│       │   │   ├── page.tsx         # Каталог — категории
│       │   │   └── [categorySlug]/
│       │   │       ├── page.tsx     # Товары категории
│       │   │       └── [productSlug]/
│       │   │           └── page.tsx # Страница товара
│       │   ├── cart/
│       │   │   └── page.tsx         # Корзина
│       │   ├── checkout/
│       │   │   └── page.tsx         # Оформление заказа
│       │   ├── profile/
│       │   │   ├── page.tsx         # Профиль
│       │   │   ├── orders/
│       │   │   │   └── page.tsx     # Мои заказы
│       │   │   ├── favorites/
│       │   │   │   └── page.tsx     # Избранное
│       │   │   └── settings/
│       │   │       └── page.tsx     # Настройки
│       │   ├── bouquet-builder/
│       │   │   └── page.tsx         # Конструктор букетов
│       │   ├── auth/
│       │   │   ├── login/
│       │   │   │   └── page.tsx
│       │   │   └── register/
│       │   │       └── page.tsx
│       │   └── florist/             # Панель флориста (отдельный layout)
│       │       ├── layout.tsx
│       │       ├── page.tsx         # Дашборд флориста
│       │       ├── orders/
│       │       │   └── page.tsx     # Текущие заказы
│       │       └── tasks/
│       │           └── page.tsx     # Задачи на день
│       ├── components/
│       │   ├── ui/                  # Базовые UI-компоненты
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Badge.tsx
│       │   │   ├── Modal.tsx
│       │   │   ├── Skeleton.tsx
│       │   │   ├── BottomSheet.tsx
│       │   │   └── GlassCard.tsx
│       │   ├── layout/
│       │   │   ├── BottomNav.tsx
│       │   │   ├── Header.tsx
│       │   │   └── PageTransition.tsx
│       │   ├── product/
│       │   │   ├── ProductCard.tsx
│       │   │   ├── ProductGrid.tsx
│       │   │   └── CategoryCard.tsx
│       │   ├── cart/
│       │   │   ├── CartItem.tsx
│       │   │   └── CartSummary.tsx
│       │   ├── bouquet-builder/
│       │   │   ├── FlowerPicker.tsx
│       │   │   ├── WrapPicker.tsx
│       │   │   ├── PreviewCanvas.tsx
│       │   │   └── PhotoUploader.tsx
│       │   └── home/
│       │       ├── HeroBanner.tsx
│       │       ├── PopularProducts.tsx
│       │       ├── NewArrivals.tsx
│       │       └── BuildBouquetCTA.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useCart.ts
│       │   ├── useProducts.ts
│       │   └── useFavorites.ts
│       ├── stores/
│       │   ├── cartStore.ts
│       │   ├── authStore.ts
│       │   └── uiStore.ts
│       ├── lib/
│       │   ├── api.ts              # Axios instance + interceptors
│       │   ├── constants.ts
│       │   └── utils.ts
│       ├── types/
│       │   ├── product.ts
│       │   ├── order.ts
│       │   ├── user.ts
│       │   └── api.ts
│       └── styles/
│           └── globals.css          # CSS Variables + Tailwind
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   ├── config/
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── dev.py
│   │   │   └── prod.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   ├── wsgi.py
│   │   └── celery.py
│   ├── apps/
│   │   ├── users/
│   │   │   ├── models.py           # CustomUser, FloristProfile
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   ├── admin.py
│   │   │   └── permissions.py
│   │   ├── products/
│   │   │   ├── models.py           # Category, Product, ProductImage
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   ├── admin.py
│   │   │   └── filters.py
│   │   ├── orders/
│   │   │   ├── models.py           # Order, OrderItem, Delivery
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   ├── admin.py
│   │   │   ├── signals.py          # Уведомления при новом заказе
│   │   │   └── routing.py          # WebSocket маршруты
│   │   ├── stores/
│   │   │   ├── models.py           # Store (2 точки), StoreSchedule
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── admin.py
│   │   ├── inventory/
│   │   │   ├── models.py           # StockItem, StockMovement
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── admin.py
│   │   ├── tasks/
│   │   │   ├── models.py           # FloristTask, TaskAssignment
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── admin.py
│   │   ├── reports/
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── admin.py
│   │   │   └── generators.py       # Генерация отчётов
│   │   ├── bouquet_builder/
│   │   │   ├── models.py           # CustomBouquet, BouquetComponent
│   │   │   ├── serializers.py
│   │   │   └── views.py
│   │   └── notifications/
│   │       ├── models.py
│   │       ├── services.py         # FCM push service
│   │       └── tasks.py            # Celery tasks
│   └── utils/
│       ├── pagination.py
│       └── mixins.py
└── PLANNING.md                      # Этот файл
```

---

## 5. МОДЕЛИ ДАННЫХ

### Users (apps/users/models.py)

```python
class CustomUser(AbstractUser):
    """Пользователь системы"""
    ROLE_CHOICES = [
        ('client', 'Клиент'),
        ('florist', 'Флорист'),
        ('owner', 'Владелец'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    phone = models.CharField(max_length=20, unique=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    loyalty_card_number = models.CharField(max_length=20, blank=True)  # Скидочная карта
    loyalty_discount = models.DecimalField(max_digits=4, decimal_places=2, default=0)
    push_token = models.CharField(max_length=255, blank=True)  # FCM token

class FloristProfile(models.Model):
    """Профиль флориста — привязка к точке"""
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='florist_profile')
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE, related_name='florists')
    is_on_shift = models.BooleanField(default=False)
    specialization = models.CharField(max_length=100, blank=True)  # "Свадебные букеты"
```

### Products (apps/products/models.py)

```python
class Category(models.Model):
    """Категории: букеты, горшечные, шары, открытки, игрушки, сад, сувениры"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50)  # Lucide icon name
    image = models.ImageField(upload_to='categories/')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_popular = models.BooleanField(default=False)     # Показ на главной
    is_new = models.BooleanField(default=False)          # Новинка
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # Наличие по точкам
    store_availability = models.ManyToManyField('stores.Store', through='ProductAvailability')

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

class ProductAvailability(models.Model):
    """Наличие товара по каждой точке"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)
```

### Stores (apps/stores/models.py)

```python
class Store(models.Model):
    """Точка магазина (ровно 2 штуки)"""
    name = models.CharField(max_length=100)       # "Цветочная Лавка — Центр"
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    working_hours = models.JSONField()  # {"mon": {"open": "09:00", "close": "21:00"}, ...}
    is_active = models.BooleanField(default=True)
```

### Orders (apps/orders/models.py)

```python
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает'),
        ('accepted', 'Принят'),
        ('in_progress', 'В работе'),
        ('ready', 'Готов'),
        ('delivering', 'Доставляется'),
        ('completed', 'Завершён'),
        ('cancelled', 'Отменён'),
    ]
    DELIVERY_CHOICES = [
        ('pickup', 'Самовывоз'),
        ('delivery', 'Доставка'),
    ]

    customer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders')
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE, null=True, blank=True)
    # null для доставки — приходит на обе точки
    assigned_florist = models.ForeignKey(CustomUser, on_delete=models.SET_NULL,
                                         null=True, blank=True, related_name='assigned_orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    delivery_type = models.CharField(max_length=10, choices=DELIVERY_CHOICES)

    # Данные получателя
    recipient_name = models.CharField(max_length=100)
    recipient_phone = models.CharField(max_length=20)
    delivery_address = models.CharField(max_length=255, blank=True)  # для доставки
    delivery_date = models.DateField()
    delivery_time = models.TimeField()

    # Открытка
    include_card = models.BooleanField(default=False)
    card_text = models.TextField(blank=True)  # Пусто = открытка без текста

    # Суммы
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ЛОГИКА МАРШРУТИЗАЦИИ:
    # - Самовывоз: store заполнен → заказ уходит ТОЛЬКО этой точке
    # - Доставка: store = null → заказ уходит НА ОБЕ точки → кто быстрее принял

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
```

### Inventory (apps/inventory/models.py)

```python
class StockItem(models.Model):
    """Учёт товаров на складе по точкам"""
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    min_quantity = models.IntegerField(default=5)  # Порог для предупреждения

class StockMovement(models.Model):
    """История движения товаров"""
    TYPE_CHOICES = [
        ('in', 'Приход'),
        ('out', 'Расход'),
        ('transfer', 'Перемещение'),
        ('write_off', 'Списание'),
    ]
    stock_item = models.ForeignKey(StockItem, on_delete=models.CASCADE)
    movement_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    quantity = models.IntegerField()
    reason = models.CharField(max_length=255, blank=True)
    created_by = models.ForeignKey('users.CustomUser', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

### Tasks (apps/tasks/models.py)

```python
class FloristTask(models.Model):
    """Задача на день для флориста"""
    PRIORITY_CHOICES = [('low', 'Низкий'), ('medium', 'Средний'), ('high', 'Высокий')]

    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE)
    assigned_to = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    due_date = models.DateField()
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey('users.CustomUser', on_delete=models.SET_NULL,
                                    null=True, related_name='created_tasks')
    created_at = models.DateTimeField(auto_now_add=True)
```

### Bouquet Builder (apps/bouquet_builder/models.py)

```python
class BouquetComponent(models.Model):
    """Элементы для конструктора: цветы, зелень, обёртка, ленты"""
    TYPE_CHOICES = [
        ('flower', 'Цветок'),
        ('greenery', 'Зелень'),
        ('wrap', 'Обёртка'),
        ('ribbon', 'Лента'),
        ('accessory', 'Аксессуар'),
    ]
    name = models.CharField(max_length=100)
    component_type = models.CharField(max_length=15, choices=TYPE_CHOICES)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='components/')
    is_active = models.BooleanField(default=True)

class CustomBouquet(models.Model):
    """Пользовательский букет из конструктора ИЛИ по фото"""
    customer = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    # Вариант 1: конструктор
    components = models.ManyToManyField(BouquetComponent, through='CustomBouquetItem')
    # Вариант 2: фото-пример
    reference_photo = models.ImageField(upload_to='bouquet_references/', blank=True)
    customer_notes = models.TextField(blank=True)
    estimated_price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    is_approved = models.BooleanField(default=False)  # Одобрен флористом

class CustomBouquetItem(models.Model):
    bouquet = models.ForeignKey(CustomBouquet, on_delete=models.CASCADE)
    component = models.ForeignKey(BouquetComponent, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
```

---

## 6. API ENDPOINTS

### Auth
```
POST   /api/auth/register/          — Регистрация (phone + password)
POST   /api/auth/login/             — Логин → access + refresh tokens
POST   /api/auth/refresh/           — Обновить access token
POST   /api/auth/logout/            — Инвалидация refresh token
```

### Products
```
GET    /api/products/               — Список товаров (фильтры, пагинация)
GET    /api/products/:slug/         — Детали товара
GET    /api/products/popular/       — Популярные товары (is_popular=true)
GET    /api/products/new/           — Новинки (is_new=true)
GET    /api/categories/             — Список категорий
GET    /api/categories/:slug/       — Товары категории
```

### Cart & Orders
```
GET    /api/cart/                    — Корзина пользователя
POST   /api/cart/add/               — Добавить товар
PATCH  /api/cart/:id/               — Изменить количество
DELETE /api/cart/:id/               — Удалить из корзины
POST   /api/orders/                 — Создать заказ
GET    /api/orders/                 — Мои заказы
GET    /api/orders/:id/             — Детали заказа
```

### Bouquet Builder
```
GET    /api/bouquet/components/     — Компоненты конструктора
POST   /api/bouquet/custom/         — Создать букет (конструктор)
POST   /api/bouquet/from-photo/     — Создать запрос по фото
```

### Profile
```
GET    /api/profile/                — Профиль пользователя
PATCH  /api/profile/                — Обновить профиль
DELETE /api/profile/                — Удалить аккаунт
GET    /api/profile/favorites/      — Избранное
POST   /api/profile/favorites/:id/  — Добавить в избранное
DELETE /api/profile/favorites/:id/  — Удалить из избранного
```

### Florist Panel
```
GET    /api/florist/orders/          — Заказы для точки флориста
POST   /api/florist/orders/:id/accept/   — Принять заказ
POST   /api/florist/orders/:id/reject/   — Отклонить
POST   /api/florist/orders/:id/contact/  — Связаться с клиентом
PATCH  /api/florist/orders/:id/status/   — Обновить статус
GET    /api/florist/tasks/           — Задачи на день
PATCH  /api/florist/tasks/:id/       — Отметить выполнение
```

### Stores
```
GET    /api/stores/                  — Список точек (адреса, часы)
```

### WebSocket
```
ws://  /ws/orders/                   — Real-time обновления заказов
ws://  /ws/florist/:store_id/        — Уведомления для конкретной точки
```

---

## 7. ЭКРАНЫ ПРИЛОЖЕНИЯ — ДЕТАЛЬНОЕ ОПИСАНИЕ

### 7.1 Главная страница (/)

**Hero Banner:**
- Полноэкранный слайдер с gradient overlay
- Текст: «Цветочная Лавка» шрифтом Playfair Display
- Подтекст: «Свежие букеты с доставкой» шрифтом Inter
- CTA-кнопка «Выбрать букет» → /catalog

**Блок «Собрать свой букет»:**
- Красивый CTA-баннер с фоновым изображением
- Два варианта:
  1. **«Собрать в конструкторе»** → /bouquet-builder
  2. **«Прикрепить фото»** → модальное окно с загрузкой фото + поле для пожеланий
- Анимация: parallax при скролле

**Популярные товары:**
- Горизонтальный скролл карточек с snap-scroll
- Карточка: фото (1:1), название, цена (если скидка — зачёркнутая цена + новая), кнопка сердечко (избранное)
- Заголовок: «Популярное» + кнопка «Все →»

**Новинки:**
- Аналогичный горизонтальный скролл
- Badge «NEW» на карточках с анимацией shimmer
- Заголовок: «Новинки» + кнопка «Все →»

### 7.2 Каталог (/catalog)

**Сетка категорий:**
- 2 карточки в ряд, grid gap: 12px
- Каждая карточка: квадратное фото с glass overlay + название + иконка
- Категории: Букеты, Горшечные растения, Шары, Открытки, Мягкие игрушки, Садовые принадлежности, Сувениры
- Анимация входа: stagger (каждая карточка появляется с задержкой)

**Страница категории (/catalog/:slug):**
- Заголовок категории + количество товаров
- Фильтры: цена (range slider), сортировка (популярные, новые, цена ↑, цена ↓)
- Карточки по 2 в ряд (ProductGrid)
- Карточка товара:
  - Фото (1:1) с lazy loading + blur placeholder
  - Название (Inter, 14px, medium)
  - Цена (Cormorant Garamond, 18px, bold)
  - Кнопка «🤍» — добавить в избранное
  - Кнопка «В корзину» — primary, radius-full
- Бесконечный скролл (intersection observer)
- Skeleton loader при загрузке

### 7.3 Страница товара (/catalog/:category/:product)

- Галерея фото (swiper/карусель, dots pagination)
- Название (Playfair Display, 24px)
- Цена (Cormorant Garamond, 28px, primary color)
- Описание
- Наличие по точкам (иконки точек)
- Кнопка «В корзину» — full-width, sticky bottom
- Кнопка «❤️ В избранное»
- «Похожие товары» — горизонтальный скролл

### 7.4 Корзина (/cart)

**Список товаров:**
- Карточка: мини-фото + название + цена × кол-во + stepper (+/-)
- Свайп влево → удалить (с анимацией)
- Пустая корзина → иллюстрация + кнопка «В каталог»

**Итого:**
- Подытог, скидка (если есть), доставка, итого
- Кнопка «Оформить заказ» → /checkout

### 7.5 Оформление заказа (/checkout)

**Форма (данные заказчика автозаполнены из профиля):**
1. **Имя заказчика** — из профиля (readonly, можно изменить)
2. **Телефон заказчика** — из профиля
3. **Способ получения:**
   - Самовывоз → выбор точки (Radio: Точка 1 / Точка 2 с адресами)
   - Доставка → поле адреса
4. **Дата и время** — date picker + time picker
5. **Данные получателя:**
   - Имя получателя
   - Телефон получателя
6. **Открытка:**
   - Toggle «Добавить открытку»
   - Если включено:
     - Radio: «С текстом» / «Без текста»
     - Если «С текстом» → textarea для текста открытки
7. **Итого** — финальная сумма
8. **Кнопка «Подтвердить заказ»**

**Логика маршрутизации заказа:**
```
ЕСЛИ самовывоз:
  → store = выбранная_точка
  → WebSocket уведомление ТОЛЬКО флористам этой точки

ЕСЛИ доставка:
  → store = null
  → WebSocket уведомление ОБЕИМ точкам
  → Кто первый нажимает «Принять» — тому присваивается заказ
  → Вторая точка видит «Заказ принят другой точкой»
```

### 7.6 Профиль (/profile)

**Шапка:**
- Аватарка (круглая, 80px, border: primary)
- Имя, телефон
- Номер скидочной карты (красиво оформленный)

**Меню:**
- 📦 Мои заказы → /profile/orders
- ❤️ Избранное → /profile/favorites
- ⚙️ Настройки → /profile/settings

**Мои заказы (/profile/orders):**
- Список заказов с статусами (chips с цветами статусов)
- При нажатии → детали: состав, статус, время, адрес, трекинг

**Избранное (/profile/favorites):**
- Сетка 2 в ряд (как каталог)
- Можно сразу добавить в корзину

**Настройки (/profile/settings):**
- Сменить аватарку (загрузка + crop)
- Сменить имя
- Сменить номер телефона (с подтверждением по SMS)
- ⚠️ Удалить профиль (с confirmation modal)

### 7.7 Конструктор букетов (/bouquet-builder)

**Два варианта на входе:**

**Вариант А — Конструктор:**
- Шаг 1: Выбор цветов (карточки с фото, +/- количество, цена)
- Шаг 2: Выбор зелени
- Шаг 3: Выбор обёртки (radio с preview)
- Шаг 4: Выбор ленты / аксессуаров
- Шаг 5: Предпросмотр (коллаж/список выбранного + общая сумма)
- Шаг 6: «Добавить в корзину»
- Progress bar сверху (6 шагов)
- Анимация перехода между шагами (slide)

**Вариант Б — По фото:**
- Загрузка фото (drag & drop / camera / gallery)
- Textarea для пожеланий
- Кнопка «Отправить запрос»
- Флорист получает уведомление, оценивает, называет цену
- Клиент подтверждает или отклоняет

---

## 8. ПАНЕЛЬ ФЛОРИСТА (/florist/*)

> **Отдельный интерфейс**, не пересекается с клиентским приложением.
> Доступ только для пользователей с role='florist'.

### 8.1 Дашборд (/florist/)
- Статистика дня: заказов принято, в работе, завершено
- Быстрые действия

### 8.2 Заказы (/florist/orders)

**Новые заказы:**
- Карточка заказа: номер, состав, время доставки, тип (самовывоз/доставка)
- Три кнопки:
  - ✅ **Принять** — заказ закрепляется за флористом
  - ❌ **Отклонить** — с указанием причины
  - 📞 **Связаться** — открыть чат/звонок клиенту
- Для заказов доставки: если другая точка уже приняла → показать «Принят точкой [Название]»
- Real-time через WebSocket

**Текущие заказы:**
- Список активных заказов со статусами
- Можно менять статус: Принят → В работе → Готов → Доставляется → Завершён
- Каждая смена статуса → push-уведомление клиенту

### 8.3 Задачи на день (/florist/tasks)
- Список задач на сегодня (от владельца через админку)
- Checkbox — отметить выполнение
- Приоритет: цветовая маркировка (low/medium/high)
- Push-уведомление при назначении новой задачи

---

## 9. DJANGO АДМИНКА (только для владельца)

### Используй Django Unfold
Django Unfold — это современный UI для Django Admin с Tailwind CSS.
Обращайся к Context7 за документацией.

### 9.1 Управление товарами
- Добавление, редактирование, удаление товаров
- Массовые действия: деактивировать, пометить популярным, пометить новинкой
- Inline для ProductImage (загрузка нескольких фото)
- Фильтры: категория, статус, наличие по точкам

### 9.2 Отчёты
- **Ежедневный:** выручка, количество заказов, средний чек, топ товаров
- **Ежемесячный:** всё из ежедневного + динамика, сравнение с предыдущим месяцем
- **Квартальный:** тренды, сезонность, прогнозы
- **По выбранным датам:** произвольный диапазон
- Экспорт в Excel (xlsx)
- Графики: Chart.js или Plotly (через django-unfold charts)

### 9.3 Склад (Inventory)
- Текущие остатки по каждой точке
- Приход/расход/перемещение/списание
- Предупреждения при остатке < min_quantity
- История движений

### 9.4 Графики работы флористов
- Календарный вид (по неделям)
- Назначение смен по точкам
- Просмотр кто работает сегодня

### 9.5 Планировщик задач
- Создание задач для конкретного флориста
- Выбор приоритета и даты
- При создании → push-уведомление флористу
- Отслеживание выполнения

### 9.6 Управление заказами
- Все заказы с фильтрами (статус, точка, дата, клиент)
- Возможность ручного изменения статуса
- Детали: состав, клиент, получатель, адрес, открытка

---

## 10. КЛЮЧЕВЫЕ ТЕХНИЧЕСКИЕ РЕШЕНИЯ

### PWA Configuration

```json
// manifest.json
{
  "name": "Цветочная Лавка",
  "short_name": "Цветочная",
  "description": "Свежие цветы и букеты с доставкой",
  "theme_color": "#D4A5A5",
  "background_color": "#FFF9F5",
  "display": "standalone",
  "orientation": "portrait",
  "start_url": "/",
  "scope": "/",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### JWT Auth Flow
```
1. Регистрация/Логин → access (15 min) + refresh (7 days)
2. Axios interceptor: при 401 → автоматически refresh → retry
3. Refresh истёк → редирект на /auth/login
4. Access хранить в памяти (Zustand), refresh — httpOnly cookie
```

### WebSocket для заказов
```python
# Django Channels — consumer для флористов
class OrderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.store_id = self.scope['url_route']['kwargs']['store_id']
        self.group_name = f'store_{self.store_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def new_order(self, event):
        await self.send(text_data=json.dumps(event['order']))

# При создании заказа:
# - Самовывоз → channel_layer.group_send(f'store_{order.store_id}', ...)
# - Доставка → channel_layer.group_send('store_1', ...) + channel_layer.group_send('store_2', ...)
```

### Уведомления (Celery + FCM)
```python
# tasks.py
@shared_task
def send_push_notification(user_id, title, body):
    user = CustomUser.objects.get(id=user_id)
    if user.push_token:
        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            token=user.push_token,
        )
        messaging.send(message)

# Триггеры:
# - Новый заказ → флористам
# - Смена статуса → клиенту
# - Новая задача → флористу
# - Низкий остаток → владельцу
```

---

## 11. ПОРЯДОК РАЗРАБОТКИ (ФАЗЫ)

### Фаза 1: Фундамент
- [ ] Инициализация Next.js 15 + TypeScript + Tailwind 4
- [ ] Инициализация Django 5.2 + DRF + PostgreSQL
- [ ] Docker Compose (frontend + backend + postgres + redis)
- [ ] Дизайн-система: CSS variables, базовые компоненты (Button, Card, Input, GlassCard)
- [ ] Модели данных + миграции
- [ ] JWT аутентификация (register, login, refresh)
- [ ] PWA: manifest.json, service worker, icons

### Фаза 2: Каталог и товары
- [ ] API: категории, товары, фильтры, пагинация
- [ ] Главная страница: hero, популярные, новинки, CTA конструктора
- [ ] Каталог: сетка категорий
- [ ] Страница категории: карточки товаров 2 в ряд + фильтры
- [ ] Страница товара: галерея, описание, в корзину
- [ ] Избранное (клиент)

### Фаза 3: Корзина и заказы
- [ ] Корзина: CRUD, stepper, свайп-удаление
- [ ] Оформление заказа: форма со всеми полями
- [ ] Логика маршрутизации: самовывоз → одна точка, доставка → обе
- [ ] API заказов + WebSocket для real-time
- [ ] Push-уведомления (FCM)

### Фаза 4: Конструктор букетов
- [ ] API компонентов конструктора
- [ ] 6-шаговый wizard (цветы → зелень → обёртка → лента → preview → корзина)
- [ ] Вариант «по фото»: загрузка + пожелания
- [ ] Согласование с флористом (цена, подтверждение)

### Фаза 5: Профиль
- [ ] Страница профиля с аватаркой и скидочной картой
- [ ] Мои заказы с детализацией и статусами
- [ ] Избранное (grid 2 в ряд)
- [ ] Настройки: avatar upload + crop, смена имени/телефона, удаление аккаунта

### Фаза 6: Панель флориста
- [ ] Авторизация по роли (role='florist')
- [ ] Новые заказы: принять / отклонить / связаться
- [ ] Текущие заказы: смена статусов
- [ ] Задачи на день: список + checkbox
- [ ] WebSocket: real-time получение заказов по точке
- [ ] Логика «кто быстрее принял» для доставки

### Фаза 7: Django админка (владелец)
- [ ] Django Unfold — настройка красивой админки
- [ ] CRUD товаров с inline-фото
- [ ] Отчёты: ежедневные, ежемесячные, квартальные, по датам + экспорт
- [ ] Склад: остатки, движения, предупреждения
- [ ] Графики работы флористов (календарь)
- [ ] Планировщик задач с push-уведомлениями

### Фаза 8: Финализация
- [ ] Анимации (Framer Motion): переходы страниц, появление карточек, micro-interactions
- [ ] SEO: meta tags, OG tags, structured data
- [ ] Тестирование: unit + integration
- [ ] Performance: Lighthouse 90+, Core Web Vitals
- [ ] Security: CORS, rate limiting, input sanitization
- [ ] Deploy: CI/CD через GitHub Actions

---

## 12. ДОПОЛНИТЕЛЬНЫЕ РЕКОМЕНДАЦИИ

### Что использовать для Context7
При разработке обращайся к Context7 для актуальной документации:
- `next.js` — App Router, Server Components, API Routes
- `django` — models, views, admin
- `django-rest-framework` — serializers, viewsets, permissions
- `tailwindcss` — утилиты, кастомная конфигурация
- `framer-motion` — анимации, transitions, gestures
- `zustand` — state management
- `tanstack-query` — серверный стейт, кэширование
- `django-unfold` — кастомизация админки
- `django-channels` — WebSocket

### Важные детали
1. **Все изображения** — через next/image с blur placeholder и lazy loading
2. **Скелетоны** — на каждом экране при загрузке данных
3. **Error boundaries** — graceful error handling
4. **Offline mode** — PWA service worker кэширует каталог
5. **Responsive** — mobile-first, но корректно на планшетах
6. **Accessibility** — aria-labels, keyboard navigation, focus management
7. **i18n ready** — все строки через constants (на будущее)

---

*Этот документ является полным техническим заданием. При разработке следуй фазам последовательно, используй Context7 для документации, и придерживайся дизайн-системы.*
