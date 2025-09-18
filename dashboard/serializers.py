from rest_framework import serializers
from .models import Keyword, Post


class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    # Show keyword name in API response (read-only)
    keyword_name = serializers.CharField(source='keyword.name', read_only=True)

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'platform',
            'url',
            'keyword',        # keeps the ID for creating/updating
            'keyword_name',   # shows readable name in responses
            'created_at'
        ]
