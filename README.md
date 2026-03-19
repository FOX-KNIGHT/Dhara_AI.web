<div align="center">

<img src="https://capsule-render.vercel.app/api?type=soft&color=0:0a1a0a,40:0f2d0f,80:1a3d0a,100:0a1a0a&height=260&section=header&text=🌾%20DHARA%20AI&fontSize=80&fontColor=7dff6b&animation=fadeIn&fontAlignY=45&desc=Turning%20data%20into%20decisions%20for%20every%20farmer.&descSize=18&descAlignY=68&descColor=b8ffaa&stroke=2d6a0a&strokeWidth=1" width="100%" />

<br/>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Nunito&weight=700&size=17&pause=1000&color=7DFF6B&center=true&vCenter=true&width=720&lines=Precision+farming+intelligence+for+every+field;Soil+%7C+Crop+%7C+Weather+%7C+Market+%E2%80%94+all+in+one+platform;Built+for+real+Indian+farmers+%F0%9F%87%AE%F0%9F%87%B3;From+raw+data+to+harvest-ready+decisions." />
</p>

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-7dff6b?style=for-the-badge&labelColor=0a1a0a" />
  &nbsp;
  <img src="https://img.shields.io/badge/Version-1.0.0-7dff6b?style=for-the-badge&labelColor=0a1a0a" />
  &nbsp;
  <img src="https://img.shields.io/badge/License-MIT-7dff6b?style=for-the-badge&labelColor=0a1a0a" />
  &nbsp;
  <img src="https://img.shields.io/badge/Made%20by-FOX--KNIGHT-7dff6b?style=for-the-badge&labelColor=0a1a0a" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-ffffff?style=flat-square&logo=nextdotjs&logoColor=white&labelColor=0a1a0a" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white&labelColor=0a1a0a" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=0a1a0a" />
  <img src="https://img.shields.io/badge/Firebase-Genkit-FF6F00?style=flat-square&logo=firebase&logoColor=white&labelColor=0a1a0a" />
  <img src="https://img.shields.io/badge/Leaflet-Maps-199900?style=flat-square&logo=leaflet&logoColor=white&labelColor=0a1a0a" />
</p>

</div>

---

## What is Dhara AI?

Dhara AI is not just a dashboard. It is a **decision engine for agriculture**.

Farming decisions — what to plant, when to irrigate, where fertility is weak, what prices to expect — have always depended on experience and intuition. Dhara AI turns that process into data-driven precision, localized for Indian soil types, Indian weather patterns, and Indian languages.

From a smallholder in Odisha to an agronomist managing thousands of acres — Dhara AI makes precision farming **accessible, explainable, and actionable**.

```
Sensor Data ──┐
Weather API ──┤──▶  AI Engine  ──▶  Decision Layer  ──▶  Farmer Dashboard
Soil Reports ─┘    (Genkit AI)     (Recommendations)     (Next.js + Maps)
```

---

## Core Features

<table>
<tr>
<td width="50%">

### 🧠 AI-Powered Intelligence
- Smart **crop recommendations** based on soil + climate
- Soil fertility inference from NPK readings
- Explainable AI — farmers see *why*, not just *what*
- Seasonal trend analysis
- Powered by **Firebase Genkit**

</td>
<td width="50%">

### 🌍 Multilingual by Design
- 🇬🇧 English
- 🇮🇳 Hindi
- 🇧🇩 Bengali
- 🟠 Odia

Built for the field, not just the boardroom. Insights delivered in the farmer's own language.

</td>
</tr>
<tr>
<td width="50%">

### 📊 Real-Time Dashboard
- Live **soil moisture** tracking
- NPK level visualization
- Hyperlocal weather insights
- Live **market price** monitoring
- Alerts & threshold notifications

</td>
<td width="50%">

### 🗺️ Smart Farm Mapping
- Interactive land mapping via **Leaflet**
- AI-generated fertility zone overlays
- Location-aware, plot-level insights
- Field boundary drawing & management
- Crop rotation history per plot

</td>
</tr>
</table>

<table>
<tr>
<td width="100%">

### 🤝 Community Layer
- Farmer-to-farmer discussion forums
- Knowledge sharing across regions
- Local crop insight boards
- Agronomist Q&A threads

</td>
</tr>
</table>

---

## System Architecture

