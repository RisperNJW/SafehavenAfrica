from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import Report, Evidence
from .serializers import ReportSerializer, ReportCreateSerializer, EvidenceSerializer

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(survivor=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return ReportCreateSerializer
        return ReportSerializer

    def perform_create(self, serializer):
        report = serializer.save(survivor=self.request.user)
        # Auto-calculate risk (we’ll connect to risk/ app later)
        report.risk_level = 'medium'  # placeholder
        report.save()

    @action(detail=True, methods=['post'])
    def upload_evidence(self, request, pk=None):
        report = self.get_object()
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        evidence = Evidence.objects.create(report=report, file=file)
        return Response(EvidenceSerializer(evidence).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'])
    def delete_report(self, request, pk=None):
        report = self.get_object()
        report.delete()
        return Response({"message": "Report deleted permanently by survivor."})