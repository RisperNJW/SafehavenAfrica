from django.urls import path
from .views import RiskAssessmentView

urlpatterns = [
    path('assess/', RiskAssessmentView.as_view(), name='risk-assess'),
]