# Installation Guide

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Testing
```bash
curl http://localhost:8000/api/chatbot/health
```

Open http://localhost:5173 in browser
