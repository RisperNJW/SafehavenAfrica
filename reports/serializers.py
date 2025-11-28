from rest_framework import serializers
from .models import Report, Evidence

class EvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evidence
        fields = ('id', 'file', 'uploaded_at')
        read_only_fields = ('uploaded_at',)

class ReportSerializer(serializers.ModelSerializer):
    evidence = EvidenceSerializer(many=True, read_only=True)
    survivor_name = serializers.CharField(source='survivor.get_full_name', read_only=True)

    class Meta:
        model = Report
        fields = '__all__'
        read_only_fields = ('survivor', 'risk_score', 'risk_level', 'status', 'retention_expiry', 'created_at')

class ReportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ('type_of_violence', 'description', 'location', 'perpetrator_relation')