import os
from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = os.environ.get("SECRET_KEY", "django-insecure-CHANGE-ME-IN-PROD")

DEBUG = False

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

INSTALLED_APPS = [
    # Django Unfold
    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.forms",
    "unfold.contrib.import_export",
    "unfold.contrib.guardian",
    "unfold.contrib.simple_history",

    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_filters",
    "drf_spectacular",
    "channels",
    "import_export",

    # Local apps
    "apps.users",
    "apps.stores",
    "apps.products",
    "apps.orders",
    "apps.inventory",
    "apps.tasks",
    "apps.bouquet_builder",
    "apps.stories",
]

AUTH_USER_MODEL = "users.CustomUser"

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# Database
# Defined in dev.py / prod.py

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
LANGUAGE_CODE = "ru-ru"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# DRF
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "500/hour",
        "user": "5000/hour",
    },
}

# CORS
CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",")
CORS_ALLOW_CREDENTIALS = True

# Security
SECURE_SSL_REDIRECT = os.environ.get("DJANGO_SECURE", "False") == "True"
SESSION_COOKIE_SECURE = os.environ.get("DJANGO_SECURE", "False") == "True"
CSRF_COOKIE_SECURE = os.environ.get("DJANGO_SECURE", "False") == "True"
SECURE_HSTS_SECONDS = 31536000 if os.environ.get("DJANGO_SECURE", "False") == "True" else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = os.environ.get("DJANGO_SECURE", "False") == "True"
SECURE_HSTS_PRELOAD = os.environ.get("DJANGO_SECURE", "False") == "True"

# JWT
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

# Unfold
UNFOLD = {
    "SITE_TITLE": "Flower Shop Admin",
    "SITE_HEADER": "Flower Shop",
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": False,
        "navigation": [
            {
                "title": "Аналитика",
                "separator": True,
                "items": [
                    {
                        "title": "Дашборд",
                        "icon": "dashboard",
                        "link": "/admin/",
                    },
                ],
            },
            {
                "title": "Каталог",
                "separator": True,
                "items": [
                    {"title": "Товары", "icon": "shopping_bag", "link": "/admin/products/product/"},
                    {"title": "Категории", "icon": "category", "link": "/admin/products/category/"},
                    {"title": "Конструктор", "icon": "build", "link": "/admin/bouquet_builder/bouquetcomponent/"},
                    {"title": "Истории", "icon": "auto_stories", "link": "/admin/stories/story/"},
                ],
            },
            {
                "title": "Продажи",
                "separator": True,
                "items": [
                    {"title": "Заказы", "icon": "shopping_cart", "link": "/admin/orders/order/"},
                    {"title": "Клиенты", "icon": "people", "link": "/admin/users/customuser/"},
                ],
            },
            {
                "title": "Точки и Персонал",
                "separator": True,
                "items": [
                    {"title": "Магазины", "icon": "store", "link": "/admin/stores/store/"},
                    {"title": "Флористы", "icon": "badge", "link": "/admin/users/floristprofile/"},
                    {"title": "График работы", "icon": "calendar_month", "link": "/admin/users/floristschedule/"},
                    {"title": "Задачи", "icon": "task", "link": "/admin/tasks/floristtask/"},
                ],
            },
            {
                "title": "Склад",
                "separator": True,
                "items": [
                    {"title": "Остатки", "icon": "inventory_2", "link": "/admin/inventory/stockitem/"},
                    {"title": "Движения", "icon": "history", "link": "/admin/inventory/stockmovement/"},
                ],
            },
            {
                "title": "Система",
                "separator": True,
                "items": [
                    {"title": "Группы", "icon": "group", "link": "/admin/auth/group/"},
                    {"title": "Настройки доставки", "icon": "settings", "link": "/admin/orders/deliverysettings/1/change/"},
                    {"title": "Глобальные настройки", "icon": "tune", "link": "/admin/orders/globalsettings/1/change/"},
                ],
            },
        ],
    },
    "DASHBOARD_CALLBACK": "apps.dashboard.dashboard_callback",
}

# Celery
CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", "redis://redis:6379/0")
CELERY_RESULT_BACKEND = os.environ.get("CELERY_RESULT_BACKEND", "redis://redis:6379/0")

# Logging
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "[{asctime}] {levelname} {name} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": os.environ.get("LOG_LEVEL", "WARNING"),
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": os.environ.get("DJANGO_LOG_LEVEL", "WARNING"),
            "propagate": False,
        },
        "apps": {
            "handlers": ["console"],
            "level": os.environ.get("LOG_LEVEL", "INFO"),
            "propagate": False,
        },
    },
}

