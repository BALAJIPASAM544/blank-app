AI Email Management Dashboard

Monorepo with React + TypeScript frontend (Vite) and Java Spring Boot backend.

Prerequisites
- Node 18+
- Java 21+
- Maven 3.9+

Backend (Spring Boot)
1) Open a terminal:
```
cd /workspace/backend
mvn spring-boot:run
```
The API will start at http://localhost:8080

Endpoints:
- GET /api/emails?sentiment=Positive|Neutral|Negative|All&priority=Urgent|Normal|All&q=search&sort=asc|desc
- GET /api/emails/{id}
- POST /api/emails (body: EmailDetails)
- POST /api/emails/{id}/reply (body: { "reply": "..." })
- GET /api/analytics

Frontend (React + Vite)
1) In a second terminal:
```
cd /workspace/frontend
npm install
npm run dev
```
The app runs at http://localhost:5173

Config
- Frontend env var `VITE_API_BASE` can override API base (default http://localhost:8080/api)

Notes
- CORS is enabled for localhost ports in the backend.
- Frontend falls back to local mock data if backend is unavailable.

# 🎈 Blank app template

A simple Streamlit app template for you to modify!

[![Open in Streamlit](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://blank-app-template.streamlit.app/)

### How to run it on your own machine

1. Install the requirements

   ```
   $ pip install -r requirements.txt
   ```

2. Run the app

   ```
   $ streamlit run streamlit_app.py
   ```
