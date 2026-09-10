# DawaiSetu - Smart Medicine Redistribution Platform

## 🌟 Overview
DawaiSetu (Hindi for "Medicine Bridge") is a comprehensive, state-of-the-art web application designed to connect medical institutions that have surplus, unexpired medicines with organizations and individuals in dire need of them. 

By preventing perfectly usable medicines from ending up in landfills, DawaiSetu not only reduces biomedical waste but also provides critical healthcare access to underserved communities. The platform handles end-to-end logistics, rigorous compliance checks, automated matching, and secure document verification.

## 🚀 Key Features & User Flow
DawaiSetu operates with three primary user roles, ensuring a secure and regulated environment:

### 1. Donor Hub (Pharmacies, Hospitals, NGOs)
- **Inventory Management:** Donors can digitally log their surplus medicines, including generic names, batch numbers, and expiry dates.
- **Smart Matching:** The system automatically notifies donors if a recipient has posted a requirement for their uploaded medicines.
- **Secure Transfers:** Donors can initiate secure transfers with end-to-end tracking.
- **Disposal Hub:** For medicines that are expired or unsafe, donors are routed to safe, environmentally-compliant disposal facilities.

### 2. Recipient Hub (Clinics, Shelters, Patients)
- **Global Search:** Recipients can search the national inventory for specific medicines.
- **Requirement Posting:** If a medicine is unavailable, recipients can post a "Medicine Need," acting as an active request.
- **Automated Alerts:** When a donor uploads a medicine matching their need, the recipient is instantly notified.

### 3. System Administrator (Compliance & Security)
- **Rigorous Onboarding:** Every organization must upload state-issued Drug Licenses, NGO Registrations, and Authorized Representative Details.
- **Document Audit:** Admins review these documents via the built-in document viewer to Grant or Reject accreditation.
- **System Oversight:** Admins have full access to both the Donor and Recipient hubs to monitor the entire health exchange, track audits, and suspend malicious entities.

## 💻 Tech Stack & Architecture

### Frontend (Client-Side)
- **Framework:** **Next.js 14** (App Router) for Server-Side Rendering (SSR) and optimized performance.
- **Language:** **TypeScript** for strict type-safety and robust code architecture.
- **Styling:** **Tailwind CSS** for modern, responsive, and custom UI components without leaving the HTML.
- **Animations:** **Framer Motion** for fluid page transitions, micro-interactions, and professional UI polish.
- **Icons:** **Lucide React** for clean, scalable vector icons.

### Backend (Server-Side)
- **Runtime:** **Node.js** handling API routes directly within Next.js.
- **Database ORM:** **Prisma** for type-safe database queries and automated schema migrations.
- **Database:** **PostgreSQL** (hosted on **Neon DB**) for highly scalable, relational data storage.
- **Authentication:** Custom JWT (JSON Web Token) implementation securely stored in HttpOnly browser cookies, handled via **Jose** for edge-compatible verification.
- **File Storage:** **Supabase Storage** for secure, scalable hosting of organizational compliance documents (PDFs, Images).

### APIs & Integrations
- **Resend API:** Integrated for robust transactional emails. Sends automated notifications regarding Registration Approvals, Rejections, and Suspensions directly to the organization's inbox.
- **Supabase SDK:** Used strictly with a Service Role key on the backend to bypass restrictive RLS policies while maintaining high security.

## 🛡️ Security & Compliance
- **Edge Middleware:** A custom Next.js middleware intercepts every request. It validates JWT tokens, enforces role-based routing (e.g., blocking Donors from Recipient pages), and locks down APIs.
- **Institutional Accreditation:** Accounts are frozen in a `PENDING` state until their legal documents are manually audited and approved by the compliance team.
- **Audit Logs:** Every action (document approval, medicine transfer, rejection) is permanently recorded in an immutable Audit Log for legal compliance.

## 🚦 Getting Started (Local Development)

1. **Clone the repository**
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Environment Setup:** Create a `.env` file containing the necessary keys for NeonDB, Supabase, Resend, and your JWT Secret.
4. **Database Migration:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
6. Visit `http://localhost:3000` to access the platform.
