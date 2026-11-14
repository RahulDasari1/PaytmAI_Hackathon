# Dukaan Saathi AI — Your AI Business Growth Partner
> **"Your business. Understood. Your next move. Simplified."**
> A simple demo shop helper for Indian retail merchants, built around clear guidance, local languages, and practical next steps.

---

## 1. Product Overview

Small Indian merchants accept hundreds of digital transactions daily through Paytm Soundbox and QR codes. While they receive instant payment alerts and daily collection totals, they remain data-blind:
- **They don't know *why* sales dropped** over a particular week.
- **They miss silent customer churn** when regulars stop visiting.
- **They struggle with complex English SaaS dashboards** and spreadsheets.

**Dukaan Saathi AI solves this with a core differentiator:**
> **Don't just show business data. Explain what is happening, recommend what to do next, and help the merchant take action.**

### Key Capabilities
- **Merchant-first home:** A simple weekly sales summary and a few clear next steps replace charts on the first screen; detailed sales and customer reports remain available under More.
- **Ask by voice or text:** Merchants can speak a question in English, Hindi, or Telugu where browser speech recognition is supported, or type instead.
- **Ask Saathi:** Answers questions using this demo's sample shop data and suggests practical next steps. It is not connected to a live Paytm merchant account.
- **Multilingual Experience:** Native UI and conversational responses in **English, Hindi (हिंदी), and Telugu (తెలుగు)**.
- **Voice support:** Browser speech recognition can turn spoken questions into text in English, Hindi, or Telugu where supported.
- **Stock helper:** Highlights sample items that may run low. Updating stock changes demo data only; it does not place an order.
- **Offer drafts:** Creates and saves sample message drafts. Messages are not sent to customers.
- **Demo data:** Sales, customers, and stock shown in the app are synthetic and should not be treated as business records or forecasts.

---

## 2. Architecture & Tech Stack

```
PaytmAI_Hack/
├── backend/
│   ├── config.py                 # Environment settings & LLM provider detection
│   ├── main.py                   # FastAPI application with CORS & lifespan hooks
│   ├── dukaan_saathi.db          # SQLite persistent database (transactions, inventory, campaigns)
│   ├── data/
│   │   ├── database.py           # Database connection & schema tables
│   │   └── generator.py          # Realistic 90-day synthetic transaction generator (4,600+ txns)
│   ├── services/
│   │   ├── analytics.py          # Period comparison, RFM cohorts, peak hours, recommendations
│   │   ├── copilot_service.py    # 8 non-negotiable tools & multilingual query router
│   │   ├── inventory_service.py  # Sales velocity calculation & simulated supplier reordering
│   │   └── campaign_service.py   # WhatsApp/SMS draft templates in en/hi/te & persistence
│   ├── routes/                   # Clean REST endpoints for dashboard, copilot, inventory, campaigns
│   └── tests/
│       └── test_analytics.py     # Automated test suite (6 tests passing in 1.3s)
└── frontend/
    ├── src/
    │   ├── types.ts              # TypeScript schemas for all data models
    │   ├── i18n.ts               # Complete English, Hindi, and Telugu localization dictionary
    │   ├── services/api.ts       # Typed API client connecting to FastAPI
    │   ├── components/
    │   │   ├── Navbar.tsx        # Branded header, demo notice, and language picker
    │   │   ├── Sidebar.tsx       # Desktop & mobile navigation with alert counters
    │   │   ├── JudgeDemoBanner.tsx # Interactive 5-step guided hackathon jury walkthrough
    │   │   ├── KPICard.tsx       # Reusable fintech metric cards with growth pills
    │   │   └── VoiceSpeakerModal.tsx # Simulated Paytm Soundbox audio with Web Speech API
    │   ├── pages/
    │   │   ├── MerchantHomePage.tsx   # Shop update, simple recommendations, and next steps
    │   │   ├── AICopilotPage.tsx      # Conversational assistant with tool output cards
    │   │   ├── SalesAnalyticsPage.tsx # Period comparison engine & peak footfall heatmaps
    │   │   ├── CustomerInsightsPage.tsx # RFM cohorts & lapsed regulars retention table
    │   │   ├── CampaignStudioPage.tsx # WhatsApp mobile frame preview & persistent drafts
    │   │   ├── InventoryPage.tsx      # Clear low-stock list and demo-only stock update
    │   │   ├── BusinessImpactPage.tsx # Problem statement, SaaS freemium model, benchmarks
    │   │   └── SettingsPage.tsx       # Store info, AI status, and demo reset controls
    │   ├── App.tsx
    │   └── index.css             # Tailwind CSS styling with Paytm palette
    ├── package.json
    └── tailwind.config.js
```

