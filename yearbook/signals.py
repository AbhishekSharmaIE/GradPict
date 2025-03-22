from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()

@receiver(post_save, sender=User)
def handle_user_profile(sender, instance, created, **kwargs):
    if created:
        # Only create a profile if one doesn't already exist
        if not hasattr(instance, 'profile'):
            Profile.objects.create(user=instance)
    else:
        # For existing users, only save the profile if it exists
        if hasattr(instance, 'profile'):
            instance.profile.save() 