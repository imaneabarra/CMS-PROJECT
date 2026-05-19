# 🛡️ CMS GLOBAL — Enterprise IT & Security Infrastructure Platform

[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite)](https://vite.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.2-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Laravel](https://img.shields.io/badge/Laravel-12.0-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4?style=for-the-badge&logo=php)](https://php.net)
[![Stripe](https://img.shields.io/badge/Stripe-Secure_Payments-008CDD?style=for-the-badge&logo=stripe)](https://stripe.com)
[![Mailtrap](https://img.shields.io/badge/Mailtrap-SMTP_Sandbox-22D3EE?style=for-the-badge&logo=mailgun)](https://mailtrap.io)

CMS GLOBAL is a high-end, production-grade enterprise IT and electronic security infrastructure marketplace and management system. Designed first and foremost with a premium dark-themed corporate aesthetic, the platform enables businesses and high-security residences to browse and procure advanced safety hardware, manage perimeters, configure network topologies, and coordinate complex security integrations. 

The application is structured into a double-sided ecosystem: an elegant, fluid e-commerce storefront for client procurement, and a secure, data-rich administrative control panel tracking physical inventory, transactional statistics, audit logs, and global system profiles.

---

## 🏗️ System Architecture

The platform operates on a modernized decoupled architecture utilizing **React 19** and **Vite** for the client application and **Laravel 12** as the stateless REST API. Communications are fully secured via **Laravel Sanctum** token-based authentication.

```mermaid
graph TD
    %% Client Layer
    subgraph Client [Vite / React 19 Frontend]
        SPA[Single Page Application]
        Router[React Router v7]
        State[Global State Contexts]
        StripeSDK[Stripe Elements SDK]
        PDF[jsPDF Engine]
    end

    %% API Layer
    subgraph API [Stateless API Gateway]
        Middleware[Sanctum & RBAC Auth Middleware]
        RateLimiter[Artisan Rate Limiting]
    end

    %% Backend Service Layer
    subgraph Backend [Laravel 12 REST Framework]
        Controllers[API Resource Controllers]
        Eloquent[Eloquent ORM Model Layer]
        Mailer[Laravel Mail Service]
        Cashier[Stripe PHP Core SDK]
    end

    %% Infrastructure Layer
    subgraph Data [Infrastructure Services]
        MySQL[(MySQL Relational Database)]
        StripeSrv[Stripe Payment Gateway]
        MailtrapSrv[Mailtrap SMTP Sandbox]
    end

    %% Data Flow Connections
    SPA -->|Axios REST Requests| Middleware
    Middleware --> Controllers
    Controllers --> Eloquent
    Eloquent --> MySQL
    
    %% External Integration Connections
    StripeSDK -->|Tokenized Credit Cards| StripeSrv
    Controllers -->|Dispatches OTP Mail| Mailer
    Mailer -->|SMTP Protocol| MailtrapSrv
    Controllers -->|Verify Payments & Webhooks| Cashier
    Cashier -->|HTTP Handshake| StripeSrv
    StripeSrv -->|payment_intent.succeeded| Middleware
```

---

## ⚡ Core Business Domains

CMS GLOBAL provides specialized security systems partitioned into four main industrial focus areas:
1. **Video Surveillance (CMS SECURITY)**: AI-powered surveillance cameras, smart motion tracking NVR systems, and live streaming solutions.
2. **Access Control (SECURE ACCESS)**: Biometric gates, RFID perimeter locks, facial recognition access terminals, and security barriers.
3. **Networking (ENTERPRISE IT)**: Enterprise managed switches, router nodes, structured server racks, and high-performance PoE Wi-Fi network systems.
4. **IT Hardware (BUSINESS PC)**: Professional workstations, high-compute engineering laptops, server modules, and technical developer setups.

---

## 💎 Features & Subsystems

### 🛍️ Client Storefront (Customer Portal)
* **Bespoke UI Design**: A stunning dark-mode design system utilizing a curated **Aether** theme built on custom fluid HSL color variables (`bg-aether-800`, `text-cyan-500`) with structural glassmorphism cards and smooth entrance animations powered by **Framer Motion**.
* **Search & Discovery**: Live catalog navigation using React Context APIs (`SearchContext`, `FavoriteContext`) allowing instant multi-criteria client-side searching and product categorization.
* **Persistent Cart & Wishlist**: Real-time synchronization of shopping carts and system wishlists securely cached per user on the MySQL database.
* **Secured Stripe Checkout**: Complete checkout integration with **Stripe Elements API**, implementing secure client-side credit card authorization and custom multi-tiered validation.
* **Invoice Exportation**: Instant download of official product order receipts in clean PDF formatting with tabular data structures compiled client-side via **jsPDF** & **jsPDF-AutoTable**.
* **Peer Reviews**: Live client feedback section on items featuring mathematical rating averages, detailed reviews, and security validation checks.

### 🛡️ Administrative Portal (Dashboard)
* **Interactive Statistics**: Central operations center featuring analytical summaries of gross revenue, total active customers, processing order queues, and graphical representations of sales trends rendered via **Recharts**.
* **Inventory Control**: Full CRUD management of systems and components, including instant category bindings and physical image storage handling.
* **Fulfillment Management**: Dynamic list of all incoming orders with capabilities to update status workflows (`PAID` ➡️ `PROCESSING` ➡️ `SHIPPED` ➡️ `DELIVERED`).
* **Compliance Audit Logs**: Real-time log listing of all administrative mutations (`Action`, `Model changed`, `Author`, `IP Address`, and `Timestamp`) preserving maximum transparency.
* **Access Level Isolation**: Robust Role-Based Access Control (RBAC) ensuring administrative portals and configuration endpoints are strictly blocked to non-admins.
* **Global System Control**: Change overall parameters like alert rules, emergency protocols, support numbers (integrated WhatsApp links), and standard variables without recompiling code.

### 📧 Security & Authentication Suite
* **State Preservation**: Persisted token management on frontend Axios clients, preserving system-wide protected route guards for both `USER` and `ADMIN` paths.
* **Mailtrap SMTP OTP Recovery**: Highly secure 6-digit One-Time Password (OTP) request process for forgotten passwords. Hashed OTP storage using SHA-256 with an exact 15-minute validity window.

---

## 📦 Directory Structure

### 🖥️ Frontend (Vite/React Workspace)
```
stageProject-main/
├── public/                 # Static assets, fonts and favicons
├── src/
│   ├── assets/             # Global media resources and raw images
│   ├── components/         # Modular reusable components
│   │   ├── auth/           # Login, Register panels and route locks
│   │   ├── checkout/       # Stripe credit card elements forms
│   │   ├── feedback/       # Customer feedback modals and inputs
│   │   ├── layout/         # Base layouts (Default vs Admin Dashboard)
│   │   ├── product/        # Product detail tabs and rating widgets
│   │   └── ui/             # Curated design tokens (Buttons, Cards, Inputs)
│   ├── context/            # React Global state management providers
│   │   ├── AuthContext.jsx       # User tokens, active role & session API
│   │   ├── CartContext.jsx       # Shopping cart operations & tax calculations
│   │   ├── FavoriteContext.jsx   # Product wishlist arrays
│   │   ├── NotificationContext.jsx  # Context-driven visual updates
│   │   ├── SearchContext.jsx     # Live inventory catalog search state
│   │   └── ThemeContext.jsx      # Dark mode variables & HSL themes
│   ├── data/               # Fixed datasets (Domain cards, admin variables)
│   ├── hooks/              # Custom utilities hooks
│   ├── pages/              # Primary view page routers
│   │   ├── admin/          # Dashboard, Inventory, Log Audits, Settings
│   │   ├── auth/           # Authorization, Forgot/Reset password pages
│   │   ├── profile/        # User accounts details and past receipts
│   │   ├── shop/           # Shopping grid, detailed views, Cart & Stripe Checkout
│   │   └── Home.jsx        # Landing Page (Hero, domains, CTA)
│   ├── services/           # Axios HTTP Client routing services
│   ├── utils/              # Calculation scripts and jsPDF generators
│   ├── index.css           # Tailwind v4 theme, fonts, custom utility classes
│   └── main.jsx            # Entry DOM mounting node
├── package.json            # Client JS dependencies lists
└── vite.config.js          # Vite React compiler configuration
```

### ⚙️ Backend (Laravel 12 Workspace)
```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/     # Stateless REST Controllers
│   │   │   ├── AuthController.php          # Session JWT registration/login
│   │   │   ├── CartController.php          # Synchronized database cart items
│   │   │   ├── CheckoutController.php      # Manual order routing checkout
│   │   │   ├── DashboardController.php     # Statistics collections & user records
│   │   │   ├── DemoController.php          # Customer corporate system demos
│   │   │   ├── FavoriteController.php      # User wishlist database logic
│   │   │   ├── FeedbackController.php      # Form processing & admin storage
│   │   │   ├── NotificationController.php  # User alerts & read flags
│   │   │   ├── OrderController.php         # User receipts & fulfillment updates
│   │   │   ├── PasswordResetController.php # OTP generation & SMTP delivery
│   │   │   ├── PaymentController.php       # Stripe API handshakes & webhook routing
│   │   │   ├── ProductController.php       # Product catalogue & asset management
│   │   │   ├── ReportController.php        # Financial reports and data queries
│   │   │   ├── ReviewController.php        # User reviews & product rating averages
│   │   │   └── SettingController.php       # System security & general configurations
│   │   └── Middleware/         # Authentication & RBAC middleware guards
│   ├── Models/                 # Eloquent ORM schemas and relationships
│   │   ├── ActivityLog.php     # Audit trails models
│   │   ├── CartItem.php        # Cart-Product relations
│   │   ├── Order.php           # Base transaction models
│   │   ├── Product.php         # Marketplace item structures
│   │   ├── User.php            # Security roles, permissions and details
│   │   └── ...                 # Additional domain schemas
│   └── Mail/                   # Mail classes (ResetPasswordMail.php)
├── config/                     # Core configs (stripe.php, services.php)
├── database/
│   ├── migrations/             # MySQL schema migrations blueprints
│   ├── seeders/                # Base seeds (Admin initial configurations)
│   └── factories/              # Faker databases test tools
├── routes/
│   ├── api.php                 # Core REST API Routes (Sanctum protected groups)
│   └── web.php                 # Standard web views (unused in API)
└── composer.json               # Backend composer dependencies lists
```

---

## 🗄️ Database Schema & Models

The relational database is constructed in MySQL, featuring rigorous foreign-key constraints and cascading deletes to maintain absolute referential integrity.

```
+--------------------+            +-------------------+            +---------------------+
|      users         |            |     products      |            |     categories      |
+--------------------+            +-------------------+            +---------------------+
| id [PK]            |<----+      | id [PK]           |<----+      | id [PK]             |
| name               |     |      | name              |     |      | name                |
| email              |     |      | description       |     |      | slug                |
| password           |     |      | price             |     |      | description         |
| role [USER|ADMIN]  |     |      | stock             |     +------+ category_id [FK]    |
+--------------------+     |      | image             |            +---------------------+
  |                        |      | category_id [FK]  |
  |                        |      +-------------------+
  |                        |        |               |
  |                        |        |               |
  |                        +-----[Product Relation]-+
  |                        |        |               |
  |                        |        v               v
  |  +--------------------+|  +-------------+  +-------------+
  |  |     cart_items     ||  |  favorites  |  |   reviews   |
  |  +--------------------+|  +-------------+  +-------------+
  |  | id [PK]            ||  | id [PK]     |  | id [PK]     |
  |  | user_id [FK] ------+|  | user_id [FK]|  | user_id [FK]|
  +->| product_id [FK] ---+|  | prod_id [FK]|  | prod_id [FK]|
  |  | quantity           |   +-------------+  | rating      |
  |  +--------------------+                    | comment     |
  |                                            +-------------+
  |  +--------------------+                    +---------------------+
  |  |       orders       |                    |     order_items     |
  |  +--------------------+                    +---------------------+
  |  | id [PK]            |<-------------------| id [PK]             |
  +->| user_id [FK]       |                    | order_id [FK]       |
     | order_reference    |                    | product_id [FK] ----+
     | total_price        |                    | quantity            |
     | status             |                    | price               |
     | payment_status     |                    +---------------------+
     | shipping_address   |
     | stripe_id          |
     +--------------------+
```

---

## 🔧 Environment Variables

For the application to operate correctly, key services must be wired through the `.env` configurations.

### 🖥️ Frontend (Root Directory)
Create a `.env` in the root project folder:
```env
# API Endpoint Target
VITE_API_URL=http://localhost:8000/api

# Stripe Public Authorization Token
VITE_STRIPE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### ⚙️ Backend (inside `/backend`)
Create a `.env` inside the `backend` folder:
```env
# Core Laravel App Environment
APP_NAME="CMS Global"
APP_ENV=local
APP_KEY=base64:Lidcvlo7ZmwKoLAIX/s4djCSqeTo+X5s8D5AvZX0v4s=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:5173

# Database Connection (MySQL)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=stageprojet
DB_USERNAME=root
DB_PASSWORD=

# Session and Queues Drivers
SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database

# Mailtrap SMTP Server Configurations
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_FROM_ADDRESS="noreply@cmsglobal.com"
MAIL_FROM_NAME="CMS Global Security"

# Stripe Secret Settings
STRIPE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxx

# Integrated Support Phone Number
WHATSAPP_NUMBER=212600000000
```

---

## ⚡ Setup & Installation Sequence

Follow this guide to get both the frontend and backend running locally in a development environment.

### 📋 Prerequisites
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18 or above) & `npm`
* [PHP](https://www.php.net/) (v8.2 or above)
* [Composer](https://getcomposer.org/) (PHP package manager)
* [MySQL Server](https://www.mysql.com/) (running on default port 3306)
* [Stripe CLI](https://stripe.com/docs/stripe-cli) (needed to listen and forward Stripe webhooks locally)

---

### 1️⃣ Setting Up the Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the composer dependencies:
   ```bash
   composer install
   ```
3. Initialize the environment configuration and generate the unique application encryption key:
   ```bash
   cp .env.example .env
   # Make sure to fill out your database, Stripe, and Mailtrap details in the newly created .env file
   php artisan key:generate
   ```
4. Create the target MySQL database manually or via terminal:
   ```sql
   CREATE DATABASE stageprojet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
5. Run the migrations to build the tables structure and populate base seed records:
   ```bash
   php artisan migrate --seed
   ```
6. **Concurrent Development Command**: The backend is pre-configured with a concurrent development runner via composer. This script starts the PHP HTTP Server, the Artisan Queue listener, logs debugger, and front assets compiled via Vite all in one command:
   ```bash
   composer dev
   ```
   *Alternatively, if running them individually:*
   ```bash
   # Server (Port 8000)
   php artisan serve
   # Database Queue listener (processes transactional background events)
   php artisan queue:listen
   ```

---

### 2️⃣ Setting Up the Frontend
1. Open a new terminal in the root directory (where `package.json` resides):
   ```bash
   cd ..
   ```
2. Install the node package dependencies:
   ```bash
   npm install
   ```
3. Boot the local Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the frontend port printed by Vite (typically `http://localhost:5173`).

---

### 3️⃣ Setting Up local Stripe Webhook Forwarding
For Stripe to register order creation fallback signals locally, the local developer instance must receive events dispatched from the Stripe dashboard.
1. Download the [Stripe CLI](https://github.com/stripe/stripe-cli/releases) and authenticate your Stripe developer account:
   ```bash
   stripe login
   ```
2. Start forwarding payment intents events directly to your local API route endpoint:
   ```bash
   stripe listen --forward-to localhost:8000/api/webhooks/stripe
   ```
3. Stripe CLI will output a webhook signing secret (`whsec_...`). Copy this key and update your backend `.env` variables under `STRIPE_WEBHOOK_SECRET`.

---

## 🔄 Core Technical Workflows

### 💳 Stripe Checkout Operations Flow
To guarantee reliability and prevent user-facing latency, checkout transactions use Stripe Element forms on the React frontend, coupled with verification and dual fallback on the Laravel backend:

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Client (Browser)
    participant Front as React SPA Elements
    participant API as Laravel 12 Backend
    participant Stripe as Stripe Gateway
    database DB as MySQL Database

    Customer->>Front: Click "Proceed to Checkout"
    Front->>API: POST /api/create-payment-intent (User, Cart, Addresses)
    API->>Stripe: Handshake: Create PaymentIntent (Amount, Metadata)
    Stripe-->>API: Return Intent Details (client_secret, payment_id)
    API-->>Front: Return client_secret & orderReference
    Front->>Customer: Render secure Card Input fields
    Customer->>Front: Enter details & click "Pay Now"
    Front->>Stripe: stripe.confirmPayment() (Tokenized card confirmation)
    Stripe-->>Customer: Return Payment Succeeded
    Front->>API: POST /api/confirm-stripe-order (payment_intent_id)
    API->>Stripe: Retrieve & verify intent status
    API->>DB: DB Transaction: Create Order & OrderItems, Clear Cart
    API-->>Front: Return confirmation JSON & Invoice reference
    Front->>Customer: Display Success Screen & Download PDF Invoice

    Note over API,Stripe: Fallback Webhook System
    Stripe->>API: Webhook: payment_intent.succeeded (signature verified)
    API->>DB: Idempotency check: Create order if API confirm-stripe-order failed
```

---

## 🎓 Academic / Final Year Project Competency Highlights
This project demonstrates several advanced software engineering practices highly relevant for academic reviews, engineering internships, and professional portfolio showcases:

1. **State-of-the-Art Styling & Interaction**: Implements the newly launched **Tailwind CSS v4** styling framework, leveraging native Vite CSS parsing, custom global `@theme` overrides, and heavy fluid micro-animations powered by **Framer Motion** for a luxurious dark UX.
2. **Robust Security Mechanics**: Implements **Laravel Sanctum** to manage stateless session tokens. Includes complete sanitization of user parameters, strict database level cascades, dynamic guards, and secure SHA-256 OTP algorithms for credentials recovery.
3. **Database Transaction Integrity**: Implements full ACID transactions on payment routes (using `DB::beginTransaction()` and `DB::commit()`) to guarantee that orders, item relationships, and cart updates succeed together, avoiding partial state failures.
4. **Idempotency Guard & Event Handling**: Features Stripe webhook fallbacks using official signature validations to guarantee payment safety, and prevent duplicate order creations via database idempotency indexing.
5. **PDF Assembly & Compilation**: Integrates JS stream generation to parse client checkout schemas and auto-compile them into dynamic, printable sales receipts.
6. **Unified Operations Workspace**: Pre-configures backend services with custom concurrent scripts (`composer dev`), facilitating standard, single-command startups for server execution, queue dispatchers, and system debug logs.

---

## 📄 License
This project is proprietary. All rights reserved. Developed for **CMS GLOBAL** IT and Security Infrastructure.
