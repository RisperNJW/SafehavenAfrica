from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HotlineViewSet

router = DefaultRouter()
router.register(r'hotlines', HotlineViewSet)

urlpatterns = [
    path('', include(router.urls)),
]