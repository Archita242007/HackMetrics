# 🏆 HackMetrics — Hackathon Evaluation & Judging Platform

> A secure, real-time hackathon evaluation platform that simplifies judging, prevents duplicate evaluations, and provides a centralized leaderboard for organizers.

---

## 🚀 Overview

**HackMetrics** is a web-based hackathon evaluation platform designed to make the judging process faster, more organized, and more reliable.

Instead of managing scores manually using spreadsheets or forms, HackMetrics provides dedicated dashboards for **Administrators** and **Judges**.

Judges can securely log in, select teams, score projects across multiple criteria, and submit their evaluations. Administrators can monitor evaluations and view the final leaderboard.

The platform uses **Firebase Authentication** for secure login and **Cloud Firestore** for storing evaluation data.

---

## ✨ Key Features

### 🔐 Secure Authentication

* Firebase Email/Password Authentication
* Role-based access control
* Separate Admin and Judge access
* Protected dashboard routes
* Secure logout functionality

### 👨‍⚖️ Judge Evaluation System

Judges can:

* View participating teams
* Select a team
* View project information
* Score projects from **1–10**
* Evaluate:

  * 💡 Innovation
  * 💻 Code Quality
  * 🎤 Presentation
* View the total score instantly
* Submit evaluations securely
* Prevent accidental duplicate submissions

### 🛡️ Evaluation Security

Each evaluation is associated with:

* Judge UID
* Team ID
* Team name
* Project name
* Individual criterion scores
* Total score
* Average score
* Submission timestamp

A judge can evaluate each team only once.

Firestore Security Rules validate:

* Authenticated users
* Judge ownership
* Team information
* Score ranges
* Total score calculation
* Evaluation document IDs

Submitted evaluations cannot be modified or deleted.

### 📊 Results & Leaderboard

The Results page:

* Collects evaluations from judges
* Combines scores from multiple judges
* Calculates final scores
* Calculates averages
* Ranks teams
* Displays the final leaderboard

### 👨‍💼 Admin Dashboard

The Admin dashboard provides an overview of:

* Teams
* Judges
* Evaluation progress
* Submitted evaluations
* Overall judging status

---

## 🧑‍⚖️ User Roles

HackMetrics currently supports two roles:

| Role  | Access                                          |
| ----- | ----------------------------------------------- |
| Admin | Admin dashboard, evaluation monitoring, results |
| Judge | Team evaluation and scoring                     |

The user's role is stored in Firestore and checked after Firebase Authentication.

---

## 🔄 Application Flow

```text
                    ┌──────────────┐
                    │    Login     │
                    └──────┬───────┘
                           │
                           ▼
                Firebase Authentication
                           │
                           ▼
                    Check User Role
                     /            \
                    /              \
                   ▼                ▼
              Admin Role        Judge Role
                   │                │
                   ▼                ▼
             Admin Dashboard   Judge Dashboard
                   │                │
                   │                ▼
                   │          Select Team
                   │                │
                   │                ▼
                   │          Score Project
                   │                │
                   │                ▼
                   │       Submit Evaluation
                   │                │
                   └───────┬────────┘
                           ▼
                    Firestore Database
                           │
                           ▼
                    Results / Leaderboard
```

---

## 🧮 Evaluation Criteria

Each project is evaluated on three criteria.

| Criterion    | Maximum Score |
| ------------ | ------------: |
| Innovation   |            10 |
| Code Quality |            10 |
| Presentation |            10 |
| **Total**    |        **30** |

### Total Score

```text
Total = Innovation + Code Quality + Presentation
```

### Average Score

```text
Average = Total / 3
```

When multiple judges evaluate the same team, the Results page combines their evaluations to determine the final ranking.

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Framer Motion
* Lucide React

### Backend / Database

* Firebase Authentication
* Cloud Firestore

### Development Tools

* Git
* GitHub
* VS Code
* npm

### Deployment

* Vercel

---

## 📁 Project Structure

