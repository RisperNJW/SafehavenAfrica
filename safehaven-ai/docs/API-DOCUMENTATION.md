# API Documentation

## Base URL
`http://localhost:8000/api/chatbot/`

## Endpoints

### POST /analyze
Analyze message for harmful content

**Request:**
```json
{
  "text": "Your message here"
}
```

**Response:**
```json
{
  "harmful": true,
  "severity": 0.85,
  "types": ["threats", "harassment"],
  "safe_response": "Safety recommendations..."
}
```

### GET /health
Check API status

### GET /stats
Get detection statistics 
