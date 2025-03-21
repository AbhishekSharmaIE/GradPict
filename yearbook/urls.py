# yearbook/urls.py or gradpict/urls.py depending on where you define it
from django.urls import path

from .views import MemoryListView, MemoryCreateView, MemoryUpdateView, MemoryDeleteView

urlpatterns = [
    path('memories/', MemoryListView.as_view(), name='memory-list'),
    path('memories/create/', MemoryCreateView.as_view(), name='memory-create'),
    path('memories/<int:pk>/update/', MemoryUpdateView.as_view(), name='memory-update'),
   path('memories/<int:pk>/delete/', MemoryDeleteView.as_view(), name='memory-delete'),  # Delete view route
]