### Technology Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts.
- **Backend:** Python 3.12, FastAPI, Uvicorn, Pandas, Pydantic.
- **Database:** SQLite (`dukaan_saathi.db`).
- **Languages:** English, Hindi (हिंदी), Telugu (తెలుగు).

---

## 3. Prerequisites

- **Node.js:** v20.17+
- **Python:** 3.10+
- **npm:** 10+
- **pip**

---

## 4. Installation & Setup

### 1. Clone or Open Workspace
```bash
cd c:\Users\SUDHAKAR\OneDrive\Desktop\PaytmAI_Hack
```

### 2. Backend Dependencies
```bash
python -m pip install fastapi uvicorn pandas pydantic python-dotenv httpx
```

### 3. Frontend Dependencies
```bash
cd frontend
npm install --legacy-peer-deps
cd ..
```

---

## 5. Startup Commands

### Start the Backend (Port 8000)
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
*Health Check: `http://127.0.0.1:8000/api/health`*

### Start the Frontend (Port 5173)
In a separate terminal:
```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
*App URL: `http://127.0.0.1:5173/`*

---

## 6. Three-Minute Judge Demo Guide

A shopkeeper notices a weekly sales decline and asks the AI what happened. Follow the interactive **Judge Demo Banner** across 5 steps:

1. **Step 1 — Overview Inspection:** Observe the **-12.8% to -30% sales drop** in the 7-day dashboard for "Sharma General Store" alongside 4,600+ real synthetic transactions.
2. **Step 2 — Ask Copilot:** Click the chip: *"Why did my sales decrease this week?"*.
3. **Step 3 — Inspect Root Cause:** The AI executes `compare_sales_periods` and `get_customer_insights`, discovering a **24% evening footfall dip in Dairy & Snacks (5:30-8:30 PM)** and **35 inactive regular customers**.
4. **Step 4 — Take Action:** Click *"Draft Evening Combo Campaign"*. Switch language to **Hindi (हिंदी)** or **Telugu (తెలుగు)**, preview the WhatsApp message on the phone frame, and click **"Save Campaign Draft"**.
5. **Step 5 — Reorder Stock:** Open **Inventory Assistant**, locate **Fortune Sunflower Oil** (depleting in 1.6 days), and click **"Urgent Reorder"** to simulate a supplier PO with Adani Wilmar.

---

## 7. Testing & Verification

Run the automated backend test suite:
```bash
python -m unittest backend.tests.test_analytics
```

**Results:**
```
Ran 6 tests in 1.347s
OK
- test_campaign_creation_and_persistence: PASSED
- test_copilot_queries_multilingual: PASSED
- test_customer_insights_rfm: PASSED
- test_dashboard_summary: PASSED
- test_inventory_velocity_and_reorder: PASSED
- test_seeded_dip_detection: PASSED
```

**Frontend Production Build:**
```bash
cd frontend
npm run build
```
*Build Result: Succeeded with 0 errors in 1.74s.*

---

## 8. Current Limitations & Future Improvements

- **Current Limitation:** Operates on synthetic realistic transaction fixtures. Live Paytm merchant credentials and real customer WhatsApp messaging require authorized commercial gateway access.
- **Future Improvement 1:** Direct integration with Paytm Soundbox hardware firmware for spoken voice copilot Q&A over hardware microphones.
- **Future Improvement 2:** Direct B2B sync with FMCG distributor ERPs (ITC, HUL, Amul) for automated PO placement via WhatsApp Business API.
- **Future Improvement 3:** Fine-tuned regional vernacular LLMs (e.g. Sarvam AI models) deployed directly at network edge.
