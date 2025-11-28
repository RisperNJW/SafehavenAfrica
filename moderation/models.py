from django.db import models
from django.conf import settings

class ModerationLog(models.Model):
    TOXICITY_CHOICES = [('safe', 'Safe'), ('flagged', 'Flagged'), ('blocked', 'Blocked')]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    content_type = models.CharField(max_length=20)  # 'text' or 'image'
    content = models.TextField(blank=True)  # truncated original
    toxicity_score = models.FloatField(null=True, blank=True)  # 0.0 to 1.0
    result = models.CharField(max_length=10, choices=TOXICITY_CHOICES, default='safe')
    labels = models.JSONField(default=list)  # e.g. ["sexual", "threat", "self_harm"]
    flagged_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.result.upper()} - {self.content_type} - {self.flagged_at.date()}"