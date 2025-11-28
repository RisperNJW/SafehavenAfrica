from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from reports.models import Report
from .services import calculate_risk_from_answers
from .serializers import RiskAssessmentSerializer, RiskResultSerializer

class RiskAssessmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = RiskAssessmentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        report_id = serializer.validated_data['report_id']
        answers = serializer.validated_data['answers']

        try:
            report = Report.objects.get(id=report_id, survivor=request.user)
        except Report.DoesNotExist:
            return Response({"error": "Report not found"}, status=status.HTTP_404_NOT_FOUND)

        result = calculate_risk_from_answers(answers)

        # Update report
        report.risk_score = result['score']
        report.risk_level = result['level']
        if result['needs_escalation']:
            report.status = 'escalated'
        report.save()

        # Customize message
        messages = {
            "low": "Your situation is being monitored. You're not alone — help is here when you need it.",
            "medium": "There are concerning signs. Please consider contacting a hotline today.",
            "high": "Your safety is at serious risk. We strongly recommend immediate support.",
            "critical": "⚠️ You may be in immediate danger. We are connecting you to emergency support now."
        }

        result['message'] = messages[result['level']]

        return Response(RiskResultSerializer(result).data, status=status.HTTP_200_OK)