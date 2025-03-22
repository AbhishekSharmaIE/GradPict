from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator
import uuid
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

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
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    university = models.CharField(max_length=100, null=True, blank=True)
    course = models.CharField(max_length=100, null=True, blank=True)
    graduation_year = models.IntegerField(null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    interests = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s profile"

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

    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_public = models.BooleanField(default=True)
    university = models.CharField(max_length=100, null=True, blank=True)
    graduation_year = models.IntegerField(null=True, blank=True)
    scrap_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='memory')
    tags = models.CharField(max_length=500, blank=True)
    location = models.CharField(max_length=200, blank=True)
    privacy = models.CharField(max_length=10, choices=PRIVACY_CHOICES, default='public')
    likes = models.ManyToManyField(User, related_name='liked_scraps', blank=True)

    def __str__(self):
        return self.title

class ScrapbookImage(models.Model):
    scrapbook = models.ForeignKey(Scrapbook, related_name='scrapbook_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='scrapbook_images/')
    caption = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.scrapbook.title}"
