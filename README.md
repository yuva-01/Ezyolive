# EzyOlive Healthcare Practice Management System

A comprehensive healthcare practice management system designed to streamline clinical workflows, patient management, and administrative tasks.

## Features

- **User Management & Authentication**
  - Role-based access control (Admin, Doctor, Nurse, Receptionist, Patient)
  - JWT-based authentication
  - Profile management
  
- **Appointment Scheduling**
  - Calendar view
  - Appointment reminders
  - Recurring appointments
  - Availability management
  
- **Electronic Health Records (EHR)**
  - Patient demographics
  - Medical history
  - Treatment plans
  - Prescriptions and medications
  - Lab results
  
- **Telehealth Module**
  - Video consultations
  - Secure messaging
  - Session recordings
  - Virtual waiting room
  
- **Billing & Payments**
  - Invoice generation
  - Payment processing
  - Insurance claim management
  - Financial reporting
  
- **AI Automation**
  - Appointment scheduling assistance
  - Basic symptom analysis
  - Documentation automation
  
- **Analytics & Reporting**
  - Practice performance metrics
  - Revenue analytics
  - Patient demographics
  - Treatment outcomes
  
- **Security & Compliance**
  - Data encryption
  - Audit logging
  - HIPAA compliance features

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- REST API

### Frontend
- React
- Redux for state management
- TailwindCSS for styling
- Formik for form handling

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ezyolive.git
cd ezyolive
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
   - Copy `.env.example` to `.env` in the backend folder
   - Update the values as needed

5. Start development servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

## Project Structure

```
ezyolive/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # API controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── server.js       # Main server file
│
└── frontend/
    ├── public/         # Static assets
    └── src/
        ├── components/ # Reusable components
        ├── features/   # Redux slices and services
        ├── layouts/    # Layout components
        ├── pages/      # Page components
        └── App.js      # Main application component
```

## API Documentation

API documentation is available at `/api-docs` when the backend server is running.

## License

This project is licensed under the MIT License.
