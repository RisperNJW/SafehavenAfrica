from django.contrib import admin
from .models import ModerationLog

@admin.register(ModerationLog)
class ModerationLogAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'content_type',
        'result',
        'toxicity_score',
        'flagged_at'
    )
    list_filter = (
        'content_type',
        'result',
        'flagged_at'
    )
    search_fields = (
        'user__username',
        'content',
        'labels'
    )
    ordering = ('-flagged_at',)
