from django.dispatch import receiver
from django.db.models.signals import post_save
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

import uuid
import os

from api.venues.models import Venue


class UserManager(BaseUserManager):
    def _create_user(self, email, password, is_staff, is_superuser, **extra_fields):
        if not email:
            raise ValueError("User must have an email address.")
        email = self.normalize_email(email)
        now = timezone.now()
        user = self.model(email=email, is_staff=is_staff, is_superuser=is_superuser, last_login=now, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):
        return self._create_user(email, password, False, False, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(email, password, True, True, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=70, unique=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    verified_through = models.CharField(
        max_length=15, default="email", choices=(("email", "email"), ("phone", "phone"))
    )
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = UserManager()


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def profile_pic_path(instance, filename):
    extension = filename.split(".")[-1]
    filename = str(uuid.uuid4())[:8] + "." + extension
    return os.path.join("users/photos/", filename)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    first_name = models.CharField(
        max_length=25, blank=True, null=True
    )  # should not be null but for sign-in with phone it can be
    last_name = models.CharField(
        max_length=25, blank=True, null=True
    )  # should not be null but for sign-in with phone it can be. also while when user sign in with social media it can be null
    date_of_birth = models.CharField(max_length=10, blank=True, null=True)
    photo = models.ImageField(upload_to=profile_pic_path, blank=True, null=True)
    city = models.CharField(max_length=25, blank=True, null=True)
    state = models.CharField(max_length=25, blank=True, null=True)
    
    @property
    def full_name(self):
        return self.first_name + " " + self.last_name


    def __str__(self):
        return self.user.email


@receiver(post_save, sender=Profile)
def create_wishlist(sender, instance, created, **kwargs):
    if created:
        Wishlist.objects.create(profile=instance)


class Wishlist(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)

    def __str__(self):
        return self.profile.user.email


class WishlistItem(models.Model):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE)
    venue = models.ForeignKey("venues.Venue", on_delete=models.CASCADE)


class Booking(models.Model):

    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    query_date = models.DateTimeField(auto_now_add=True)
    confirmation_date = models.DateTimeField(null=True, blank=True)
    process_stage = models.CharField(
        max_length=15,
        default="Requested",
        choices=(
            ("Requested", "Requested"),
            ("Confirmed", "Confirmed"),
            ("Cancelled", "Cancelled"),
            ("Completed", "Completed"),
        ),
    )
    event_date = models.CharField(max_length=10)
    no_of_guests = models.IntegerField()
    remarks = models.TextField(blank=True, null=True)
    admin_remarks = models.TextField(blank=True, null=True)
    
