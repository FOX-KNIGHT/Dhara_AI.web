# 🌾 Dhara AI: Intelligent Agritech Platform

A next-generation, multilingual agricultural dashboard designed to empower farmers and agronomists with AI-driven insights, real-time environmental telemetry, and predictive crop management. Built for accessibility and scale, Dhara AI bridges the gap between advanced data science and on-the-ground farming.

[![Next.js](https://img.shields.io/badge/Next.js-15+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Firebase Genkit](https://img.shields.io/badge/AI-Firebase_Genkit-FFCA28.svg)](https://firebase.google.com/docs/genkit)
[![Status](https://img.shields.io/badge/Status-Active-green.svg)]()

## ✨ Key Features

- **🧠 AI-Powered Agronomy**: Leverages AI flows (`firebase/genkit`) to generate dynamic **Smart Recommendations** and localized **Soil Fertility Maps** based on live data.
- **🌍 Native Multilingual Support**: Built-in localization architecture (`i18n`) supporting **English, Hindi (hi), Bengali (bn), and Odia (or)**, ensuring the platform is usable by regional farming communities.
- **📊 Real-Time Telemetry & Dashboards**: Comprehensive visualization of critical farming metrics:
    - Interactive **Soil Moisture Gauges** & **NPK Level Charts**
    - Live **Weather Widgets** and **Pest Alerts**
    - Dynamic **Crop Calendars** and **Market Price** trackers.
- **🗺️ Geospatial Farm Mapping**: Leaflet-powered interactive maps for precise farm registration and AI-enhanced spatial fertility visualization.
- **🤝 Farmer Community Hub**: A dedicated social module allowing users to create posts, share localized insights, and collaborate.

## 🏗️ System Architecture

Dhara AI combines a modern React frontend with edge-ready AI inference workflows:

```mermaid
graph TD
    A[Farmer / User] -->|Selects Language| B{Dhara AI Next.js App}
    B -- Geospatial Data --> C[Leaflet Maps Engine]
    B -- Telemetry Data --> D[Dashboard Widgets]
    B -- Query --> E{AI Core Flows}
    E --> F[Smart Crop Recommendations]
    E --> G[Soil Fertility Inference]
    D --> H(Weather, Moisture, NPK, Market)
