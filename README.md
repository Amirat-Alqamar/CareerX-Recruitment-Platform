# CareerX — Recruitment & Talent Acquisition Platform

<p align="center">
  <strong>An enterprise-grade recruitment ecosystem connecting Job Seekers, Employers, and Administrators in a single high-performance web application.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 12" />
  <img src="https://img.shields.io/badge/Inertia.js-3.x-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia.js" />
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Localization-EN%20%7C%20AR%20(RTL)-008A7B?style=for-the-badge" alt="Bilingual RTL/LTR" />
</p>

---

## 📌 Project Overview

**CareerX** is a modern recruitment and talent platform built to streamline the hiring lifecycle for candidates, corporate recruiters, and platform administrators. Built with **Laravel 12**, **Inertia.js**, and **React 19**, it delivers a responsive Single Page Application (SPA) experience backed by a robust and secure backend architecture.

---

## ✨ Core Features & Portals

### 👨‍💼 1. Job Seeker Portal
* **Comprehensive Career Profile:** Manage work experience, education, skills, spoken languages, verified certifications, and project portfolio.
* **Resume Management:** Upload and download resumes in multiple formats (PDF / DOCX).
* **Smart Job Search & Filtering:** Filter by job type (Full-time, Part-time, Internship, Freelance), work arrangement (On-site, Remote, Hybrid), location, and salary expectations.
* **Application Tracker:** Monitor application status in real-time (`Applied`, `Under Review`, `Interview Scheduled`, `Accepted`, `Rejected`).
* **Saved Jobs:** Bookmark and organize opportunities for quick application.

### 🏢 2. Employer & Corporate Portal
* **Company Profile Management:** Showcase company identity with logos, banner images, company story, and official links.
* **Job Posting Lifecycle:** Full CRUD management for job listings, including duplicate posting and one-click status toggle (Active/Closed).
* **Applicant Tracking System (ATS Pipeline):** Visual pipeline to evaluate candidate profiles, inspect resumes, and update recruitment stages.
* **Automated Interview Scheduling:** Schedule interviews with candidate notification and automated Google Meet room generation.

### 🛡️ 3. Administrative Control Center
* **Executive Analytics & Deep Reporting:** Real-time platform metrics and trends with **multi-page, print-ready PDF export**.
* **Job Post Moderation:** Review and approve or reject employer listings before publication.
* **User Management:** Monitor user activity with immediate ban/unban capabilities.
* **Dynamic Role-Based Access Control (RBAC):** Catalog-based abilities system powered by Laravel Gates, allowing custom roles creation and granular permission delegation.

---

## ⚙️ Technical Highlights

* **Modern Monolith Architecture:** Combines Laravel’s backend power and security with React’s client-side speed via Inertia.js — eliminating the overhead of managing a separate REST API.
* **Full Bilingual Support (Arabic & English):** Native bi-directional layout support (**RTL / LTR**) with automated domain-based translation loading.
* **Hardened Security & 2FA:** Built-in Two-Factor Authentication with QR codes, recovery codes, and Passkey support powered by Laravel Fortify.
* **Modular Routing:** Clean domain-driven route segmentation (`job_seeker.php`, `employer.php`, `admin.php`, `role-permession.php`).
* **Optimized Print Engine:** Custom `@media print` styling for generating clean, multi-page PDF documents for analytics and candidate dossiers.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | PHP 8.2+, Laravel 12, Laravel Fortify, Eloquent ORM |
| **Frontend** | React 19, Inertia.js v3, Tailwind CSS, Lucide Icons, Vite |
| **Database** | MySQL / SQLite |
| **Localization** | `mcamara/laravel-localization` & Modular JSON Auto-Merger |
| **Authorization** | Custom RBAC (Role-Permission Package) with Native Laravel Gates |

---

## 🚀 Quick Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/souha-2003/CareerX-Recruitment-Platform.git
cd CareerX-Recruitment-Platform
```

### 2. Install Dependencies
```bash
composer install
npm install
```

### 3. Environment & Database Configuration
```bash
cp .env.example .env
php artisan key:generate
```
*Configure your database credentials in `.env`, then run:*
```bash
php artisan migrate --seed
php artisan storage:link
```

### 4. Start Development Servers
```bash
npm run dev
php artisan serve
```
*Access the application at: `http://127.0.0.1:8000`*

---

## 🔐 Default Admin Account

After running the database seeders, the default administrator account is available:

| Account | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@careerx.com` | `password` | Super Admin |

> **Note:** Employers and Job Seekers can easily register new accounts directly through the registration page (`/register`) by selecting their desired account type.

---

## 📄 License
This project is open-source software licensed under the [MIT License](LICENSE).
