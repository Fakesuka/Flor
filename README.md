# Flor — интернет‑магазин цветов

`Flor` — full-stack проект цветочного магазина с клиентской витриной, каталогом, корзиной, оформлением заказов, конструктором букетов и рабочими экранами для флориста.

## Что есть в репозитории

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS 4.
- **Backend**: Django 5 + Django REST Framework + JWT auth.
- **Инфраструктура**: Docker Compose (frontend, backend, PostgreSQL, Redis).
- **Админка**: Django Admin (Unfold) с разделами каталога, заказов, склада и персонала.

## Структура проекта

```text
.
├── frontend/      # Next.js приложение
├── backend/       # Django API и админ-панель
├── docker-compose.yml
└── README.md
```

## Основной функционал

### Клиентская часть
- Главная страница, каталог и карточки товаров.
- Избранное, корзина и оформление заказа.
- Регистрация/вход и профиль пользователя.
- Просмотр stories.
- Конструктор букета.
- Страницы для флористов: `/florist` и `/florist2`.

### Серверная часть
- JWT-аутентификация (`/api/auth/*`).
- API каталога (`/api/categories`, `/api/products`).
- API заказов и задач флористов (`/api/orders`, `/api/florist-tasks`).
- API конструктора букетов (`/api/builder/components`, `/api/builder/bouquets`).
- API stories (`/api/stories`).
- Django Admin (`/admin/`).

## Быстрый старт (Docker)

### 1) Требования
- Docker + Docker Compose

### 2) Запуск
Из корня проекта:

```bash
docker compose up --build
```

После запуска сервисы будут доступны:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Админка: http://localhost:8000/admin

### 3) Миграции и суперпользователь
В отдельном терминале:

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

## Локальный запуск без Docker

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

По умолчанию backend использует `config.settings.dev` и SQLite.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Переменные окружения

Минимально полезные переменные:

### Backend
- `SECRET_KEY`
- `ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`
- `DJANGO_SECURE`
- `LOG_LEVEL`

### Frontend
- `NEXT_PUBLIC_API_URL` (по умолчанию: `http://localhost:8000/api`)

> В `docker-compose.yml` у frontend и backend указан `env_file: .env`, поэтому удобно создать `.env` в корне проекта.

## Полезные команды

### Backend
```bash
python manage.py check
python manage.py makemigrations
python manage.py migrate
```

### Frontend
```bash
npm run dev
npm run build
npm run lint
```

## Технологии

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Zustand, React Query.
- **Backend**: Django, DRF, SimpleJWT, django-filter, drf-spectacular, Channels.
- **Data/infra**: PostgreSQL, Redis, Docker Compose.

## Деплой

Ниже — базовый сценарий, чтобы быстро развернуть проект: **frontend на Vercel**, **backend и сервисы на Railway**.

### 1) Backend на Railway

1. Создайте новый проект в Railway и подключите репозиторий.
2. Добавьте сервис для backend из папки `backend/`.
3. Добавьте в проект Railway:
   - PostgreSQL plugin;
   - Redis plugin.
4. Укажите переменные окружения для backend-сервиса:
   - `SECRET_KEY`;
   - `DJANGO_SETTINGS_MODULE=config.settings.base` (или отдельные production settings, если добавите);
   - `ALLOWED_HOSTS=<railway-domain>`;
   - `CORS_ALLOWED_ORIGINS=https://<your-vercel-domain>`;
   - `DJANGO_SECURE=True`;
   - `DATABASE_URL` (обычно Railway подставляет автоматически для PostgreSQL);
   - `CELERY_BROKER_URL` и `CELERY_RESULT_BACKEND` на Redis.
5. Команда запуска backend (пример):

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

6. После первого деплоя выполните миграции:

```bash
python manage.py migrate
python manage.py createsuperuser
```

> Примечание: в текущем проекте есть `dev.py` со SQLite для разработки. Для production рекомендуется выделить отдельный `prod.py` (PostgreSQL, безопасные настройки, статика/медиа).

### 2) Frontend на Vercel

1. Импортируйте репозиторий в Vercel.
2. В настройках проекта укажите Root Directory: `frontend`.
3. Добавьте переменную окружения:
   - `NEXT_PUBLIC_API_URL=https://<your-railway-backend-domain>/api`
4. Выполните деплой (Vercel сделает build автоматически).

### 3) Проверка после деплоя

- Откройте frontend-домен Vercel и проверьте:
  - главную страницу;
  - каталог и карточку товара;
  - страницы флористов: `/florist` и `/florist2`;
  - авторизацию и запросы к API.
- Проверьте backend-домен Railway:
  - `/admin/`;
  - основные API-эндпоинты `/api/*`.

---
Если нужно, могу дополнить README разделами:
- деплой (production);
- наполненный `.env.example`;
- сиды/демо-данные;
- OpenAPI/Swagger и примеры API-запросов.
