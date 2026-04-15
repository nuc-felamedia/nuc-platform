# NUC Accreditation Platform — Complete Setup & Deployment Guide

> This guide is written for beginner developers. Follow every step in order.
> Estimated time: 2–4 hours for first deployment.

---

## 📁 Project Structure

```
nuc-platform/
├── backend/                  ← Node.js + Express API server
│   ├── prisma/
│   │   ├── schema.prisma     ← Database table definitions
│   │   └── seed.ts           ← Starter data loader
│   ├── scripts/
│   │   ├── parse_accreditation_pdf.py  ← PDF data extractor
│   │   └── import-csv.ts     ← CSV data importer
│   ├── src/
│   │   ├── controllers/      ← Business logic for each feature
│   │   ├── middleware/       ← Auth, error handling
│   │   ├── routes/           ← API URL definitions
│   │   └── utils/            ← Helpers (JWT, logger, Prisma)
│   ├── .env.example          ← Copy this to .env and fill in values
│   └── package.json
└── frontend/                 ← Next.js web application
    ├── src/
    │   ├── app/              ← Pages (each folder = a URL)
    │   ├── components/       ← Reusable UI pieces
    │   ├── lib/              ← API client, store, utilities
    │   └── types/            ← TypeScript type definitions
    ├── .env.example
    └── package.json
```

---

## 🛠️ STEP 1 — Install Required Software

Install these tools on your computer first:

### 1a. Node.js (version 18 or higher)
- Go to https://nodejs.org
- Download and install the **LTS** version
- Verify: open Terminal/Command Prompt and type `node --version`
- You should see something like `v18.19.0`

### 1b. Git
- Go to https://git-scm.com/downloads
- Download and install for your operating system

### 1c. VS Code (recommended code editor)
- Go to https://code.visualstudio.com
- Download and install

### 1d. Python 3 (for PDF parsing only)
- Go to https://www.python.org/downloads/
- Download and install Python 3.11+
- Install PDF parsing tools:
```bash
pip install pdfplumber pandas python-dotenv
```

---

## 🗄️ STEP 2 — Set Up the Database (PostgreSQL)

You have two options. **Option A is recommended for beginners.**

### Option A — Railway (Easiest, free to start)

1. Go to https://railway.app and sign up with GitHub
2. Click **New Project** → **Provision PostgreSQL**
3. Click on the PostgreSQL service
4. Click **Connect** tab
5. Copy the **DATABASE_URL** — it looks like:
   ```
   postgresql://postgres:PASSWORD@HOST:PORT/railway
   ```
6. Keep this URL — you'll need it in Step 4

### Option B — Local PostgreSQL
1. Download from https://www.postgresql.org/download/
2. Install and run PostgreSQL
3. Create a database:
   ```sql
   CREATE DATABASE nuc_platform;
   ```
4. Your DATABASE_URL will be:
   ```
   postgresql://postgres:YOUR_PASSWORD@localhost:5432/nuc_platform
   ```

---

## ⚙️ STEP 3 — Backend Setup

Open your Terminal (Mac/Linux) or Command Prompt (Windows):

```bash
# 1. Navigate to the backend folder
cd nuc-platform/backend

# 2. Install all dependencies
npm install

# 3. Copy environment file
cp .env.example .env
```

Now open the `.env` file in VS Code and fill in these values:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Paste your DATABASE_URL from Step 2
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/nuc_platform"

# Generate secret keys — run this in terminal:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=paste_your_generated_key_here
JWT_REFRESH_SECRET=paste_another_generated_key_here
```

For Cloudinary (file uploads):
1. Go to https://cloudinary.com and create a free account
2. Copy your Cloud Name, API Key, API Secret from the dashboard
3. Paste into the `.env` file

```bash
# 4. Generate the Prisma database client
npm run db:generate

# 5. Create all database tables
npm run db:push

# 6. Load starter data into the database
npm run db:seed

# 7. Start the backend server
npm run dev
```

✅ You should see: `🚀 NUC Platform API running on port 5000 [development]`

Test it by opening your browser at: http://localhost:5000/health
You should see: `{"status":"ok",...}`

---

## 🖥️ STEP 4 — Frontend Setup

Open a **new terminal window** (keep the backend running):

```bash
# 1. Navigate to the frontend folder
cd nuc-platform/frontend

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="NUC Accreditation Platform"
```

```bash
# 4. Start the frontend
npm run dev
```

✅ Open your browser at: http://localhost:3000

You should see the NUC Platform homepage!

---

## 📄 STEP 5 — Import Real Accreditation Data

### 5a. Extract data from NUC PDF files

Place your PDF files in the `backend/scripts/` folder, then:

```bash
cd nuc-platform/backend/scripts

# Parse a PDF file (replace with your actual filename)
python3 parse_accreditation_pdf.py ug_accreditation_2024.pdf

# This creates: ug_accreditation_2024_parsed.csv
```

Review the CSV file in Excel or Google Sheets to check the data looks right.

### 5b. Import the CSV into the database

```bash
cd nuc-platform/backend

