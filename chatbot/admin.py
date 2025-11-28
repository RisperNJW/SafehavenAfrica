from django.contrib import admin
from .models import ChatbotSession, Message


@admin.register(ChatbotSession)
class ChatbotSessionAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'session_id',
        'created_at',
        'last_active',
    )
    search_fields = (
        'session_id',
        'user__username',
    )
    list_filter = ('created_at', 'last_active')
    ordering = ('-last_active',)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'session',
        'role',
        'timestamp',
        'moderated',
    )
    list_filter = ('role', 'moderated', 'timestamp')
    search_fields = ('content',)
    ordering = ('-timestamp',)
