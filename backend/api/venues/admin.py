from django.contrib import admin
from django.utils.html import format_html
from api.account.models import Wishlist, WishlistItem

from api.venues.models import Amenity, AmenityName, FoodPhoto, Location, Restaurant, Review, Venue, VenuePhoto
from .forms import LocationInlineForm, RestaurantForm, VenueForm, AmenityInlineForm

from core.settings import BACKEND_URL


# inlines start -------------------------------------------------------------


@admin.register(AmenityName)
class AmenityNameAdmin(admin.ModelAdmin):
    list_display = ("name", "icon_preview")

    def icon_preview(self, obj):
        if obj.icon:
            return format_html("<img src='{}' width='28' height='28' style='object-fit: contain;' />", obj.icon.url)
        return "-"

    icon_preview.short_description = "Icon"


class AmenityInline(admin.TabularInline):
    extra = 1
    model = Amenity
    form = AmenityInlineForm


class LocationInline(admin.StackedInline):
    model = Location
    form = LocationInlineForm


class VenuePhotoInline(admin.TabularInline):
    extra = 0
    model = VenuePhoto
    fields = ("image", "preview")
    readonly_fields = ("preview",)

    def preview(self, obj):
        return format_html(
            "<img src='{}' width='70' height='50' style='object-fit: cover;border-radius: 5px' />", obj.image.url
        )

class FoodPhotoInline(admin.TabularInline):
    extra = 1
    model = FoodPhoto
    fields = ("image", "preview")
    readonly_fields = ("preview",)

    def preview(self, obj):
        return format_html(
            "<img src='{}' width='70' height='50' style='object-fit: cover;border-radius: 5px' />", obj.image.url
        )


# inlines end --------------------------------------------------------------


@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    inlines = []

    def get_inlines(self, request, obj):
        default_inlines = [AmenityInline, LocationInline]
        try:
            photos = VenuePhoto.objects.filter(venue=obj.uuid)
        except:
            photos = None
        if photos:
            default_inlines.insert(0, VenuePhotoInline)
            return default_inlines

        return default_inlines

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "name",
                    "rent",
                    "rent_by",
                    "description",
                    "photos",
                ),
            },
        ),
    )

    list_display = ["name", "rent", "rent_by"]
    list_filter = ["date_created", "date_updated"]
    search_fields = ["name"]

    def get_form(self, request, obj=None, **kwargs):
        try:
            instance = kwargs["instance"]
            return VenueForm(instance=instance)
        except KeyError:
            return VenueForm

    def add_view(self, request, form_url="", extra_context=None):
        extra_context = extra_context or {}
        extra_context["form"] = self.get_form(request)
        return super(VenueAdmin, self).add_view(request, form_url=form_url, extra_context=extra_context)

    def change_view(self, request, object_id, form_url="", extra_context=None):
        extra_context = extra_context or {}
        venue = Venue.objects.get(uuid=object_id)
        extra_context["form"] = self.get_form(request, instance=venue)
        return super(VenueAdmin, self).change_view(request, object_id, form_url=form_url, extra_context=extra_context)

    def save_model(self, request, obj, form, change):
        obj.save()
        photos = request.FILES.getlist("photos")
        for photo in photos:
            VenuePhoto.objects.create(venue=obj, image=photo)
        return super().save_model(request, obj, form, change)


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ["venue", "food_type"]

    def venue(self, obj):
        return obj.venue.name

    form = RestaurantForm

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "venue",
                    "food_type",
                    "photos"
                ),
            },
        ),
    )

    def get_inlines(self, request, obj):
        default_inlines = []
        try:
            photos = FoodPhoto.objects.filter(restaurant=obj.uuid)
        except:
            photos = None
        if photos:
            default_inlines.insert(0, FoodPhotoInline)
            return default_inlines

        return default_inlines

    def get_form(self, request, obj=None, **kwargs):
        try:
            instance = kwargs["instance"]
            return RestaurantForm(instance=instance)
        except KeyError:
            return RestaurantForm

    def add_view(self, request, form_url="", extra_context=None):
        extra_context = extra_context or {}
        extra_context["form"] = self.get_form(request)
        return super(RestaurantAdmin, self).add_view(request, form_url=form_url, extra_context=extra_context)

    def change_view(self, request, object_id, form_url="", extra_context=None):
        extra_context = extra_context or {}
        restaurant = Restaurant.objects.get(uuid=object_id)
        extra_context["form"] = self.get_form(request, instance=restaurant)
        return super(RestaurantAdmin, self).change_view(request, object_id, form_url=form_url, extra_context=extra_context)

    def save_model(self, request, obj, form, change):
        obj.save()
        photos = request.FILES.getlist("photos")
        for photo in photos:
            FoodPhoto.objects.create(restaurant=obj, image=photo)
        return super().save_model(request, obj, form, change)


# wishlist and other --------------------------------------------------------
admin.site.register(Wishlist)


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ["venue", "user"]
    search_fields = ["venue", "user"]

    def venue(self, obj):
        return obj.venue.name

    def user(self, obj):
        return obj.wishlist.profile.user.email


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["user", "venue", "rating", "comment_truncated"]
    list_display_links = ["user", "venue"]

    def comment_truncated(self, obj):
        return obj.comment[:50] + "..." if len(obj.comment) > 50 else obj.comment

    comment_truncated.short_description = "comment"
