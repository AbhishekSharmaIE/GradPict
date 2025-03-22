from django.contrib import admin
from .models import Scrapbook, Profile, UniversityBranding, ScrapbookImage

@admin.register(Scrapbook)
class ScrapbookAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'scrap_type', 'privacy', 'created_at')
    list_filter = ('privacy', 'scrap_type', 'created_at')
    search_fields = ('title', 'content', 'user__username')

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'university', 'graduation_year', 'degree_type')
    list_filter = ('university', 'graduation_year', 'degree_type')
    search_fields = ('user__username', 'university')

@admin.register(UniversityBranding)
class UniversityBrandingAdmin(admin.ModelAdmin):
    list_display = ('name', 'website', 'email_domain')
    search_fields = ('name', 'email_domain')

@admin.register(ScrapbookImage)
class ScrapbookImageAdmin(admin.ModelAdmin):
    list_display = ('caption', 'created_at')
    search_fields = ('caption',)
