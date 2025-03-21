from rest_framework import serializers
from .models import Memory

class MemorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Memory
        fields = ['id', 'title', 'content', 'image', 'privacy', 'created_at']  # Exclude 'user' field
