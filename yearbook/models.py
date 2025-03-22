from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator
import uuid

User = get_user_model()

class UniversityBranding(models.Model):
    name = models.CharField(max_length=200, unique=True)
    logo = models.ImageField(upload_to='university_logos/')
    banner = models.ImageField(upload_to='university_banners/', blank=True, null=True)
    primary_color = models.CharField(max_length=7, default='#000000')
    secondary_color = models.CharField(max_length=7, default='#FFFFFF')
    accent_color = models.CharField(max_length=7, default='#000000')
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    email_domain = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class ScrapbookImage(models.Model):
    image = models.ImageField(
        upload_to='scrapbook/',
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif'])]
    )
    caption = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.caption or f"Image {self.id}"

class Scrapbook(models.Model):
    PRIVACY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
        ('university', 'University Only'),
        ('friends', 'Friends Only')
    ]

    TYPE_CHOICES = [
        ('memory', 'Memory'),
        ('achievement', 'Achievement'),
        ('event', 'Event'),
        ('scrap', 'Scrap Message'),
        ('photo', 'Photo Album')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='authored_scraps')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_scraps', null=True, blank=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    university = models.CharField(max_length=100)
    graduation_year = models.CharField(max_length=4)
    scrap_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='memory')
    images = models.ManyToManyField(ScrapbookImage, blank=True)
    tags = models.CharField(max_length=500, blank=True)
    location = models.CharField(max_length=200, blank=True)
    privacy = models.CharField(max_length=10, choices=PRIVACY_CHOICES, default='public')
    likes = models.ManyToManyField(User, related_name='liked_scraps', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
