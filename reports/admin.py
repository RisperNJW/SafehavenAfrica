from django.contrib import admin
from .models import Report, Evidence

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'survivor', 'type_of_violence', 'risk_level', 'status', 'created_at')
    list_filter = ('type_of_violence', 'risk_level', 'status', 'created_at')
    search_fields = ('survivor__username', 'description', 'location', 'perpetrator_relation')
    ordering = ('-created_at',)


@admin.register(Evidence)
class EvidenceAdmin(admin.ModelAdmin):
    list_display = ('id', 'report', 'file', 'uploaded_at')
    search_fields = ('report__description',)
    ordering = ('-uploaded_at',)
