# SafehavenAfrica
Anonymous GBV Reporting Platform for African women &amp; girls. 
SafeHaven — Gender-Based Violence Support & Reporting Platform
SafeHaven is a digital platform designed to support individuals affected by Gender-Based Violence (GBV). It offers secure reporting, real-time assistance, access to advocates, counseling services, fund requests, and donation features.
The system integrates React, Django, Blockchain, and AI-driven chat assistance to ensure privacy, efficiency, and accessibility.

📌 Table of Contents
•	About SafeHaven
•	Core Features
•	Technology Stack
•	System Architecture
•	Key Modules
•	AI Chatbox
•	Blockchain Integration
•	Installation & Setup
•	Environment Variables
•	API Overview
•	Screenshots / Demo
•	Roadmap
•	Contributing
•	License


## The app live

[live](https://safehave.netlify.app/)




📖 About SafeHaven
SafeHaven is built to provide a confidential, secure, and accessible support system for individuals experiencing GBV. The platform aims to bridge the gap between victims, advocates, counselors, and donors using modern technology such as blockchain for transparency, AI for real-time guidance, and cloud-based reporting workflows.
The platform prioritizes:
•	Safety
•	Privacy
•	Ease of access
•	Data integrity
•	Fast help-seeking
________________________________________
⭐ Core Features
🔒 1. GBV Reporting System
•	Users can securely create GBV reports.
•	Multiple report categories:
Physical abuse, emotional abuse, financial abuse, harassment, etc.
•	Encrypted and tracked through blockchain.
💬 2. AI Chatbox Assistant
•	Provides real-time guidance, safety tips, and information.
•	Helps with steps such as reporting, requesting help, emergency tips, etc.
•	Works 24/7 and supports anonymous conversations.
👩⚖️ 3. Advocate Request Module
•	Users can request legal help or advocates.
•	Requests are assigned to available human professionals.
🧠 4. Counseling Services
•	Allows users to book counseling sessions with professionals.
•	Supports scheduling and follow-up.
💰 5. Emergency Fund Requests
•	Users can request financial help when escaping unsafe environments.
•	Distributed funds are recorded on blockchain for transparency.
❤️ 6. Donation System
•	Public users can donate to support survivors.
•	Blockchain ensures funds are traceable and tamper-proof.
📲 7. User Dashboard
•	Users can view reports, track progress, messages, sessions, and fund status.
🛡 8. Secure Authentication
•	JWT-based authentication.
•	Role-based access: User / Advocate / Counselor / Admin.

🧰 Technology Stack
Frontend (React)
•	React + Vite 
•	TypeScript 
•	Redux / Context API
•	Axios
•	TailwindCSS / Styled Components
Backend (Django & Django REST Framework)
•	Django
•	Django REST Framework (DRF)
•	JWT Authentication
•	PostgreSQL / MySQL
•	Celery (optional for async jobs)
Blockchain
•	Ethereum / Hyperledger / Local chain (depending on setup)
•	Smart contracts for:
o	Donations
o	Fund disbursement
o	Report verification
AI Component
•	Model integrated with backend
•	Natural language understanding for GBV guidance
•	Safe and filtered responses

🏗 System Architecture
Frontend (React)
     ↓ REST API Calls
Backend (Django REST Framework)
     ↓
Database 
     ↓
Blockchain Network (Smart Contracts)
     ↓
AI Chat Engine

🔍 Key Modules
1. Reports Module
•	Create, edit, and manage GBV reports
•	Attach proof (images, documents)
•	Blockchain hash stored for immutability
2. Funds Request Module
•	Request emergency funds
•	Approvals by admin
•	Blockchain record on each disbursement
3. Counseling Module
•	Session scheduling
•	Counselor assignment
•	User feedback & follow-ups
4. Advocates Module
•	Legal help requests
•	Advocate profile
•	Evidence management
5. Donations Module
•	Donor dashboard
•	Contribution tracking
•	Immutable blockchain receipts

🤖 AI Chatbox
The SafeHaven AI assistant provides:
•	Emotional support (non-clinical)
•	Steps on reporting GBV
•	Safety planning
•	Explanation of services
•	Quick navigation through the platform
It does not replace professional help but acts as a supportive guide.

🔗 Blockchain Integration
Blockchain is used for:
•	Donation tracking
•	Fund distribution
•	Report hashing (immutability)
Benefits:
•	Transparency
•	Fraud prevention
•	Tamper-proof records
________________________________________
🛠 Installation & Setup
1. Clone the Repository
git clone https://github.com/your-username/safehaven.git
cd safehaven
________________________________________
2. Frontend Setup (React)
cd frontend
npm install
npm run dev
________________________________________
3. Backend Setup (Django)
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
________________________________________
4. Blockchain Setup
If using Hardhat:
cd blockchain
npm install
npx hardhat compile
npx hardhat node
Deploy contract:
npx hardhat run scripts/deploy.js --network localhost
________________________________________
🔐 Environment Variables
Create a .env file in both frontend and backend folders.
Backend (.env):
SECRET_KEY=your_secret_key
DB_NAME=safehaven
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
JWT_SECRET=your_jwt_secret
BLOCKCHAIN_PROVIDER=http://127.0.0.1:8545/
CONTRACT_ADDRESS=your_contract_address
Frontend (.env):
VITE_API_URL=http://localhost:8000/api
VITE_CONTRACT_ADDRESS=your_contract_address
________________________________________
📡 API Overview
Auth
•	POST /auth/register
•	POST /auth/login
•	POST /auth/logout
Reports
•	POST /reports/create
•	GET /reports/user
•	PUT /reports/update/:id
Funds
•	POST /funds/request
•	GET /funds/status
Counseling
•	POST /counseling/book
•	GET /counseling/sessions
Advocates
•	POST /advocates/request
•	GET /advocates/status
Donations
•	POST /donations/make
•	GET /donations/track
________________________________________
🛣 Roadmap
Planned Features
•	Real-time advocate chat
•	Anonymous usernames for safety
•	Geo-location based emergency routing
•	Offline mode for low-network regions
•	Automatic safety alerts feature
____________________________________
.donation to victims____
🤝 Contributing
We welcome contributions!
To contribute:
1.	Fork the repo
2.	Create a feature branch
3.	Commit changes
4.	Submit a pull request
________________________________________
📄 License
This project is licensed under the MIT License.
You are free to use, copy, and modify it with proper Attribution.




