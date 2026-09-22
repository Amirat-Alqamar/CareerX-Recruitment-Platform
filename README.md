# CareerX — Modern Recruitment & Talent Platform

<p align="center">
  <strong>منصة توظيف ذكية ومتكاملة تربط الباحثين عن عمل، الشركات، ومسؤولي النظام</strong>
  <br>
  <em>An enterprise-ready recruitment platform built with Laravel 12, Inertia.js, React, and Tailwind CSS.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 12" />
  <img src="https://img.shields.io/badge/Inertia.js-3.x-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia.js" />
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/i18n-Arabic_%26_English-008A7B?style=for-the-badge" alt="Bilingual" />
</p>

---

## 📌 نبذة عن المشروع (Overview)

**CareerX** هي منصة توظيف حديثة ومتكاملة تجمع بين بساطة تجربة المستخدم وقوة البنية التحتية البرمجية. توفر المنصة 3 بوابات تفاعلية مستقلة (للباحثين عن عمل، الشركات، والمديرين) تتيح إدارة دورة التوظيف بالكامل من نشر الوظائف وتتبع المتقدمين إلى جدولة المقابلات وإصدار التقارير الإحصائية.

---

## ✨ المميزات الرئيسية (Key Features)

### 👨‍💼 1. بوابة الباحث عن عمل (Job Seeker Portal)
* **ملف مهني متكامل:** إدارة الخبرات العملية، التعليم، المهارات، اللغات، الشهادات المهنية، ومعرض الأعمال (Portfolio).
* **إدارة السير الذاتية:** رفع وتحميل السير الذاتية المتعددة (PDF/DOCX).
* **محرك بحث وتصفية الوظائف:** فلترة متقدمة حسب نوع الدوام (حضوري / عن بعد / هجين)، الموقع الجغرافي، الراتب، ومجال العمل.
* **تتبع الطلبات:** لوحة لمتابعة حالات الطلبات المقدمة (قيد المراجعة، تمت الموافقة، مقابلة، مرفوض).
* **حفظ الوظائف المفضلة (Saved Jobs).**

### 🏢 2. بوابة الشركات وأصحاب العمل (Employer Portal)
* **الملف التعريفي للشركة:** شعار الشركة، الغلاف، تفاصيل المقر، وروابط التواصل.
* **إدارة إعلانات الوظائف (Job Postings CRUD):** نشر، تعديل، تكرار (Duplicate)، وإيقاف/تفعيل الإعلانات.
* **نظام تتبع المتقدمين (ATS Pipeline):** استعراض المتقدمين لكل وظيفة، فحص سيرهم الذاتية، وتغيير حالات التقديم.
* **جدولة المقابلات:** تنسيق مواعيد المقابلات وإنشاء روابط Google Meet تلقائياً ومشاركتها مع المرشح.

### 🛡️ 3. لوحة تحكم الإدارة (Admin Panel)
* **إحصائيات وتقارير متقدمة:** تقارير تحليلية شاملة لنشاط المنصة مع إمكانية **الطباعة والتصدير كـ PDF** بعدة صفحات منسقة.
* **مراجعة واعتماد الوظائف:** نظام موافقة مسبقة على الإعلانات الجديدة لضمان جودة المحتوى.
* **إدارة المستخدمين:** تفعيل، تجميد، وحظر الحسابات المخالفة.
* **إدارة الأدوار والصلاحيات (RBAC):** كتالوج صلاحيات مبني بنظام Laravel Gates لإنشاء رتب مخصصة وتوزيع الصلاحيات بدقة.

---

## ⚙️ الخصائص التقنية المتقدمة (Technical Highlights)

* **SPA بدون API منفصل:** استخدام **Inertia.js** لدمج قوة وسرعة React مع أمان ومتانة Laravel.
* **تعدد لغوي كامل (Full i18n RTL & LTR):** دعم أصيل للغتين العربية والإنجليزية مع ضبط تلقائي للاتجاه وتجميع ملفات الترجمة بشكل Modular.
* **أمان عالي (Security & 2FA):** دعم التحقق بخطوتين عبر رموز QR وأكواد الاستعادة (Laravel Fortify) بالإضافة لمفاتيح الأمان (Passkeys).
* **بنية مسارات معيارية (Modular Routing):** فصل المسارات حسب المجالات (`job_seeker.php`, `employer.php`, `admin.php`, `role-permession.php`).
* **تصميم عصري ونظيف:** واجهات مستخدم متجاوبة مع كافة الشاشات باستخدام Tailwind CSS ومكتبة أيقونات Lucide.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

| المجال | التقنية |
| :--- | :--- |
| **Backend** | PHP 8.2+, Laravel 12, Laravel Fortify, Eloquent ORM |
| **Frontend** | React 19, Inertia.js v3, Tailwind CSS, Lucide React, Vite |
| **Database** | MySQL / SQLite |
| **Localization** | Mcamara Laravel-Localization & Custom Modular Translator |
| **Authorization** | Custom RBAC (Melbedran Role-Permission) & Laravel Gates |

---

## 🚀 التشغيل والتثبيت المحلي (Local Installation)

### 1. استنساخ المشروع (Clone Repository)
```bash
git clone https://github.com/souha-2003/CareerX-Recruitment-Platform.git
cd CareerX-Recruitment-Platform
```

### 2. تثبيت الحزم (Install Dependencies)
```bash
composer install
npm install
```

### 3. إعداد البيئة وقاعدة البيانات (Environment Setup)
```bash
cp .env.example .env
php artisan key:generate
```
*قم بضبط اتصال قاعدة البيانات في ملف `.env`، ثم نفّذ:*
```bash
php artisan migrate --seed
php artisan storage:link
```

### 4. تشغيل خوادم التطوير (Run Development Servers)
```bash
npm run dev
php artisan serve
```
*افتح المتصفح وتوجه إلى: `http://127.0.0.1:8000`*

---

## 🔐 بيانات الدخول التجريبية (Default Test Accounts)

| الحساب | البريد الإلكتروني | كلمة المرور | الصلاحية |
| :--- | :--- | :--- | :--- |
| **مسؤول النظام** | `admin@careerx.com` | `password` | Super Admin |
| **شركة / صاحب عمل** | `employer@careerx.com` | `password` | Employer |
| **باحث عن عمل** | `seeker@careerx.com` | `password` | Job Seeker |

---

## 📄 الترخيص (License)
هذا المشروع مفتوح المصدر ومبني لأغراض أكاديمية واستعراض المهارات البرمجية تحت رخصة [MIT License](LICENSE).
