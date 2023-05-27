from . import views
from django.urls import path

urlpatterns = [
    path("", views.blogs, name="blogs"),
    path("<str:blog_id>/", views.blog, name="blog"),
]
