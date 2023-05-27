from . import views
from django.urls import path, include

urlpatterns = [
    path("", views.api, name="api"),
    path("account/", include("api.account.urls")),
    path("venues/", include("api.venues.urls")),
    path("blogs/", include("api.blogs.urls")),
    path("states-cities/", views.states_cities, name="states-cities"),
]
