from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Post, Keyword
from .serializers import PostSerializer, KeywordSerializer
import requests

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class KeywordViewSet(viewsets.ModelViewSet):
    queryset = Keyword.objects.all()
    serializer_class = KeywordSerializer

@api_view(["POST"])
def fetch_external_posts(request):
    """
    Fetch fake posts from JSONPlaceholder and save them in DB.
    """
    url = "https://jsonplaceholder.typicode.com/posts"
    response = requests.get(url)

    if response.status_code != 200:
        return Response({"error": "Failed to fetch external posts"}, status=400)

    data = response.json()[:5]  # take first 5 posts
    saved = []

    # ensure Keyword exists
    keyword_obj, _ = Keyword.objects.get_or_create(name="sample")

    for item in data:
        post = Post.objects.create(
            title=item["title"],
            platform="ExternalAPI",
            url=f"https://jsonplaceholder.typicode.com/posts/{item['id']}",
            keyword=keyword_obj
        )
        saved.append(PostSerializer(post).data)

    return Response({"imported": saved})
