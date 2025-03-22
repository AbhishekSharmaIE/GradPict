# views.py
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, filters
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.exceptions import PermissionDenied
from .models import Scrapbook, Profile, UniversityBranding
from .serializers import ScrapbookSerializer, ProfileSerializer, UniversityBrandingSerializer
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import logging
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.db import models

logger = logging.getLogger(__name__)
User = get_user_model()

# This view will allow authenticated users to create memories
class ScrapbookCreateView(generics.CreateAPIView):
    queryset = Scrapbook.objects.all()
    serializer_class = ScrapbookSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        # Automatically set the logged-in user
        serializer.save(user=self.request.user)

class ScrapbookUpdateView(generics.UpdateAPIView):
    queryset = Scrapbook.objects.all()
    serializer_class = ScrapbookSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return Scrapbook.objects.filter(user=self.request.user)


# This view will return a list of all public memories and the memories of the currently logged-in user
class ScrapbookListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated
    serializer_class = ScrapbookSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'tags']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        return Scrapbook.objects.filter(
            models.Q(privacy='public') |
            models.Q(user=user) |
            models.Q(privacy='university', university=user.profile.university)
        )


# Create view for deleting memory
class ScrapbookDeleteView(generics.DestroyAPIView):
    queryset = Scrapbook.objects.all()
    serializer_class = ScrapbookSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Scrapbook.objects.filter(user=self.request.user)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Profile.objects.get(user=self.request.user)

class UniversityBrandingView(generics.RetrieveAPIView):
    serializer_class = UniversityBrandingSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_university = self.request.user.profile.university
        return UniversityBranding.objects.get(name=user_university)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        # Create user
        user_data = {
            'username': request.data.get('username'),
            'email': request.data.get('email'),
            'password': request.data.get('password')
        }
        
        user = User.objects.create_user(**user_data)

        # Create profile
        profile_data = {
            'user': user,
            'university': request.data.get('university'),
            'graduation_year': request.data.get('graduation_year'),
            'degree_type': request.data.get('degree_type'),
            'course_name': request.data.get('course_name'),
            'bio': request.data.get('bio', '')
        }

        if 'profile_photo' in request.FILES:
            profile_data['profile_photo'] = request.FILES['profile_photo']

        profile = Profile.objects.create(**profile_data)

        # Send verification email
        verification_url = f"{settings.FRONTEND_URL}/verify-email/{profile.verification_token}"
        context = {
            'username': user.username,
            'verification_url': verification_url,
            'university': profile.university
        }
        
        html_message = render_to_string('email/verify_email.html', context)
        
        send_mail(
            subject='Verify your GradPict account',
            message='Please verify your email address',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message
        )

        return Response({
            'detail': 'User registered successfully. Please check your email to verify your account.',
            'email_sent': True
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, token):
    try:
        profile = Profile.objects.get(verification_token=token)
        if not profile.email_verified:
            profile.email_verified = True
            profile.save()
            return Response({'detail': 'Email verified successfully'})
        return Response({'detail': 'Email already verified'})
    except Profile.DoesNotExist:
        return Response({'detail': 'Invalid verification token'}, 
                      status=status.HTTP_400_BAD_REQUEST)