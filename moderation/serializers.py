from rest_framework import serializers

class TextModerationSerializer(serializers.Serializer):
    text = serializers.CharField(required=True, max_length=10000)

class ModerationResultSerializer(serializers.Serializer):
    result = serializers.CharField()
    score = serializers.FloatField()
    labels = serializers.ListField(child=serializers.CharField())
    flagged = serializers.BooleanField()