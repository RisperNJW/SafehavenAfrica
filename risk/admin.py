from django.contrib import admin
from .models import RiskFactor

@admin.register(RiskFactor)
class RiskFactorAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', 'weight', 'category')
    list_filter = ('category', 'weight')
    search_fields = ('question', 'category')
    ordering = ('-weight',)
