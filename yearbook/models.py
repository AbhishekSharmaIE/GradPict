from django.db import models
from django.contrib.auth import get_user_model

class Memory(models.Model):
    PRIVACY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]

    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.ImageField(upload_to='memories/', blank=True, null=True)
    privacy = models.CharField(max_length=7, choices=PRIVACY_CHOICES, default='public')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
