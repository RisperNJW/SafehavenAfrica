from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import ChatbotSession, Message
from .services import get_bot_response
from .serializers import MessageSerializer, ChatResponseSerializer
import uuid

class ChatbotView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = MessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_message = serializer.validated_data['message']
        session_id = request.headers.get('X-Session-ID', str(uuid.uuid4()))

        # Get or create session
        session, created = ChatbotSession.objects.get_or_create(
            session_id=session_id,
            defaults={'user': request.user}
        )

        # Save user message
        Message.objects.create(
            session=session,
            role='user',
            content=user_message
        )

        # Get recent history
        history = session.messages.all().order_by('timestamp')

        # Get AI reply
        reply = get_bot_response(user_message, history)

        # Save assistant reply
        Message.objects.create(
            session=session,
            role='assistant',
            content=reply
        )

        # Simple danger detection
        danger_keywords = ['kill myself', 'want to die', 'going to hurt myself', 'end it', 'suicide']
        needs_hotline = any(kw in user_message.lower() for kw in danger_keywords)

        return Response({
            "reply": reply,
            "session_id": session.session_id,
            "needs_hotline": needs_hotline
        })