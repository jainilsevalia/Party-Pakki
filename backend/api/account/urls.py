from . import views
from django.urls import path

urlpatterns = [
    path("signup/", views.signup, name="signup"),
    path("signup-with-phone/", views.signup_with_phone, name="signup_with_phone"),
    path("exists/", views.exists, name="exists"),
    path("user/", views.user, name="user"),
    path("update-user/", views.update_user, name="update_user"),
    path("wishlist/", views.wishlist, name="wishlist"),
    path("wishlist/<str:uuid>/", views.wishlist, name="wishlist"),
    path("booking/", views.booking, name="booking"),
    path("booking/<str:uuid>/", views.booking, name="booking"),
    path("user/review/<str:uuid>/", views.review, name="review"),
]