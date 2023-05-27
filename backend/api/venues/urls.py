from . import views
from .views import CityAutoComplete, StateAutoComplete
from django.urls import path

urlpatterns = [
    path("", views.venues, name="venues"),
    path("search/", views.search, name="search"),
    path("<str:venue_id>/", views.venue_detail, name="venue_detail"),
    path("locations/states/", StateAutoComplete.as_view(), name="state-autocomplete"),
    path("locations/cities/", CityAutoComplete.as_view(), name="city-autocomplete"),
]
