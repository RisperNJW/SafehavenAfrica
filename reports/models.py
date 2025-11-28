from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

class Report(models.Model):
    VIOLENCE_TYPES = (
        ('physical', 'Physical Violence'),
        ('sexual', 'Sexual Violence'),
        ('emotional', 'Emotional/Psychological'),
        ('economic', 'Economic/Financial'),
        ('stalking', 'Stalking/Harassment'),
        ('digital', 'Digital/Online Abuse'),
    )

    PERPETRATOR_RELATIONS = (
        ('partner', 'Current/Former Partner'),
        ('family', 'Family Member'),
        ('friend', 'Friend/Acquaintance'),
        ('colleague', 'Colleague/Boss'),
        ('stranger', 'Stranger'),
        ('other', 'Other'),
    )

    RISK_LEVELS = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical - Immediate Danger'),
    )

    survivor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    type_of_violence = models.CharField(max_length=20, choices=VIOLENCE_TYPES)
    description = models.TextField()
    location = models.CharField(max_length=200, blank=True)
    perpetrator_relation = models.CharField(max_length=20, choices=PERPETRATOR_RELATIONS, blank=True)
    
    # Risk & Status
    risk_score = models.IntegerField(default=0)
    risk_level = models.CharField(max_length=10, choices=RISK_LEVELS, default='low')
    status = models.CharField(max_length=20, default='pending', choices=[
        ('pending', 'Pending Review'),
        ('reviewed', 'Reviewed'),
        ('escalated', 'Escalated to Hotline'),
    ])

    # Auto-delete after 90 days (survivor privacy)
    retention_expiry = models.DateTimeField(default=timezone.now() + timedelta(days=90))
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Report #{self.id} - {self.get_type_of_violence_display()}"

    class Meta:
        ordering = ['-created_at']


class Evidence(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='evidence')
    file = models.FileField(upload_to='evidence/')
    checksum = models.CharField(max_length=64, blank=True)  # For future blockchain
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evidence for Report #{self.report.id}"