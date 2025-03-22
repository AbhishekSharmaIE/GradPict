from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Memory

User = get_user_model()

class MemoryTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.client.force_authenticate(user=self.user)
        
        # Create a test memory
        self.memory = Memory.objects.create(
            user=self.user,
            title='Test Memory',
            content='Test Content',
            privacy='public'
        )

    def test_create_memory(self):
        data = {
            'title': 'New Memory',
            'content': 'New Content',
            'privacy': 'private'
        }
        response = self.client.post('/api/memories/create/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Memory.objects.count(), 2)

    def test_list_memories(self):
        response = self.client.get('/api/memories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_memory(self):
        data = {'title': 'Updated Memory'}
        response = self.client.patch(f'/api/memories/{self.memory.id}/update/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.memory.refresh_from_db()
        self.assertEqual(self.memory.title, 'Updated Memory')

    def test_delete_memory(self):
        response = self.client.delete(f'/api/memories/{self.memory.id}/delete/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Memory.objects.count(), 0)
