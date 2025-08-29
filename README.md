# 🕵️‍♂️ TriNetra – Device-Centric Money-Trail Investigator

**One-liner:**
Pivot investigations around the device (IMEI/SIM) and reconstruct cross-bank money trails by fusing chat, gallery, and transaction artifacts into one actionable graph. Auto-flag mule rings and generate a **court-ready case pack**.

---

## 🚨 Why TriNetra?

Banks only see their own ledgers. Meanwhile:

* Launderers recycle **devices/SIMs** across many UPI IDs and bank accounts.
* Recruitment happens via **WhatsApp/Telegram**, with **QR swaps and fake receipts**.
* No police-side tool fuses **phone artifacts + banking flows** into a single “who-paid-whom” story.

**TriNetra fills this gap** by enabling investigators to pivot around a device and trace the entire ecosystem.

---

## ⚙️ What TriNetra Does

* **DeviceGraph (Neo4j spine):** Links device, SIM, UPI, accounts, merchants, persons.
* **Chat & Gallery TrailBuilder:** Extract UPI links, QR codes, OCR text, SMS hints.
* **Typology & Anomaly Detection:** Detect device mule rings, fan-in/out, split-and-settle.
* **Ops Dashboard (Police-first):** Graph view, timeline, geo heatmap, case-pack PDF.
* **Field “QR Sweep”:** Scan shop QR → instant Green/Amber/Red risk flag.

---

## 🛠️ Tech Stack

* **Frontend:** React (Cytoscape.js, Recharts, Leaflet)
* **Backend:** FastAPI, Python (pandas, scikit-learn)
* **Graph DB:** Neo4j (py2neo)
* **Storage:** Postgres (cases & audit logs)
* **PDF Reports:** ReportLab / WeasyPrint
* **DevOps:** Docker Compose

---

## 🚀 Quick Start (Demo Mode)

> ⚠️ Runs on **dummy data only** for demo purposes.

```bash
# Clone repo
git clone https://github.com/AkshatGarg2005/TriNetra.git
cd TriNetra

# Install dependencies
yarn install

# Run the app
yarn start
```

* Open `http://localhost:3000` in browser.

---

## 🏆 Why It Matters

* **Device-centric lens** → bridges phone artifacts with banking flows.
* **End-to-end:** Phone seizure → graph → field scan → **court-ready PDF.**
* **High social impact:** Helps police dismantle laundering mule networks.

---

## 📌 Hackathon Info

* **Project Name:** TriNetra
* **Team Name:** TRINETRA
* **College:** VIT Bhopal University
* **Theme:** Money Laundering Pattern Detection (Bhopal Police Hackathon)
