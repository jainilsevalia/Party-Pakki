from django.contrib import admin
from api.account.forms import BookingAdminForm

from api.account.models import Profile, User, Booking


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["email", "phone_number", "is_verified", "verified_through"]
    list_display_links = ["email", "phone_number"]

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["email", "first_name", "last_name", "city", "state"]

    def email(self, obj):
        return obj.user.email if obj.user.email else obj.user

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ["venue", "user", "event_date", "query_date", "confirmation_date", "process_stage"]
    list_display_links = ["venue", "user"]

    form = BookingAdminForm

    def venue(self, obj):
        return obj.venue.name

    def user(self, obj):
        return obj.user.email