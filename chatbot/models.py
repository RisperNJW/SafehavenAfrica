from django.db import models
from django.conf import settings

class ChatbotSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_active = models.DateTimeField(auto_now=True)
    risk_alerts = models.JSONField(default=list)  # e.g. ["suicidal_ideation", "immediate_danger"]

class Message(models.Model):
    session = models.ForeignKey(ChatbotSession, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=10)  # 'user' or 'assistant'
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    moderated = models.BooleanField(default=True)