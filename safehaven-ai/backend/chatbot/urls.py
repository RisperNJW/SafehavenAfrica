from django.urls import path
from . import views

app_name = 'chatbot'

urlpatterns = [
    path('analyze', views.analyze_message, name='analyze'),
    path('health', views.health_check, name='health'),
    path('stats', views.get_stats, name='stats'),
]
