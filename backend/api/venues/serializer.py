from rest_framework import serializers
from .models import FoodPhoto, Restaurant, Venue


class VenueSerializer(serializers.ModelSerializer):
    photos = serializers.SerializerMethodField("get_photos")
    location = serializers.SerializerMethodField("get_location")
    reviews = serializers.SerializerMethodField("get_review")
    amenities = serializers.SerializerMethodField("get_amenities")
    rating = serializers.SerializerMethodField("get_rating")
    restaurant = serializers.SerializerMethodField("get_restaurant")

    class Meta:
        model = Venue
        fields = ["uuid", "name", "rent", "rent_by", "location", "description", "amenities", "photos", "rating", "reviews", "restaurant"]

    def get_photos(self, obj):
        if obj.photos:
            photos = [{"uuid": photo.uuid, "image": photo.image.url} for photo in obj.photos]
        else:
            photos = []
        return photos

    def get_location(self, obj):
        if obj.location:
            location = {"city": obj.location.city, "state": obj.location.state}
        else:
            location = {}
        return location

    def get_review(self, obj):
        if obj.reviews:
            reviews = [
                {
                    "uuid": data.uuid,
                    "rating": data.rating,
                    "comment": data.comment,
                    "user": {
                        "uuid": data.user.uuid,
                        "first_name": data.user.first_name,
                        "last_name": data.user.last_name,
                        "photo": data.user.photo.url if data.user.photo else None,
                    },
                    "date": data.date,
                }
                for data in obj.reviews
            ]
        else:
            reviews = []
        return reviews

    def get_amenities(self, obj):
        return obj.amenities if obj.amenities else []

    def get_rating(self, obj):
        return obj.avg_rating

    def get_restaurant(self, obj):
        try:
            restaurant = Restaurant.objects.get(venue=obj)
        except:
            restaurant = None
        if restaurant:
            return RestaurantSerializer(restaurant).data
        else:
            return None
        

class RestaurantSerializer(serializers.ModelSerializer):

    photos = serializers.SerializerMethodField("get_photos")

    class Meta:
        model = Restaurant
        fields = ["food_type", "photos"]

    def get_photos(self, obj):
        photos = obj.foodphoto_set.all()
        if photos:
            photos = [{"uuid": photo.uuid, "image": photo.image.url} for photo in photos]
        else:
            photos = []
        return photos