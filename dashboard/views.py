# dashboard/views.py

from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Post, Keyword
from .serializers import PostSerializer, KeywordSerializer
import requests
import random
from django.db import transaction

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer

class KeywordViewSet(viewsets.ModelViewSet):
    queryset = Keyword.objects.all()
    serializer_class = KeywordSerializer

@api_view(["POST"])
def fetch_external_posts(request):
    """
    Fetch demo posts from JSONPlaceholder, assign realistic platforms/keywords,
    save to DB and return the created posts.
    """
    url = "https://jsonplaceholder.typicode.com/posts"
    try:
        resp = requests.get(url, timeout=10)
    except requests.RequestException as e:
        return Response({"error": "Failed to fetch external posts", "details": str(e)}, status=400)

    if resp.status_code != 200:
        return Response({"error": "Failed to fetch external posts", "status_code": resp.status_code}, status=400)

    items = resp.json()[:8]  # take first N demo posts (8)
    platforms = ["Twitter", "Reddit", "Quora", "Facebook", "LinkedIn"]
    keywords_list = ["python", "react", "ai", "django", "marketing", "data"]

    created = []
    # keep DB changes atomic so either all or none are saved
    with transaction.atomic():
        for item in items:
            platform = random.choice(platforms)
            keyword_name = random.choice(keywords_list)
            keyword_obj, _ = Keyword.objects.get_or_create(name=keyword_name)

            # limit title length to avoid DB field issues
            title = item.get("title", "")[:200]
            url_slug = item.get("id")

            post = Post.objects.create(
                title=title,
                platform=platform,
                url=f"https://jsonplaceholder.typicode.com/posts/{url_slug}",
                keyword=keyword_obj
            )
            created.append(PostSerializer(post).data)

    return Response({"imported": created})
