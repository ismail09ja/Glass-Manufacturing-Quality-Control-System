# Professional Presentation Guide: Glass Manufacturing Quality Control System

This document explains the industrial logic and technical architecture of my project. 

---

## 1. Project Concept: What is this?
This is a **Quality Control (QC) and Batch Management System**. In a glass factory, production isn't continuous; it happens in "batches." If one batch of glass is too brittle or has air bubbles, it can cost the factory millions. This system ensures that every batch is tracked from the furnace to the final inspection, catching errors before they reach customers.

---

## 2. The Core Workflow

### A. Batches (Production Phase)
*   **Purpose**: You can't fix glass once it's cooled if the ingredients were wrong. You must track it at the source.
*   **Furnace Temperature**: Essential for chemical bonding. If the furnace is too cold, the raw materials won't melt properly. If too hot, the glass becomes too liquid and thin.
*   **Raw Material Composition**: Glass is a mix of Silica (sand), Soda Ash, and Limestone. Tracking this ensures the recipe (formula) matches the product requirements.

### B. Quality Inspection (Validation Phase)
*   **Purpose**: After the glass is manufactured, it is tested against standards.
*   **Metrics**: 
    *   **Thickness**: Ensures durability.
    *   **Transparency**: Crucial for optical quality.
    *   **Strength Test (MPa)**: Measures "Fracture Toughness"—does the glass break under a standard load?
*   **Decision**: This is where we decide if a batch is "Pass" or "Fail."

### C. Alerts & Defect Management (Corrective Phase)
*   **Alerts**: If a batch fails, the system **automatically** generates a high-priority alert. This prevents a "Production Manager" from unknowingly shipping bad glass.
*   **Defects**: If a batch has a specific issue (like "Bubbles" or "Cracks"), the inspector logs it so engineers can fix the factory machinery for future batches.

---

## 3. Role-Based Access Control (RBAC)
Real-world factories have "separation of duties." We implemented this to prevent data tampering.

1.  **Admin**: The system supervisor. Can manage users and has full read/write access to everything.
2.  **Production Manager**: Responsible for the "input." They create **Batches** and manage the factory floor. They don't do the inspections (to avoid conflict of interest).
3.  **Quality Inspector**: The "watchdog." They create **Inspections** and report **Defects**. They cannot change the Batch data (like furnace temp) because that would be cheating the report.

---

## 4. Technical Architecture (The "Wow" Factor)

*   **Next.js (Frontend)**: Used for high-performance rendering and SEO. The "App Router" provides a smooth, state-of-the-art user experience.
*   **Recharts (Analytics)**: Instead of just showing lists, we used data visualization. This allows managers to see "Defect Rates" and "Inspector Performance" visually, which is how modern industrial ERPs (Enterprise Resource Planning systems) work.
*   **MongoDB (Database)**: Glass factory data is high-volume. MongoDB (NoSQL) allows us to store complex objects (like a batch with varying material compositions) more flexibly than traditional SQL.
*   **Docker & Docker Compose**: This is **DevOps-level engineering**. It ensures the system runs perfectly on any computer (Mac, Windows, Linux) by packaging the database, backend, and frontend into containers.

---

## 5. Summary 
> "This project demonstrates an end-to-end industrial software solution. It covers **Full-Stack Development** (React/Node/Express), **Cloud-Ready Deployment** (Docker/CI-CD), **Data Engineering** (NoSQL modeling), and **Business Logic** (RBAC and automated alerting)."
