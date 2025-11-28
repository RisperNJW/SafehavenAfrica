from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .services import moderate_text
from .models import ModerationLog
from .serializers import TextModerationSerializer, ModerationResultSerializer

class ModerateTextView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = TextModerationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        text = serializer.validated_data['text']
        result = moderate_text(text)

        # Log it
        ModerationLog.objects.create(
            user=request.user,
            content_type='text',
            content=text[:500],
            toxicity_score=result['score'],
            result=result['result'],
            labels=result['labels']
        )

        # Block if dangerous
        if result['flagged']:
            result['user_message'] = "This content was blocked to protect you and others."
            return Response(ModerationResultSerializer(result).data, status=status.HTTP_403_FORBIDDEN)

        result['user_message'] = "Your message is safe to send."
        return Response(ModerationResultSerializer(result).data)