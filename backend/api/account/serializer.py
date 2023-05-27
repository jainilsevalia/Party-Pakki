from rest_framework import serializers
from .models import Booking, Profile
from api.venues.serializer import VenueSerializer

class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField("get_email")
    phone_number = serializers.SerializerMethodField("get_phone_number")
    wishlist = serializers.SerializerMethodField("get_wishlist")
    bookings = serializers.SerializerMethodField("get_bookings")
    reviews = serializers.SerializerMethodField("get_review")
    class Meta:
        model = Profile
        fields = ["uuid","user", "first_name", "last_name", "email", "phone_number", "date_of_birth", "photo", "city", "state", "wishlist", "bookings", "reviews"]

    def get_email(self, obj):
        return obj.user.email if obj.user.email else ""

    def get_phone_number(self, obj):
        return obj.user.phone_number if obj.user.phone_number else ""

    def get_wishlist(self, obj):
        try:
            wishlist_items = obj.wishlist.wishlistitem_set.all()
        except:
            wishlist_items = []
        venues = []
        for wishlist_item in wishlist_items:
            serializers = VenueSerializer(wishlist_item.venue)
            venues.append(serializers.data)
        return venues

    def get_bookings(self, obj):
        try:
            booking_items = obj.booking_set.all()
        except:
            booking_items = None

        bookings = []
        for booking in booking_items:
            data = {
                "venue": VenueSerializer(booking.venue).data,
                "event_date": booking.event_date,
                "query_date": booking.query_date,
                "confirmation_date": booking.confirmation_date,
                "process_stage": booking.process_stage,
                "no_of_guests": booking.no_of_guests,
                "remarks": booking.remarks,
                "admin_remarks": booking.admin_remarks,
            }
            bookings.append(data)
        return bookings

    def get_review(self, obj):
        try:
            review_items = obj.review_set.all()
        except:
            review_items = None

        reviews = []
        for review in review_items:
            data = {
                "venue": VenueSerializer(review.venue).data,
                "rating": review.rating,
                "comment": review.comment,
                "date": review.date,
            }
            reviews.append(data)
        return reviews

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["venue", "user", "event_date", "query_date", "confirmation_date", "process_stage", "no_of_guests", "remarks", "admin_remarks"]
