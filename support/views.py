from rest_framework import viewsets, permissions
from .models import Hotline
from .serializers import HotlineSerializer

class HotlineViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Hotline.objects.all()
    serializer_class = HotlineSerializer
    permission_classes = [permissions.AllowAny]  # Public resource

    def get_queryset(self):
        queryset = Hotline.objects.all()
        country = self.request.query_params.get('country')
        region = self.request.query_params.get('region')
        if country:
            queryset = queryset.filter(country=country.upper())
        if region:
            queryset = queryset.filter(region__icontains=region)
        return queryset.order_by('organization')