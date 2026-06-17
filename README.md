# TeleCare AI 🩺
### *A Secure, AI-Powered Virtual Healthcare & Digital Clinic Platform*

TeleCare AI is a comprehensive B2B telemedicine Operating System (OS) and virtual clinic platform built using Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Prisma, and SQLite (via LibSQL). It connects patients, doctors, and clinic administrators through secure video visits, encrypted messaging, automated clinical workflows, remote biometrics monitoring, and advanced AI-driven tools.

---

## 🚀 Key Modules & Experiences

The platform supports **4 primary portals** and **8 distinct OS modules**:

```
TeleCare AI
├── 🌐 Public Healthcare Website (discovery & pricing)
├── 💬 Secure Messaging Hub (encrypted Patient ↔ Doctor chat)
├── 🩺 Patient Portal
│   ├── 📊 Remote Patient Monitoring (RPM) Health Dashboard
│   └── 👨‍👩‍👧 Family Sub-profile Management
├── 🥼 Doctor Workspace
│   └── 🤖 EMR Clinical Drawer with AI Care Plan Generator
└── 👑 Admin Dashboard (BI analytics, Automation Engine, HIPAA logs)
```

---

## 🤖 Deep Dive into AI Features & SaaS Workflows

### 1. 🤖 AI Pre-Consultation Assistant
*   **Intake Form**: Before a consultation, the AI gathers details about symptoms, duration, history, and questions in natural language.
*   **Doctor Brief**: The AI compiles a structured clinical brief for the doctor (main concern, duration, medical flags, and patient questions) to save clinical triage time.

### 2. 🔍 AI Doctor Matching System
*   Located on `/find-doctors`, patients type symptoms (e.g., *"my chest feels tight"*). The AI searches through doctor specialties, experience, and bios, returning matching doctors ranked with percentage compatibility scores.

### 3. 📈 RPM Health Monitoring Dashboard (`/patient/health`)
*   Provides 30-day biometric history plots (systolic/diastolic BP, heart rate, fasting glucose) indicating wellness streaks, target zones, and a dynamic wellness/compliance score based on data logs.

### 4. 🤖 AI Care Plan Generator (`/doctor/dashboard`)
*   From the EMR drawer, doctors can generate a personalized Care Plan card containing diagnosis summaries, medication schedules, monitoring targets (e.g., *"keep BP < 130/80"*), lifestyle targets, and follow-up reviews.

### 5. ⚡ Healthcare Automation Engine (`/admin/automation`)
*   A visual node workflow showing clinic automation (e.g., Consultation Completed → AI Visit Summary → Patient SMS/Notification → Feedback Survey). Features an interactive simulation runner.

### 6. 🔐 Security & HIPAA Audit Center (`/admin/security`)
*   Tracks PHI access logs, encrypts details (AES-256, TLS 1.3 indicators), and features an interactive HIPAA safeguard audit checklist.

### 7. 👨‍👩‍👧 Family Sub-Profile Management (`/patient/family`)
*   Allows patient users to manage and switch contexts between primary accounts and dependents (e.g., Sarah Jenkins & Robert Jenkins) to review custom prescriptions, health files, and scores.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Core Framework** | Next.js 16.2 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Database** | SQLite + LibSQL |
| **ORM** | Prisma v7.8 |
| **Styling** | Tailwind CSS v4 |
| **Icons & Anim** | Lucide React + Framer Motion |
| **Session Auth** | Client-side Context with persistent local storage |

---

## 📊 Database Schema

The SQLite schema model highlights:
*   **User**: Role-based authentication (ADMIN, DOCTOR, PATIENT).
*   **Doctor**: Credentials, experience, rate, specialties, availability.
*   **Patient**: Dependents data, medical history, files.
*   **Appointment**: Scheduling, statuses (CONFIRMED, COMPLETED), billing.
*   **Consultation**: AI visit summary, prescriptions, clinical notes.
*   **VitalLog**: Systolic/Diastolic blood pressure, heart rate, glucose history.
*   **Message**: Threaded inbox content between doctors and patients.
*   **Notification**: Real-time alerts with unread/read state.

---

## 🛠️ Getting Started & Local Development

### 1. Installation
Install dependencies in the project root:
```bash
npm install
```

### 2. Database Sync & Seeding
Push the database schema and run the seed script to populate mock users, 30 days of vitals logs, notifications, and secure chat history:
```bash
# Push schema to SQLite
npx prisma db push

# Generate client
npx prisma generate

# Populate database
node prisma/seed.js
```

### 3. Running the Server
Run the local Next.js dev server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Seeded Demo Accounts
Use the floating **Quick Switch** button in the bottom right corner of the application to switch roles instantly without manual login:
*   **Patient**: `sarah.jenkins@telecare.ai` (Password: `patient123`)
*   **Doctor**: `ahmed.ali@telecare.ai` (Password: `doctor123`)
*   **Admin**: `admin@telecare.ai` (Password: `admin123`)

---

## 📦 Production Deployment

To compile the production build:
```bash
npm run build
```
The application will bundle all static pages and dynamic video/consultation routes with zero TS compilation warnings or errors.
