from rest_framework import serializers
from .models import Hotline

class HotlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotline
        fields = '__all__'