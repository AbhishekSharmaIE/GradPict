from django.contrib import admin
from .models import Scrapbook, Profile, UniversityBranding, ScrapbookImage

@admin.register(Scrapbook)
class ScrapbookAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'university', 'created_at')
    search_fields = ('title', 'description', 'user__username')
    list_filter = ('university', 'is_public', 'created_at')

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'university', 'course', 'graduation_year')
    search_fields = ('user__username', 'university', 'course')
    list_filter = ('university', 'graduation_year')

@admin.register(UniversityBranding)
class UniversityBrandingAdmin(admin.ModelAdmin):
    list_display = ('name', 'website', 'email_domain')
    search_fields = ('name', 'email_domain')

@admin.register(ScrapbookImage)
class ScrapbookImageAdmin(admin.ModelAdmin):
    list_display = ('scrapbook', 'uploaded_at')
    search_fields = ('scrapbook__title', 'caption')
    list_filter = ('uploaded_at',)
