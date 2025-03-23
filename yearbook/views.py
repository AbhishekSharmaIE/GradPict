# views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import Http404
from django.views.decorators.http import require_http_methods
from django.contrib.auth.forms import UserCreationForm
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Scrapbook, Profile, UniversityBranding, ScrapbookImage
from .serializers import (
    ScrapbookSerializer, ProfileSerializer, 
    UniversityBrandingSerializer, ScrapbookImageSerializer
)
from django.contrib import messages
from django.contrib.auth.models import User

IRISH_UNIVERSITIES = [
    'Trinity College Dublin',
    'University College Dublin',
    'University College Cork',
    'National University of Ireland, Galway',
    'Dublin City University',
    'University of Limerick',
    'Maynooth University',
    'Technological University Dublin',
    'Munster Technological University',
    'Atlantic Technological University',
    'South East Technological University',
    'Royal College of Surgeons in Ireland',
    'Dublin Institute of Technology',
    'Cork Institute of Technology',
    'Waterford Institute of Technology',
    'Institute of Technology, Carlow',
    'Letterkenny Institute of Technology',
    'Dundalk Institute of Technology',
    'Athlone Institute of Technology',
    'Institute of Technology, Sligo',
    'Institute of Technology, Tralee',
    'National College of Art and Design',
    'St. Patrick\'s College, Maynooth',
    'Mary Immaculate College',
    'Marino Institute of Education',
    'National College of Ireland'
]

def home(request):
    # Get recent public scrapbooks
    recent_scraps = Scrapbook.objects.filter(is_public=True).order_by('-created_at')[:6]
    
    # Get users count by university
    university_stats = Profile.objects.exclude(university__isnull=True).values(
        'university'
    ).distinct().count()
    
    context = {
        'recent_scraps': recent_scraps,
        'university_count': len(IRISH_UNIVERSITIES),
        'user_count': User.objects.count(),
        'university_stats': university_stats
    }
    return render(request, 'yearbook/home.html', context)

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            
            # Update the existing profile with additional information
            profile = user.profile
            profile.university = request.POST.get('university')
            profile.course = request.POST.get('course')
            profile.graduation_year = request.POST.get('graduation_year')
            
            # Handle profile picture
            if 'profile_picture' in request.FILES:
                profile.profile_picture = request.FILES['profile_picture']
            
            profile.save()
            
            login(request, user)
            messages.success(request, 'Registration successful! Welcome to GradPict.')
            return redirect('dashboard')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field.title()}: {error}")
    else:
        form = UserCreationForm()
    
    return render(request, 'yearbook/register.html', {
        'form': form,
        'errors': form.errors,
        'universities': IRISH_UNIVERSITIES
    })

@login_required
def dashboard(request):
    # Get users from the same university
    same_university_users = User.objects.filter(
        profile__university=request.user.profile.university
    ).exclude(id=request.user.id)
    
    # Get public scrapbooks from users in the same university
    university_scrapbooks = Scrapbook.objects.filter(
        is_public=True,
        user__profile__university=request.user.profile.university
    ).exclude(user=request.user)
    
    context = {
        'same_university_users': same_university_users,
        'university_scrapbooks': university_scrapbooks,
        'user_scrapbooks': Scrapbook.objects.filter(user=request.user)
    }
    return render(request, 'yearbook/dashboard.html', context)

@login_required
def create_scrap(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('content')
        scrap_type = request.POST.get('scrap_type')
        privacy = request.POST.get('privacy')
        university = request.POST.get('university')
        graduation_year = request.POST.get('graduation_year')
        location = request.POST.get('location')
        tags = request.POST.get('tags')
        images = request.FILES.getlist('images')
        
        try:
            scrap = Scrapbook.objects.create(
                user=request.user,
                title=title,
                description=description,
                scrap_type=scrap_type,
                privacy=privacy,
                university=university,
                graduation_year=graduation_year,
                location=location,
                tags=tags
            )
            
            # Handle multiple images
            for image in images:
                ScrapbookImage.objects.create(scrapbook=scrap, image=image)
                
            messages.success(request, 'Memory created successfully!')
            return redirect('view_scrap', scrap_id=scrap.id)
            
        except Exception as e:
            messages.error(request, f'Error creating memory: {str(e)}')
            return redirect('create_scrap')
        
    return render(request, 'yearbook/create_scrap.html')

@login_required
def view_scrap(request, scrap_id):
    scrap = get_object_or_404(Scrapbook, id=scrap_id)
    
    if scrap.privacy == 'private' and scrap.user != request.user:
        raise Http404("This scrap is private")
    elif scrap.privacy == 'friends_only' and not request.user.is_friend(scrap.user):
        raise Http404("This scrap is only visible to friends")
        
    return render(request, 'yearbook/view_scrap.html', {'scrap': scrap})

@login_required
def profile(request):
    if request.method == 'POST':
        profile = request.user.profile
        profile.university = request.POST.get('university')
        profile.course = request.POST.get('course')
        profile.graduation_year = request.POST.get('graduation_year')
        profile.bio = request.POST.get('bio')
        profile.location = request.POST.get('location')
        profile.interests = request.POST.get('interests')
        
        if 'profile_picture' in request.FILES:
            profile.profile_picture = request.FILES['profile_picture']
        
        profile.save()
        messages.success(request, 'Profile updated successfully!')
        return redirect('profile')
    
    # Get users from the same university
    same_university_users = User.objects.filter(
        profile__university=request.user.profile.university
    ).exclude(id=request.user.id)
    
    context = {
        'profile': request.user.profile,
        'universities': IRISH_UNIVERSITIES,
        'same_university_users': same_university_users,
        'scrapbooks': Scrapbook.objects.filter(user=request.user)
    }
    return render(request, 'yearbook/profile.html', context)

@require_http_methods(["GET", "POST"])
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, 'Successfully logged in!')
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid username or password.')
    return render(request, 'yearbook/login.html')

@require_http_methods(["GET", "POST"])
def logout_view(request):
    if request.method == 'POST':
        logout(request)
        messages.success(request, 'Successfully logged out!')
        return redirect('home')
    return redirect('home')

@login_required
def view_profile(request, username):
    user = get_object_or_404(User, username=username)
    scrapbooks = Scrapbook.objects.filter(user=user, is_public=True)
    
    context = {
        'viewed_user': user,
        'scrapbooks': scrapbooks,
        'is_same_university': user.profile.university == request.user.profile.university
    }
    return render(request, 'yearbook/view_profile.html', context)

# API Views
class ScrapbookViewSet(viewsets.ModelViewSet):
    serializer_class = ScrapbookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Scrapbook.objects.all()
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(privacy='public')
        elif self.action == 'list':
            queryset = queryset.filter(
                models.Q(privacy='public') |
                models.Q(user=self.request.user) |
                models.Q(privacy='friends', user__in=self.request.user.friends.all())
            )
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        scrap = self.get_object()
        if request.user in scrap.likes.all():
            scrap.likes.remove(request.user)
            return Response({'status': 'unliked'})
        else:
            scrap.likes.add(request.user)
            return Response({'status': 'liked'})

class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        if self.action == 'list':
            return Profile.objects.filter(user__is_active=True)
        return Profile.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UniversityBrandingViewSet(viewsets.ModelViewSet):
    queryset = UniversityBranding.objects.all()
    serializer_class = UniversityBrandingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ScrapbookImageViewSet(viewsets.ModelViewSet):
    queryset = ScrapbookImage.objects.all()
    serializer_class = ScrapbookImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save()