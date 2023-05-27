from django.contrib.auth import get_user_model
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser

from api.account.models import Booking, Profile, WishlistItem
from api.account.serializer import BookingSerializer, ProfileSerializer
from api.tasks import send_email
from api.venues.models import Review, Venue
from core.settings import BACKEND_URL, EMAIL_HOST_USER, FRONTEND_URL


@api_view(["POST"])
def signup(request):
    user_data = request.data
    try:
        user = get_user_model().objects.get(email=user_data["email"])
    except:
        user = None
    if user:
        return Response({"error": "User already exists"}, status=status.HTTP_409_CONFLICT)

    user = get_user_model().objects.create_user(email=user_data["email"], password=user_data["password"])
    user.profile.first_name = user_data["first_name"]
    user.profile.last_name = user_data["last_name"]
    user.profile.save()
    return Response({"success": "Successfully signed up. Please verify your email."}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def exists(request):
    data = request.data
    try:
        user = get_user_model().objects.get(phone_number=data["phone_number"], email=data["email"])
    except:
        user = None

    if user:
        return Response({"success": 1}, status=status.HTTP_200_OK)
    else:
        return Response({"success": 0}, status=status.HTTP_200_OK)


@api_view(["POST"])
def signup_with_phone(request):
    user_data = request.data

    try:
        user = get_user_model().objects.get(phone_number=user_data["phone_number"])
        try:
            user_with_email = get_user_model().objects.get(email=user_data["email"])
            user.delete()
            user_with_email.phone_number = user_data["phone_number"]
            user_with_email.save()
        except:
            user.email = user_data["email"]
            user.save()

            user.profile.first_name = user_data["first_name"]
            user.profile.last_name = user_data["last_name"]

            user.profile.save()

        return Response({"success": "Successfully signed up. You are now logged in"}, status=status.HTTP_200_OK)
    except:
        user = None
        return Response({"success": "Successfully signed up. You are now logged in"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def user(request):
    try:
        user = request.user
        if user.verified_through == "email" and not user.is_verified:
            user.is_verified = True
            user.save()
        profile = Profile.objects.get(user=user)
        user = ProfileSerializer(profile).data

        return Response({"user": user}, status=status.HTTP_200_OK)

    except Exception as e:
        print("error -->", e)
        return Response(
            {"error": "Something went wrong while trying to load user"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["PUT"])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([permissions.IsAuthenticated])
def update_user(request):
    try:
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            if "delete_photo" in request.data:
                profile.photo.delete()
            return Response({"user": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print("error -->", e)
        return Response(
            {"error": "Something went wrong while trying to update user"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST", "DELETE"])
@permission_classes([permissions.IsAuthenticated])
def wishlist(request, uuid=None):
    if request.method == "POST":
        try:
            venue = Venue.objects.get(uuid=request.data["uuid"])
            WishlistItem.objects.create(wishlist=request.user.profile.wishlist, venue=venue)
            return Response({"success": "Venue added to wishlist"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("error -->", e)
            return Response(
                {"error": "Something went wrong while trying to add venue to wishlist"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    if request.method == "DELETE":
        try:
            wishlist_item = WishlistItem.objects.get(wishlist=request.user.profile.wishlist, venue__uuid=uuid)
            wishlist_item.delete()
            return Response({"success": "Venue removed from wishlist"}, status=status.HTTP_200_OK)
        except Exception as e:
            print("error -->", e)
            return Response(
                {"error": "Something went wrong while trying to remove venue from wishlist"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@api_view(["POST", "PATCH"])
@permission_classes([permissions.IsAuthenticated])
def booking(request, uuid=None):
    if request.method == "POST":
        try:
            serializer = BookingSerializer(data=request.data)
            if serializer.is_valid():
                data = serializer.save()
                send_email(
                    {
                        "from": EMAIL_HOST_USER,
                        "to": [request.user.email],
                        "context": {
                            "subject": "PartyPakki: Booking request",
                            "title": "Hooray! Your booking request has been received",
                            "message": "Your request has been recorded for venue <strong>{}</strong>. We will get back to you soon. Thank you!".format(data.venue.name),
                            "action": "Check more details",
                            "action_link": FRONTEND_URL + "/profile/",
                        },
                    }
                )
                adminusers = get_user_model().objects.filter(is_staff=True).values_list("email", flat=True)
                message = """
                    A new booking request has been received for venue <strong>{venue_name}</strong> by <strong>{fullname}</strong> on <strong>{query_date}</strong>.
                    <br />
                    More details are as follows:
                    <br />
                    <br />
                    <table class="booking-info-table">
                        <tr>
                            <td>Contact info</td>
                            <td>{contact_info}</td>
                        <tr>
                            <td>Event date</td>
                            <td>{event_date}</td>
                        </tr>
                        <tr>
                            <td>No of guests</td>
                            <td>{no_of_guests}</td>
                        </tr>
                        <tr>
                            <td>User query</td>
                            <td>{remarks}</td>
                        </tr>
                    </table>
                """.format(
                    venue_name=data.venue.name,
                    fullname = data.user.full_name,
                    query_date=data.query_date.strftime("%d, %b %Y"),
                    event_date=data.event_date,
                    no_of_guests=data.no_of_guests,
                    remarks=data.remarks if data.remarks else "-",
                    contact_info=data.user.user.email + "<br />" + data.user.user.phone_number if data.user.user.phone_number else data.user.user.email,
                )
                send_email(
                    {
                        "from": EMAIL_HOST_USER,
                        "to": adminusers,
                        "context": {
                            "subject": "PartyPakki Admin: New Booking request",
                            "title": "New booking request from " + data.user.first_name,
                            "message": message,
                            "action": "Go to admin panel",
                            "action_link": BACKEND_URL + "/admin/account/booking/",
                        },
                    }
                )
                return Response({"success": "Your request has been sent to us."}, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("error -->", e)
            return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if request.method == "PATCH":
        try:
            venue = Venue.objects.get(uuid=uuid)
            booking = Booking.objects.get(venue=venue, user=request.user.profile)
            booking.remarks = request.data["remarks"]
            booking.save()
            adminusers = get_user_model().objects.filter(is_staff=True).values_list("email", flat=True)
            send_email({
                "from": EMAIL_HOST_USER,
                "to": adminusers,
                "context": {
                    "subject": "PartyPakki Admin: New user query",
                    "title": "New query from " + booking.user.full_name,
                    "message": """
                        {remarks}
                        <br />
                        <br />
                        by <strong>{user_email}</strong>
                    """.format(remarks=booking.remarks, user_email=booking.user.user.email),
                    "action": "Go to admin panel",
                    "action_link": BACKEND_URL + "/admin/account/booking/",
                },
            })
            return Response({"success": "Your remarks are recorded by us"}, status=status.HTTP_200_OK)
        except Exception as e:
            print("error -->", e)
            return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def review(request, uuid):
    try:
        venue = Venue.objects.get(uuid=uuid)
        Review.objects.update_or_create(
            venue=venue,
            user=request.user.profile,
            defaults={"comment": request.data["comment"], "rating": request.data["rating"]},
        )
        return Response({"success": "Thank you for your feedback"}, status=status.HTTP_200_OK)
    except Exception as e:
        print("error -->", e)
        return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
