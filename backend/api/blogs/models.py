from django.db import models
from ckeditor.fields import RichTextField
from api.account.models import Profile

import uuid
import os



def profile_pic_path(instance, filename):
    extension = filename.split(".")[-1]
    filename = str(uuid.uuid4())[:8] + "." + extension
    return os.path.join("blogs/author/", filename)


def blog_thumbnail_path(instance, filename):
    extension = filename.split(".")[-1]
    filename = instance.title[:20].lower().replace(" ", "-") + "." + extension
    return os.path.join("blogs/thumbnail/", filename)


class Blog(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    thumbnail = models.ImageField(upload_to=blog_thumbnail_path)
    title = models.CharField(max_length=50)
    description = RichTextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
