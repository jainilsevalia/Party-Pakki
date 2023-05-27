from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static

from .settings import MEDIA_URL, MEDIA_ROOT
from . import views


urlpatterns = [
    path("", views.home, name="home"),
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path("api-auth/", include("rest_framework.urls")),
] + static(MEDIA_URL, document_root=MEDIA_ROOT)
