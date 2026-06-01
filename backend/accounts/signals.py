from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, JobSeekerProfile, RecruiterProfile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):

    if not created:
        return

    if instance.user_type == 'job_seeker':
        JobSeekerProfile.objects.create(user=instance)

    elif instance.user_type == 'recruiter':
        RecruiterProfile.objects.create(user=instance)