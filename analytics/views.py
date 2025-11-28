from django.db.models import Count, Avg
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from reports.models import Report
from users.models import User
from datetime import datetime, timedelta

@method_decorator(login_required, name='dispatch')
class AdminAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.role == 'admin':
            return Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)

        # Total reports (last 30 days)
        last_30 = Report.objects.filter(created_at__gte=datetime.now() - timedelta(days=30))
        
        data = {
            "total_reports": Report.objects.count(),
            "reports_this_month": last_30.count(),
            "active_survivors": User.objects.filter(role='survivor').count(),
            
            # Risk breakdown
            "risk_distribution": dict(
                Report.objects.values('risk_level')
                .annotate(count=Count('risk_level'))
                .values_list('risk_level', 'count')
            ),
            
            # Violence types
            "violence_types": dict(
                Report.objects.values('type_of_violence')
                .annotate(count=Count('type_of_violence'))
                .values_list('type_of_violence', 'count')
            ),
            
            # Geographic heatmap (mocked — replace with real location later)
            "heatmap": [
                {"country": "Kenya", "reports": 312, "lat": -1.2921, "lng": 36.8219},
                {"country": "Nigeria", "reports": 189, "lat": 9.0765, "lng": 7.3986},
                {"country": "South Africa", "reports": 156, "lat": -30.5595, "lng": 22.9375},
                {"country": "Uganda", "reports": 94, "lat": 1.3733, "lng": 32.2903},
            ],
            
            "escalated_cases": Report.objects.filter(status='escalated').count(),
            "last_updated": datetime.now().isoformat()
        }
        
        return Response(data)