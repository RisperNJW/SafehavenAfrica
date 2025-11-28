from rest_framework import serializers

class RiskAssessmentSerializer(serializers.Serializer):
    report_id = serializers.IntegerField(required=True)
    answers = serializers.DictField(child=serializers.BooleanField())

class RiskResultSerializer(serializers.Serializer):
    score = serializers.IntegerField()
    level = serializers.CharField()
    triggers = serializers.ListField(child=serializers.CharField())
    needs_escalation = serializers.BooleanField()
    message = serializers.CharField()