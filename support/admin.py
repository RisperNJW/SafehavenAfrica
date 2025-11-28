from django.contrib import admin
from .models import Hotline


@admin.register(Hotline)
class HotlineAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'organization',
        'country',
        'region',
        'phone',
        'is_24_7',
        'category',
    )
    list_filter = (
        'country',
        'region',
        'is_24_7',
        'category',
    )
    search_fields = (
        'name',
        'organization',
        'country',
        'region',
        'phone',
        'languages',
    )
    ordering = ('organization',)