npx ts-node scripts/import-csv.ts scripts/ug_accreditation_2024_parsed.csv
```

You'll see output like:
```
✅ Import complete!
   Created: 4823
   Errors:  12
📊 Database now has 148 universities and 4823 programs
```

Repeat this for each PDF file (undergraduate, postgraduate, institutional).

---

## 🔑 STEP 6 — Create Your Admin Account

The seed script already created one admin account:
- **Email:** admin@nuc.edu.ng
- **Password:** NucAdmin2024!

**Important:** Change this password immediately after first login.

To create additional NUC staff accounts:
1. Log into the platform at http://localhost:3000/auth/login
2. Go to /admin/users
3. Change user roles as needed

---

## 🚀 STEP 7 — Deploy to Production (Go Live)

### 7a. Deploy Backend to Railway

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial NUC Platform"
   git remote add origin https://github.com/YOUR_USERNAME/nuc-platform
   git push -u origin main
   ```

2. Go to https://railway.app
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your repository
5. Choose the `backend` folder as the root
6. Add all your environment variables from `.env` in Railway's Variables tab
7. Change `NODE_ENV=production`
8. Railway will auto-deploy — copy the deployment URL (e.g., `https://nuc-api.railway.app`)

### 7b. Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up with GitHub
2. Click **New Project** → Import your GitHub repository
3. Set **Root Directory** to `frontend`
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://nuc-api.railway.app   ← your Railway URL
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```
5. Click **Deploy**
6. Vercel gives you a URL like: `https://nuc-platform.vercel.app`

### 7c. Connect Custom Domain

1. In Vercel: Settings → Domains → Add `accreditation.nuc.edu.ng`
2. Add the DNS records Vercel provides to your domain registrar
3. Wait 10–30 minutes for DNS to propagate

---

## 📱 API Endpoints Reference

Once deployed, your API is available at `https://your-api-url.railway.app/api/v1/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Platform statistics |
| GET | `/universities` | All universities (paginated) |
| GET | `/universities/:slug` | Single university with programs |
| GET | `/universities/states` | List of all states |
| GET | `/accreditation` | All accreditation records |
| GET | `/accreditation/check` | Verify a specific program |
| GET | `/programs` | All programs |
| GET | `/directorates` | All directorates with divisions |
| GET | `/posts` | News and bulletins |
| GET | `/documents` | Guidelines and documents |
| GET | `/search?q=term` | Global search |
| POST | `/auth/login` | Login |
| POST | `/auth/register` | Register |
| GET | `/auth/me` | Current user profile |

**Protected routes** (require `Authorization: Bearer TOKEN` header):
- `/admin/*` — NUC staff and super admin only
- `/api-keys` — Authenticated users only

---

## 🔧 Common Issues & Fixes

### "Cannot connect to database"
- Check your `DATABASE_URL` in `.env` is correct
- Make sure PostgreSQL is running
- For Railway: check the service is active in the Railway dashboard

### "Prisma client not found"
```bash
cd backend && npm run db:generate
```

### "Module not found" errors
```bash
cd backend && npm install
cd ../frontend && npm install
```

### "JWT_SECRET not set"
- Make sure `.env` file exists (not just `.env.example`)
- Generate a secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### Frontend shows "Failed to fetch"
- Make sure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`

### PDF parser extracts wrong data
- Open the PDF in a viewer first and identify which columns are which
- Edit the column detection logic in `scripts/parse_accreditation_pdf.py`
- The parser works best on PDFs with clear table formatting

---

## 📊 Database Admin (Prisma Studio)

To visually browse and edit your database:

```bash
cd backend
npm run db:studio
```

Opens at http://localhost:5555 — you can view, add, and edit records through a visual interface.

---

## 🔒 Security Checklist Before Going Live

- [ ] Change the default admin password
- [ ] Set `NODE_ENV=production` on the server
- [ ] Use a strong, random `JWT_SECRET` (64+ characters)
- [ ] Enable HTTPS on your domain (Vercel and Railway handle this automatically)
- [ ] Set `FRONTEND_URL` to your actual domain in backend `.env`
- [ ] Review rate limiting settings in `src/server.ts`
- [ ] Set up regular database backups in Railway

---

## 📞 Getting Help

If you get stuck:
1. Check the error message carefully — it usually tells you exactly what's wrong
2. Search the error on Google or Stack Overflow
3. Check the Railway logs: Railway Dashboard → Your service → Logs tab
4. Check Next.js docs: https://nextjs.org/docs
5. Check Prisma docs: https://www.prisma.io/docs

---

## 🔄 Updating the Platform

When you make changes:

```bash
# Backend changes
cd backend
npm run build    # Compile TypeScript
git add . && git commit -m "Update: description"
git push         # Railway auto-deploys

# Frontend changes
cd frontend
git add . && git commit -m "Update: description"
git push         # Vercel auto-deploys

# Database schema changes
cd backend
npm run db:migrate   # Apply schema changes
```

---

*Built for the National Universities Commission, Nigeria.*
*Stack: Next.js · Node.js · PostgreSQL · Prisma · Railway · Vercel*
