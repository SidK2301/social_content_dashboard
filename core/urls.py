from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from dashboard.views import KeywordViewSet, PostViewSet, fetch_external_posts

router = routers.DefaultRouter()
router.register(r'keywords', KeywordViewSet)
router.register(r'posts', PostViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/fetch-external-posts/', fetch_external_posts),
]
