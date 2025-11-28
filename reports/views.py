import os
import hashlib
from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from rest_framework import viewsets, status, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Report, Evidence
from .serializers import ReportSerializer, ReportCreateSerializer, EvidenceSerializer
from .permissions import IsReporterOrReadOnly, IsAdminOrReadOnly, IsAdminOrReporter

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReporter]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['type_of_violence', 'description', 'location', 'status']
    ordering_fields = ['created_at', 'risk_level']
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return self.queryset.all()
        return self.queryset.filter(survivor=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return ReportCreateSerializer
        return ReportSerializer

    def perform_create(self, serializer):
        report = serializer.save(survivor=self.request.user)

        risk_mapping = {
            'physical': 'high',
            'sexual': 'critical',
            'emotional': 'medium',
            'economic': 'low',
            'stalking': 'high',
            'digital': 'medium'
        }
        
        report.risk_level = risk_mapping.get(report.type_of_violence, 'medium')
        report.retention_expiry = timezone.now() + timedelta(days=90)
        report.save()
        self._send_report_created_notification(report)

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser])
    def upload_evidence(self, request, pk=None):
        report = self.get_object()
        files = request.FILES.getlist('files[]')
        
        if not files:
            return Response(
                {"error": "No files provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        MAX_FILE_SIZE = 10 * 1024 * 1024 
        ALLOWED_TYPES = [
            'image/jpeg', 'image/png', 'image/gif',
            'application/pdf',
            'video/mp4', 'video/quicktime'
        ]
        
        uploaded_files = []
        
        for file in files:
            if file.content_type not in ALLOWED_TYPES:
                return Response(
                    {"error": f"File type {file.content_type} not allowed"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            size
            if file.size > MAX_FILE_SIZE:
                return Response(
                    {"error": f"File {file.name} is too large. Max size is 10MB"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            file_checksum = self._calculate_file_checksum(file)
            
            evidence = Evidence.objects.create(
                report=report,
                file=file,
                checksum=file_checksum
            )
            uploaded_files.append(EvidenceSerializer(evidence).data)
        
        return Response(uploaded_files, status=status.HTTP_201_CREATED)
    
    def _calculate_file_checksum(self, file):
        sha256_hash = hashlib.sha256()
        for chunk in file.chunks():
            sha256_hash.update(chunk)
        return sha256_hash.hexdigest()
    
    def _send_report_created_notification(self, report):
       
        pass

    @action(detail=True, methods=['delete'])
    @permission_classes([IsReporterOrReadOnly])
    def delete_report(self, request, pk=None):
        
        report = self.get_object()

        report.status = 'deleted'
        report.retention_expiry = timezone.now() + timedelta(days=7)
        report.save()
        
        return Response(
            {"message": "Report marked for deletion. It will be permanently removed after 7 days."},
            status=status.HTTP_202_ACCEPTED
        )
    
    @action(detail=True, methods=['post'])
    @permission_classes([permissions.IsAdminUser])
    def escalate(self, request, pk=None):
        report = self.get_object()
        report.status = 'escalated'
        report.risk_level = 'critical'
        report.save()
    
        return Response(
            {"message": "Report has been escalated to high priority."},
            status=status.HTTP_200_OK
        )