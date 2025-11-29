from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .detector import HarmfulContentDetector

@csrf_exempt
@require_http_methods(["POST"])
def analyze_message(request):
    try:
        data = json.loads(request.body)
        text = data.get('text', '')
        
        if not text:
            return JsonResponse({'error': 'Text field required.'}, status=400)
        
        if len(text) > 5000:
            return JsonResponse({'error': 'Text too long.'}, status=400)
        
        result = HarmfulContentDetector.analyze(text)
        return JsonResponse(result)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': 'Server error.'}, status=500)

@require_http_methods(["GET"])
def health_check(request):
    return JsonResponse({
        'status': 'healthy',
        'service': 'SafeSpace AI Detection API',
        'version': '1.0.0'
    })

@require_http_methods(["GET"])
def get_stats(request):
    return JsonResponse({
        'categories': ['threats', 'harassment', 'gaslighting', 'coercion', 'stalking', 'emotional_manipulation'],
        'total_patterns': 30
    }) 
