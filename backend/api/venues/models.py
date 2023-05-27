from django.db import models
from django.db.models import UniqueConstraint
from django.utils.text import slugify
from ckeditor.fields import RichTextField
from api.utils import flatten
from api.venues.utils import get_state_city_data

import uuid
import os


class Venue(models.Model):

    choices = (
        ("hour", "hour"),
        ("day", "day"),
        ("week", "week"),
        ("month", "month"),
        ("plate", "plate"),
        ("two people", "two people"),
    )

    uuid = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    name = models.CharField(max_length=50)
    rent = models.FloatField(
        max_length=25, null=True, blank=True
    )  # rent is not a good word to use for this field. you can assume its price related to venue.
    rent_by = models.CharField(max_length=25, choices=choices, null=True, blank=True)
    description = RichTextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    @property
    def photos(self):
        return VenuePhoto.objects.filter(venue=self)

    @property
    def reviews(self):
        return Review.objects.filter(venue=self)

    @property
    def amenities(self):
        amenities_obj = Amenity.objects.filter(venue=self)
        amenities = []
        for amenity in amenities_obj:
            amenities.append(
                {
                    "name": amenity.name.name,
                    "slug": amenity.name.slug,
                    "icon": amenity.name.icon.url,
                }
            )
        return amenities

    @property
    def avg_rating(self):
        reviews = Review.objects.filter(venue=self)
        if reviews:
            return round(sum([review.rating for review in reviews]) / len(reviews), 2)
        else:
            return 0

    def __str__(self):
        return self.name


class AmenityName(models.Model):
    name = models.CharField(max_length=50)
    icon = models.ImageField(upload_to="amenities/", blank=True)
    slug = models.SlugField(max_length=50, unique=True, blank=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(AmenityName, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class Amenity(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    name = models.ForeignKey(AmenityName, on_delete=models.CASCADE)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)

    def __str__(self):
        return self.name.name

    class Meta:
        constraints = [
            UniqueConstraint(
                "name",
                "venue",
                name="unique_amenity_venue",
            )
        ]
        verbose_name_plural = "Amenities"


class Location(models.Model):
    data = get_state_city_data()
    state_choices = [(state, state) for state in data.keys()]
    city_choices = [(city, city) for city in flatten(data.values())]

    state = models.CharField(max_length=50, choices=state_choices)
    city = models.CharField(max_length=50, choices=city_choices)
    venue = models.OneToOneField(Venue, on_delete=models.CASCADE)

    def __str__(self):
        return self.city + ", " + self.state

def venue_photo_path(instance, filename):
    extension = filename.split(".")[-1]
    filename = str(uuid.uuid4())[:8] + "." + extension
    venue = instance.venue.name.lower().replace(" ", "-") + "-" + instance.venue.location.city.lower().replace(" ", "-")
    return os.path.join("venues/photos/{}".format(venue), filename)

class VenuePhoto(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=venue_photo_path)

    def __str__(self):
        return self.venue.name


class Review(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    rating = models.FloatField(default=0)
    comment = models.TextField()
    user = models.ForeignKey("account.Profile", on_delete=models.CASCADE)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            UniqueConstraint(
                "user",
                "venue",
                name="unique_review_venue",
            )
        ]

    def __str__(self):
        return "Review for " + self.venue.name + " by " + self.user.first_name + " " + self.user.last_name


class Restaurant(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    venue = models.OneToOneField(Venue, on_delete=models.CASCADE)
    food_type = models.CharField(max_length=15, choices=(("Veg", "Veg"), ("Non-veg", "Non-veg"), ("Both", "Both")))

    def __str__(self):
        return self.venue.name


def food_photo_path(instance, filename):
    extension = filename.split(".")[-1]
    filename = str(uuid.uuid4())[:8] + "." + extension
    restaurant = (
        instance.restaurant.venue.name.lower().replace(" ", "-")
        + "-"
        + instance.restaurant.venue.location.city.lower().replace(" ", "-")
    )
    return os.path.join("venues/photos/food/{}".format(restaurant), filename)


class FoodPhoto(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=food_photo_path)

    def __str__(self):
        return self.restaurant.venue.name
