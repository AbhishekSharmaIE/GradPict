# yearbook/urls.py or gradpict/urls.py depending on where you define it
from django.urls import path
from .views import (
    ScrapbookListView, ScrapbookCreateView, ScrapbookUpdateView, 
    ScrapbookDeleteView, ProfileView, UniversityBrandingView, register_user
)

urlpatterns = [
    path('scrapbook/', ScrapbookListView.as_view(), name='scrapbook-list'),
    path('scrapbook/create/', ScrapbookCreateView.as_view(), name='scrapbook-create'),
    path('scrapbook/<int:pk>/update/', ScrapbookUpdateView.as_view(), name='scrapbook-update'),
    path('scrapbook/<int:pk>/delete/', ScrapbookDeleteView.as_view(), name='scrapbook-delete'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('university-branding/', UniversityBrandingView.as_view(), name='university-branding'),
    path('register/', register_user, name='register'),
]
