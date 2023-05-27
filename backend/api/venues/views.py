from rest_framework.response import Response
from rest_framework.decorators import api_view
from dal import autocomplete
from api.utils import flatten
from api.venues.models import Venue
from api.venues.serializer import VenueSerializer
from api.venues.utils import get_state_city_data
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank

import re

class StateAutoComplete(autocomplete.Select2ListView):
    def get_list(self):
        data = get_state_city_data()
        return data.keys()


class CityAutoComplete(autocomplete.Select2ListView):
    def get_list(self):
        data = get_state_city_data()

        state = self.forwarded.get("state", None)

        if state:
            cities = data[state]
            return cities

        return flatten(data.values())


@api_view(["GET"])
def venues(request):
    if request.method == "GET":
        venues = Venue.objects.all()
        serializer = VenueSerializer(venues, many=True)
        return Response(serializer.data)


@api_view(["GET"])
def venue_detail(request, venue_id):
    if request.method == "GET":
        venue = Venue.objects.get(pk=venue_id)
        serializer = VenueSerializer(venue, many=False)
        return Response(serializer.data)


@api_view(["GET"])
def search(request):
    if request.method == "GET":
        query = request.GET.get("q", None)
        no_in_queries = [int(s) for s in re.findall(r'\b\d+\b', query)]

        if len(no_in_queries) > 0:
            max = no_in_queries[0] - 1000
            min = no_in_queries[0] + 1000
            venues = Venue.objects.filter(rent__gte=max,rent__lte=min)
        else:
            search_vector = SearchVector("name", "location__city", "location__state", "rent", "description")
            search_query = SearchQuery(query)
            venues = (
                Venue.objects.annotate(rank=SearchRank(search_vector, search_query))
                .filter(rank__gte=0.001)
                .order_by("-rank")
            )    
        
        serializer = VenueSerializer(venues, many=True)
        return Response(serializer.data)