```text
hackmetrics/
│
├── app/
│   ├── admin/
│   │   └── page.tsx
│   │
│   ├── judge/
│   │   └── page.tsx
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── results/
│   │   └── page.tsx
│   │
│   ├── globals.css
│   └── page.tsx
│
├── components/
│   └── ui/
│
├── lib/
│   ├── firebase.ts
│   └── utils.ts
│
├── public/
│
├── .gitignore
├── components.json
├── package.json
├── package-lock.json
└── README.md
```

---

## 🔥 Firebase Data Structure

### Users

```text
users/
    {userUID}
        email: "judge@hackmetrics.com"
        role: "judge"
```

Example:

```text
users/
    JUDGE_UID
        email: "judge2@hackmetrics.com"
        role: "judge"
```

Admin:

```text
users/
    ADMIN_UID
        email: "organizer@gmail.com"
        role: "admin"
```

### Evaluations

```text
evaluations/
    {judgeUID}_{teamID}
```

Each evaluation contains:

```text
teamId
teamName
project
innovation
codeQuality
presentation
total
average
judgeId
createdAt
```

---

## 🔒 Firestore Security

Firestore Security Rules ensure that:

* Only authenticated users can access evaluations.
* A judge can only create an evaluation using their own UID.
* Each judge can submit only one evaluation per team.
* Scores must be between 1 and 10.
* Total scores must be calculated correctly.
* Submitted evaluations cannot be edited.
* Submitted evaluations cannot be deleted.

This prevents accidental or unauthorized modification of judging results.

---

## 💻 Running the Project Locally

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Enter the project

```bash
cd hackmetrics
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure Firebase

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> Never commit `.env.local` to GitHub.

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔑 Demo Login

### Admin

```text
Email: organizer@gmail.com
Password: zxcv123
```

### Judge 1

```text
Email: judge@hackmetrics.com
Password: asdfg123
```

### Judge 2

```text
Email: judge2@hackmetrics.com
Password: lkj987
```

> **Security note:** Do not publish real passwords in a public GitHub repository. Provide passwords to evaluators through the hackathon submission form or another private channel.

---

## 🧪 Testing

The application has been tested for:

* Admin authentication
* Judge authentication
* Judge 1 evaluation
* Judge 2 evaluation
* Role-based routing
* Logout
* Duplicate evaluation prevention
* Firestore permissions
* Multiple judge evaluations
* Results calculation
* Leaderboard ranking
* Normal browser sessions
* Incognito browser sessions

---

## 📸 Screenshots

### 🏠 Landing Page
![HackMetrics Landing Page](./screenshots/home.png)

### 🔐 Login Page
![HackMetrics Login Page](./screenshots/login.png)

### 👨‍⚖️ Judge Dashboard
![HackMetrics Judge Dashboard](./screenshots/judge.png)

### 👨‍💼 Admin Dashboard
![HackMetrics Admin Dashboard](./screenshots/admin.png)

---

## 🌐 Live Demo

**Live Application:**

```text
YOUR_VERCEL_URL
```

Example:

```text
https://hackmetrics.vercel.app
```

---

## 🎯 Problem Statement

Hackathon organizers often rely on spreadsheets, forms, or manual processes to collect judging scores.

This can lead to:

* Duplicate evaluations
* Incorrect calculations
* Difficult score management
* Lack of centralized results
* Poor visibility into judging progress
* Security concerns

HackMetrics solves these problems through a centralized and secure digital judging platform.

---

## 💡 Why HackMetrics?

HackMetrics focuses on three major goals:

### 1. Security

Firebase Authentication and Firestore Security Rules ensure that only authorized users can perform judging actions.

### 2. Reliability

Automatic score calculation eliminates manual arithmetic and reduces human errors.

### 3. Simplicity

Judges get a clean interface where they can quickly select teams, evaluate projects, and submit scores.

---

## 🔮 Future Improvements

Potential future enhancements include:

* Real-time admin analytics
* Judge assignment management
* More evaluation criteria
* Weighted scoring
* Export results to CSV/PDF
* Team submission management
* Judge comments and feedback
* Tie-breaking mechanisms
* Audit logs
* Email notifications
* Advanced leaderboard visualizations

---

## 👩‍💻 Author

**Archita Sablok**

B.Tech Computer Science & Engineering (AI/ML)

---

## 📄 License

All rights reserved unless otherwise specified.
