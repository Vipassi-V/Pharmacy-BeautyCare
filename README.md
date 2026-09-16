# Ronit Pharmacy & Beauty Care — Skin Consultation Kiosk

An interactive, altitude-calibrated skin consultation tablet kiosk and mobile handover application built for **Ronit Pharmacy & Beauty Care** in Tansen, Palpa, Nepal.

Based on the **Himalayan Botanical Clinical** design system from Google Stitch.

---

## 🚀 Features

- **9-Step Customer Consultation Flow:**
  1. Welcome Screen with clinic introduction.
  2. First Name & Surname entry.
  3. Skin Type selection (Oily, Dry, Combination, Sensitive, Normal with Nepali subtitles).
  4. Predefined Skin Concerns selection with tap-to-expand clinical descriptions and cart-style floating tray.
  5. Profile review and quick-edit jumps.
  6. Categorized product recommendations (Face Wash, Serums, Moisturizers, Sunscreens, Balms).
  7. Severe condition alert banner for acute irritations or infection risks.
  8. Dynamic QR Code pass generation for mobile phone handover.
  9. Mobile-friendly customer summary view.
  10. Privacy-safe auto-reset End Session screen.

---

## 🛠️ Tech Stack

- **Framework:** Vite + Vanilla JavaScript / Modern Web Components
- **Styling:** Vanilla CSS with Design System Tokens (Material Design 3 / Stitch tokens)
- **Icons & Typography:** Google Fonts (`Plus Jakarta Sans`, `Inter`, `Material Symbols Outlined`)
- **QR Generation:** `qrcode`

---

## 📦 Getting Started

### Installation
```bash
npm install
```

### Run Locally
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Production Build
```bash
npm run build
```
The optimized bundle will be generated in `dist/`.

---

## 🎨 Design Reference
Refer to [`DESIGN.md`](./DESIGN.md) for the complete design system token specifications, typography, spacing rhythm, and screen inventory.
