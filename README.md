🤖 MERN AI Chatbot - Live on AWS
A professional full-stack AI Chatbot application built using the MERN stack and integrated with Google Gemini AI. This project demonstrates a complete end-to-end deployment on AWS EC2 using Nginx and PM2.
🚀 Live Demo
Check out the live application here: http://54.153.130.77
✨ Features
AI-Powered Conversations: Real-time chat using Gemini API.

Secure Authentication: User signup/login with JWT and HTTP-only cookies.

Persistent Chat History: Chat logs stored securely in MongoDB.

Responsive UI: Modern design using Material UI (MUI).

Production Ready: Fully deployed on AWS with a reverse proxy.

🛠️ Tech Stack
Frontend: React.js, TypeScript, Material UI (MUI), Vite.

Backend: Node.js, Express.js.

Database: MongoDB (Atlas).

AI Model: Google Gemini Pro.

DevOps: AWS EC2, Nginx, PM2, Git.

🏗️ Deployment Architecture
The application is hosted on an AWS EC2 Ubuntu Instance.

Nginx: Acts as a reverse proxy, serving the static frontend files and forwarding API requests to the Node.js server.

PM2: Manages the backend process to ensure 24/7 uptime.

Security Groups: Configured to allow traffic on Port 80 (HTTP) and Port 5000 (API).
