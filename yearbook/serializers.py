from rest_framework import serializers
from .models import Scrapbook, Profile, UniversityBranding, ScrapbookImage

class ScrapbookImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScrapbookImage
        fields = ['id', 'image', 'caption', 'created_at']

class ScrapbookSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    recipient_name = serializers.ReadOnlyField(source='recipient.username')
    images = ScrapbookImageSerializer(many=True, read_only=True)
    like_count = serializers.SerializerMethodField()

    class Meta:
        model = Scrapbook
        fields = ['id', 'user', 'recipient', 'recipient_name', 'title', 'content',
                 'university', 'graduation_year', 'scrap_type', 'images', 'tags',
                 'location', 'privacy', 'like_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_like_count(self, obj):
        return obj.likes.count()

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'user', 'bio', 'created_at']

class UniversityBrandingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniversityBranding
        fields = '__all__'
