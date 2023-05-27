from django.contrib import admin

from api.blogs.models import Blog

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ("short_title", "author", "date_created", "date_updated")

    def short_title(self, obj):
        return obj.title if len(obj.title) < 50 else obj.title[:50] + "..."

    short_title.short_description = "Title"
    
