from datetime import timedelta
from pathlib import Path
import os
from dotenv import load_dotenv


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv()

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["127.0.0.1", "localhost"]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'api',
    'models',
    'base',
    'authentication',
    'corsheaders',
    "drf_spectacular",
    "drf_spectacular_sidecar"
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    "https://nganiriza-0x9y.onrender.com",
]


CORS_ALLOW_CREDENTIALS = True



# CORS_ALLOWED_ORIGIN_REGEXES = [
#     r"^https?://(?:.*\.)?csrlimited\.com$",
#     r"^https?://(?:.*\.)?canteen\.csrlimited\.com$",
# ]


ROOT_URLCONF = 'core.urls'

# CSRF_TRUSTED_ORIGINS = ["https://csr-canteen-backend.onrender.com", "https://cbo-api.csrlimited.com"]

CORS_ALLOW_METHODS = [
    'GET', 
    'POST', 
    'PUT', 
]

CORS_ALLOW_HEADERS = [
    'content-type',
    'x-requested-with',
    'authorization',
    'accept',
    'accept-encoding',
    'origin',
    'user-agent',
    'dont',
    'cache-control',
    'x-csrftoken',
    'x-requested-with',
    'x-xsrftoken',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Africa/Kigali'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        # "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}


REST_FRAME_SIMPLEJWT = {
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.RefreshToken",),
    "DEFAULT_THROTTLE_CLASSES": ["rest_framework.throttling.UserRateThrottle"],
    "DEFAULT_THROTTLE_RATES": {"user": "60/min"},
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": None,
    "AUTH_HEADER_TYPES": ("Bearer",),
     'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    'TOKEN_TYPE_CLAIM': 'token_type',
}


SPECTACULAR_SETTINGS = {
    "TITLE": "Nganiriza API",
    "DESCRIPTION": "Conversational AI + SRH education endpoints (auth, profiles, conversations, messages, articles).",
    "VERSION": "1.0.0",
    # "SERVERS": [{"url": "/api", "description": "Default API root"}],
    "CONTACT": {"name": "NGANIRIZA", "email": "munezeroeliane761@gmail.com"},
    "LICENSE": {"name": "Proprietary"},
    "SERVICE_INCLUDE_SCHEMA": False,
    # Auth buttons in the UI:
    "SECURITY": [{"BearerAuth": []}],
    "COMPONENT_SPLIT_REQUEST": True,  
    # "SCHEMA_PATH_PREFIX": r"/api",   
    # Optional: show enum names instead of raw values
    "ENUM_NAME_OVERRIDES": { },
    "SERVE_PERMISSIONS": ["rest_framework.permissions.AllowAny"],
    "APPEND_COMPONENTS": {
        "securitySchemes": {
            "BearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT"
            }
        }
    },
}


SPECTACULAR_SETTINGS["AUTHENTICATION_WHITELIST"] = [
    # "rest_framework.authentication.SessionAuthentication",
    "rest_framework_simplejwt.authentication.JWTAuthentication",
]
SPECTACULAR_SETTINGS["COMPONENTS"] = {
    "securitySchemes": {
        "BearerAuth": {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"}
    }
}

# Email configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# Fix default host typo and provide sensible defaults
EMAIL_HOST = os.getenv("EMAIL_HOST", 'localhost')
EMAIL_PORT = int(os.getenv("EMAIL_PORT", '587'))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
# Ensure a default from email to avoid None errors
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", EMAIL_HOST_USER or 'no-reply@localhost')


# AI Model Configuration
AI_MODEL_PATH = os.path.join(BASE_DIR, 'models', 'qwen2.5-0.5b-instruct-q5_k_m.gguf')
AI_MODEL_CONTEXT_SIZE = 4096
AI_MODEL_MAX_TOKENS = 512
AI_MODEL_TEMPERATURE = 0.7
AI_MODEL_N_GPU_LAYERS = 0


# Cache settings for offline capability
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'ai_response_cache',
        'TIMEOUT': None,  # Cache forever unless manually cleared
    }
}
