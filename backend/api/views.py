from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.utils import flatten

from api.venues.utils import get_state_city_data


@api_view(["GET"])
def api(request):
    api_urls = {"venues": "venues/", "account": "account/"}
    return Response(api_urls)


@api_view(["GET"])
def states_cities(request):
    data = get_state_city_data()
    return Response(data)