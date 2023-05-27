from rest_framework import serializers
from .models import Blog


class BlogSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField("get_author")

    class Meta:
        model = Blog
        fields = ["uuid", "author", "thumbnail", "title", "description", "date_created", "date_updated"]

    def get_author(self, obj):
        try:
            author = {"name": obj.author.first_name + " " + obj.author.last_name, "photo": obj.author.photo.url}
        except:
            author = None
        return author
    
