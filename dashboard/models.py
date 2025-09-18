from django.db import models

class Keyword(models.Model):
    name = models.CharField(max_length=100, unique=True)  # keyword name
    created_at = models.DateTimeField(auto_now_add=True)  # timestamp

    def __str__(self):
        return self.name


class Post(models.Model):
    keyword = models.ForeignKey(
        Keyword,
        on_delete=models.CASCADE,
        related_name="posts",
        null=True,       # allow empty keyword
        blank=True       # allow blank keyword
    )
    title = models.CharField(max_length=255)  # post title
    url = models.URLField()  # link to the post
    platform = models.CharField(max_length=50, default="Reddit")  # Reddit, Quora, etc.
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
