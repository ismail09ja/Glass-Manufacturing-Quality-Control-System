# 🏺 Glass Manufacturing Quality Control System (GMQCS)

A state-of-the-art, full-stack manufacturing management platform designed for real-time quality control, batch tracking, and defect analytics in the glass production industry.

![Dashboard Preview](https://via.placeholder.com/1200x600/12121e/22d3ee?text=Glass+QC+Premium+Dashboard)

## ✨ Key Features

*   **💎 Premium Glassmorphism UI**: High-end dark mode interface with vibrant accents and smooth micro-animations.
*   **📊 Dynamic Dashboard**: Real-time KPIs for Pass Rates, Open Defects, and Production Volume using Recharts.
*   **🏭 Batch Management**: Comprehensive lifecycle tracking from "In Production" to "Completed" or "Rejected".
*   **🔍 Quality Inspections**: Structured inspection workflows with detailed scoring and result tracking.
*   **⚠️ Defect Analytics**: Real-time defect logging with severity levels and historical trend analysis.
*   **📅 Production Calendar**: Visual timeline of scheduled and completed production batches.
*   **📥 Advanced Reporting**: Exportable CSV reports for batches, inspections, and defects.
*   **🔒 Secure Authentication**: Role-based access control (RBAC) powered by JWT.

## 🛠️ Technical Stack

*   **Frontend**: React 19, Vite, TailwindCSS (Vanilla CSS Glass Design), Lucide Icons, Recharts.
*   **Backend**: Node.js, Express, Mongoose, JWT, Morgan, Helmet.
*   **Database**: MongoDB (supports Atlas and Local In-Memory Fallback).
*   **Containerization**: Docker & Docker Compose for rapid deployment.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Optional, as the system includes an in-memory fallback)
- Docker (Optional)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ismail09ja/Glass-Manufacturing-Quality-Control-System.git
   cd Glass-Manufacturing-Quality-Control-System
   ```

2. **Run with Docker (Recommended):**
   ```bash
   docker-compose up --build
   ```

3. **Manual Setup:**
   
   **Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   
   **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📂 Project Structure

```text
├── backend/            # Express API & MongoDB Models
├── frontend/           # React + Vite UI Application
├── docker-compose.yml  # Multi-container orchestration
└── .gitignore          # Production-ready git filtering
```

## 📜 License
Internal Quality Control System - All Rights Reserved.
