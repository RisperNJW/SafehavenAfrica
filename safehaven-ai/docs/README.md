# SafeSpace AI - GBV Detection Chatbot

Real-time Gender-Based Violence detection system with Django backend and React frontend.

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/chatbot/

## 📚 Documentation

- [Installation Guide](./docs/INSTALLATION.md)
- [API Documentation](./docs/API-DOCUMENTATION.md)
- [Team Setup](./docs/TEAM-SETUP.md)

## ✨ Features

- Real-time harmful message detection
- 6 abuse categories: threats, harassment, gaslighting, coercion, stalking, emotional manipulation
- Action buttons: Report, Block, Save Evidence, Delete
- Evidence vault with export
- Severity scoring and safe response suggestions

## 🧪 Testing
```bash
# Test backend
curl http://localhost:8000/api/chatbot/health

# Test detection
curl -X POST http://localhost:8000/api/chatbot/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"You are worthless"}'
```

## 📞 Support

For issues or questions, contact the team or open an issue on GitHub.

 
