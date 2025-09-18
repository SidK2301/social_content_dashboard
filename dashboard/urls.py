from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, KeywordViewSet, fetch_external_posts

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'keywords', KeywordViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('fetch-external-posts/', fetch_external_posts, name='fetch_external_posts'),
]
