from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Scrapbook, Profile, UniversityBranding, ScrapbookImage

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class ScrapbookImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScrapbookImage
        fields = ('id', 'image', 'created_at')

class ScrapbookSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    images = ScrapbookImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Scrapbook
        fields = ('id', 'title', 'content', 'type', 'privacy', 'user', 'images', 'created_at', 'updated_at')
        read_only_fields = ('user', 'created_at', 'updated_at')

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = ('id', 'user', 'bio', 'graduation_year', 'major', 'profile_picture')

class UniversityBrandingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniversityBranding
        fields = ('id', 'name', 'logo', 'primary_color', 'secondary_color')
