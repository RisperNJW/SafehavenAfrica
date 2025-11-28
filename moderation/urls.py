from django.urls import path
from .views import ModerateTextView

urlpatterns = [
    path('check-text/', ModerateTextView.as_view(), name='moderate-text'),
]