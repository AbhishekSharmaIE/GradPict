from django.apps import AppConfig


class YearbookConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'yearbook'

    def ready(self):
        try:
            import yearbook.signals
        except ImportError:
            pass
