from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Blog
from .serializer import BlogSerializer


@api_view(["GET"])
def blogs(request):
    if request.method == "GET":
        blogs = Blog.objects.all()
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data)

@api_view(["GET"])
def blog(request, blog_id):
    if request.method == "GET":
        blogs = Blog.objects.get(pk=blog_id)
        serializer = BlogSerializer(blogs, many=False)
        return Response(serializer.data)
