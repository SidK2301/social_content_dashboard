import requests
from .models import Keyword, Post
from django.utils import timezone

def fetch_reddit_posts():
    # Example keyword
    keyword_name = "python"
    
    # Save keyword in database (if not already)
    keyword, created = Keyword.objects.get_or_create(name=keyword_name)
    
    # Fetch top 5 posts from Reddit r/python
    url = f"https://www.reddit.com/r/{keyword_name}/top.json?limit=5"
    headers = {'User-agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        for post_data in data['data']['children']:
            post = post_data['data']
            # Save post in database
            Post.objects.create(
                keyword=keyword,
                title=post['title'],
                url="https://reddit.com" + post['permalink'],
                platform='Reddit',
                created_at=timezone.now()
            )
        print("Posts fetched and saved successfully!")
    else:
        print("Failed to fetch data from Reddit")
