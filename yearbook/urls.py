# yearbook/urls.py or gradpict/urls.py depending on where you define it
from django.urls import path, include
from django.contrib.auth import views as auth_views
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'scrapbooks', views.ScrapbookViewSet, basename='scrapbook')
router.register(r'profiles', views.ProfileViewSet, basename='profile')
router.register(r'universities', views.UniversityBrandingViewSet, basename='university')
router.register(r'images', views.ScrapbookImageViewSet, basename='image')

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register, name='register'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('profile/', views.profile, name='profile'),
    path('profile/<str:username>/', views.view_profile, name='view_profile'),
    path('create/', views.create_scrap, name='create_scrap'),
    path('scrap/<int:scrap_id>/', views.view_scrap, name='view_scrap'),
    path('api/', include(router.urls)),
]
