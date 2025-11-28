from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="GBV Safety Platform API",
        default_version='v1',
        description="AI-Powered Gender-Based Violence Reporting System",
        contact=openapi.Contact(email="team@nito.gov"),
    ),
    public=True,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='redoc'),
    path('api/reports/', include('reports.urls')),
    path('api/risk/', include('risk.urls')),
    path('api/moderation/', include('moderation.urls')),
    path('api/chatbot/', include('chatbot.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)