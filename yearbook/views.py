# views.py
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .models import Memory
from .serializers import MemorySerializer


# This view will allow authenticated users to create memories
class MemoryCreateView(generics.CreateAPIView):
    queryset = Memory.objects.all()
    serializer_class = MemorySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set the logged-in user
        serializer.save(user=self.request.user)

class MemoryUpdateView(generics.UpdateAPIView):
    queryset = Memory.objects.all()
    serializer_class = MemorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Memory.objects.filter(user=self.request.user)


# This view will return a list of all public memories and the memories of the currently logged-in user
class MemoryListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated
    serializer_class = MemorySerializer

    def get_queryset(self):
        user = self.request.user
        # Return memories that are public or belong to the currently authenticated user
        return Memory.objects.filter(privacy='public') | Memory.objects.filter(user=user)


# Create view for deleting memory
class MemoryDeleteView(generics.DestroyAPIView):
    queryset = Memory.objects.all()
    serializer_class = MemorySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Ensure the object belongs to the currently authenticated user
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied("You do not have permission to delete this memory.")
        return obj