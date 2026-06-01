# 🚀 AI Powered Job Portal

An advanced **Full Stack AI-Powered Job Portal** built with **React.js, Django REST Framework, FastAPI, PostgreSQL, and Machine Learning**.

This platform connects **Job Seekers, Recruiters, and Admins** through an intelligent recruitment ecosystem featuring resume parsing, job recommendations, AI chat assistance, and analytics dashboards.

---

## 🌟 Key Features

### 👨‍💼 Job Seeker Features

* User registration and JWT authentication
* Create and update professional profiles
* Upload resumes (PDF/DOCX)
* AI-powered resume parsing
* Personalized job recommendations
* Apply to jobs with one click
* Track application status
* Saved jobs and notifications
* AI career chatbot assistance

### 🏢 Recruiter Features

* Recruiter registration and profile management
* Post, edit, and delete jobs
* View applications per job
* Candidate filtering and search
* Recruiter insights dashboard
* Profile viewer
* Shortlist and reject candidates

### 🛡️ Admin Features

* Manage users, recruiters, and jobs
* Approve or block accounts
* View platform analytics
* Invite users
* Applications monitoring
* Recycle bin and restore functionality

### 🤖 AI Features

* Resume parsing using NLP
* Resume-to-job matching
* AI-based job recommendation engine
* Career guidance chatbot
* Skill extraction and keyword analysis

### 📊 Dashboards & Analytics

* Job statistics
* Applications analytics
* Recruiter insights
* User activity summaries

### 📱 Responsive Design

* Fully responsive desktop, tablet, and mobile layouts
* Mobile overlay sidebar navigation
* Interactive cards and animations

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS
* Framer Motion
* React Icons
* React Parallax Tilt

### Backend

* Django
* Django REST Framework
* Simple JWT
* Django Filters
* CORS Headers

### AI Service

* FastAPI
* Python NLP libraries
* Custom recommendation engine

### Database

* PostgreSQL

### Authentication

* JWT (JSON Web Tokens)

### Email Service

* Gmail SMTP

---

## 📁 Project Structure

```text
AI-POWERED-JOB-PORTAL/
│
├── backend/                # Django REST API
│   ├── accounts/
│   ├── jobs/
│   ├── config/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/               # React Frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── tailwind.config.js
│
├── ai-service/             # FastAPI AI microservice
│   ├── main.py
│   └── models/
│
├── .gitignore
├── README.md
└── requirements.txt
```

---

## ⚙️ Installation Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/SRIHARSH291/AI-POWERED-JOB-PORTAL.git
cd AI-POWERED-JOB-PORTAL
```

---

## 🐍 Backend Setup (Django)

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at:

```text
http://127.0.0.1:8000/
```

---

## ⚛️ Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```text
http://localhost:3000/
```

---

## 🤖 AI Service Setup (FastAPI)

```bash
cd ai-service
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

AI service runs at:

```text
http://127.0.0.1:8001/
```

---

## 🔐 Environment Variables

Create a `backend/.env` file:

```env
SECRET_KEY=your-django-secret-key
DEBUG=True

DB_NAME=job_portal_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=127.0.0.1
DB_PORT=5432

EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
DEFAULT_FROM_EMAIL=your_email@gmail.com
```

---

## 🧪 Demo Accounts

| Role       | Credentials                       |
| ---------- | --------------------------------- |
| Admin      | Create with `createsuperuser`     |
| Recruiter  | Register through recruiter signup |
| Job Seeker | Register through user signup      |

---

## 📡 Main API Endpoints

### Authentication

* `POST /api/register/`
* `POST /api/login/`
* `POST /api/token/refresh/`

### Jobs

* `GET /jobs/`
* `POST /jobs/create/`
* `PUT /jobs/<id>/`
* `DELETE /jobs/<id>/`

### Applications

* `POST /jobs/<id>/apply/`
* `GET /applications/`

### AI Endpoints

* Resume parsing
* Job recommendation
* Skill extraction
* Chatbot assistance

---

## 🖼️ Screenshots

Add screenshots to showcase:

* Landing page
* User dashboard
* Recruiter dashboard
* Admin dashboard
* AI chatbot
* Job recommendation page
* Mobile responsive sidebar

---

## 🚀 Deployment

### Frontend

* Vercel / Netlify

### Backend

* Render / Railway / AWS EC2

### Database

* PostgreSQL (Railway, Supabase, Neon)

### AI Service

* Render / Railway

---

## 📌 Future Enhancements

* Interview scheduling
* Video interviews
* Real-time chat
* Advanced recommendation model
* Skill gap analysis
* Cover letter generator

---

## 🧠 Learning Outcomes

This project demonstrates:

* Full Stack Development
* REST API Design
* JWT Authentication
* PostgreSQL Integration
* AI/NLP Integration
* Microservices Architecture
* Responsive UI/UX
* Role-Based Access Control

---

## 👨‍💻 Author

**Sriharsh Burra**

* GitHub: https://github.com/SRIHARSH291
* LinkedIn: https://www.linkedin.com/in/sriharsh-burra
* Email:  sriharshburra291@gmail.com

---

## ⭐ Support

If you found this project useful:

* ⭐ Star the repository
* 🍴 Fork the project
* 🛠️ Contribute improvements

---

## 📄 License

This project is for educational and portfolio purposes.
