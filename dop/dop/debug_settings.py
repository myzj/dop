import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

# DATABASES = {
#     'default': {
#         #'ENGINE': 'django.db.backends.sqlite3',#
#         #'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'myzj',
#         'USER':'root',
#         'PASSWORD':'111222',
#         'HOST':'127.0.0.1',
#         'PORT':'3306',
#     }
# }

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'postdb',
#         'USER': 'root',
#         'PASSWORD': '123456',
#         'HOST': '192.168.60.84',
#         'PORT': 3306,
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'dop',
        'USER': 'db_dev',
        'PASSWORD': 'db_dev',
        'HOST': '192.168.100.160',
        'PORT': 3306,
    }
}

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'postdb',
#         'USER': 'root',
#         'PASSWORD': '111222',
#         'HOST': '127.0.0.1',
#         'PORT': 3306,
#     }
# }
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, "static")
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "web/static"),
)