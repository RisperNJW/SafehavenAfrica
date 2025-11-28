from rest_framework import serializers

class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(required=True)

class ChatResponseSerializer(serializers.Serializer):
    reply = serializers.CharField()
    session_id = serializers.CharField()
    needs_hotline = serializers.BooleanField()