```mermaid
graph TD
    A[👨‍🌾 Farmer] --> B[🌾 Dhara AI App\nNext.js · TypeScript]
    B --> C[📊 Dashboard Engine\nSoil · Weather · Market]
    B --> D[🗺️ Geospatial Maps\nLeaflet · Fertility Zones]
    B --> E[🧠 AI Engine\nFirebase Genkit]
    E --> F[✅ Crop Recommendations]
    E --> G[🔬 Fertility Insights]
    E --> H[🌦️ Weather Predictions]
    B --> I[🤝 Community Layer\nDiscussions · Knowledge]

    style A fill:#0f2d0f,stroke:#7dff6b,color:#fff
    style B fill:#0f2d0f,stroke:#7dff6b,color:#fff
    style C fill:#0f2d0f,stroke:#7dff6b,color:#fff
    style D fill:#0f2d0f,stroke:#7dff6b,color:#fff
    style E fill:#0f2d0f,stroke:#7dff6b,color:#fff
    style F fill:#0f2d0f,stroke:#4acc33,color:#fff
    style G fill:#0f2d0f,stroke:#4acc33,color:#fff
    style H fill:#0f2d0f,stroke:#4acc33,color:#fff
    style I fill:#0f2d0f,stroke:#4acc33,color:#fff
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 · TypeScript · Tailwind CSS | App shell, routing, UI |
| **AI / Inference** | Firebase Genkit · Gemini | Crop & fertility intelligence |
| **Maps** | Leaflet.js | Interactive farm mapping & overlays |
| **i18n** | next-intl / custom locales | English, Hindi, Bengali, Odia support |
| **State** | React Context API | Global farm & user state |
| **Backend / DB** | Firebase | Auth, Firestore, real-time sync |

---

## Project Structure

```
dhara_ai.web/
│
├── 📁 src/
│   ├── 📁 ai/                    # Firebase Genkit flows & prompts
│   │   ├── flows/                # Crop recommendation, soil analysis
│   │   └── genkit.ts             # AI client setup
│   │
│   ├── 📁 app/                   # Next.js App Router pages
│   │   ├── dashboard/            # Main dashboard
│   │   ├── map/                  # Farm mapping view
│   │   ├── community/            # Farmer forums
│   │   └── layout.tsx
│   │
│   ├── 📁 components/            # UI components
│   │   ├── charts/               # NPK, moisture, market visuals
│   │   ├── map/                  # Leaflet wrappers & overlays
│   │   └── ai/                   # Recommendation cards
│   │
│   ├── 📁 locales/               # Translation files
│   │   ├── en.json
│   │   ├── hi.json
│   │   ├── bn.json
│   │   └── or.json
│   │
│   └── 📁 contexts/              # Farm state, user, language context
│
├── 📁 public/                    # Static assets
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## Getting Started

> **Prerequisites:** Node.js 18+, Firebase project with Genkit enabled

### ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/FOX-KNIGHT/dhara_ai.web.git
cd dhara_ai.web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# → Add your Firebase config and Genkit API keys

# Run the development server
npm run dev
# → http://localhost:3000
```

### 🔑 Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GOOGLE_GENAI_API_KEY=
```

---

## Supported Languages

| Language | Code | Status |
|----------|------|--------|
| English | `en` | ✅ Complete |
| Hindi | `hi` | ✅ Complete |
| Bengali | `bn` | ✅ Complete |
| Odia | `or` | ✅ Complete |

---

## Roadmap

- [x] AI crop recommendation engine
- [x] Soil NPK & moisture dashboard
- [x] Interactive farm map with fertility zones
- [x] Multilingual support (EN, HI, BN, OR)
- [x] Community knowledge layer
- [ ] SMS alerts for low-connectivity farmers
- [ ] IoT sensor integration (ESP32 soil probes)
- [ ] Offline-first PWA mode
- [ ] Government scheme eligibility checker
- [ ] Satellite imagery integration (NDVI)

---

## Author

<p align="center">
  <a href="https://github.com/FOX-KNIGHT">
    <img src="https://img.shields.io/badge/GitHub-FOX--KNIGHT-7dff6b?style=for-the-badge&logo=github&logoColor=white&labelColor=0a1a0a" />
  </a>
  &nbsp;
  <a href="https://www.linkedin.com/in/siddhant-jena-457350389">
    <img src="https://img.shields.io/badge/LinkedIn-Siddhant%20Jena-7dff6b?style=for-the-badge&logo=linkedin&logoColor=white&labelColor=0a1a0a" />
  </a>
  &nbsp;
  <a href="mailto:worksiddhant18@gmail.com">
    <img src="https://img.shields.io/badge/Email-worksiddhant18-7dff6b?style=for-the-badge&logo=gmail&logoColor=white&labelColor=0a1a0a" />
  </a>
</p>

---

<div align="center">

> *"Turning data into decisions for every farmer."*

<img src="https://capsule-render.vercel.app/api?type=soft&color=0:0a1a0a,50:1a3d0a,100:0a1a0a&height=100&section=footer&text=Built%20for%20Bharat.&fontSize=22&fontColor=4acc33&animation=fadeIn" width="100%" />

</div>
