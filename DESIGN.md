# Ronit Pharmacy & Beauty Care — Design System & Architecture Specification (DESIGN.md)

> **Source Project:** `projects/14751615782904611286` (*Ronit Pharmacy and Beauty Care*)  
> **Design Theme Movement:** **Warm Clinical Minimalism** (*Himalayan Botanical Clinical*)  
> **Target Deployments:** In-Pharmacy Interactive Tablet Kiosk (10–12.9" Touch displays), Mobile Client Web App (QR Phone Handover), and Pharmacist Admin Desktop Portal (Tansen, Palpa, Nepal).

---

## 1. Brand Identity & Design Movement

The design language balances **clinical rigor & pharmaceutical trust** with **soothing botanical warmth and empathetic skincare wellness**. It eschews sterile hospital starkness in favor of an airy, daylight-infused pharmacy aesthetic: crisp white container bases, deep forest herbal sage undertones, refined pharmaceutical cyan highlights, and reassuring amber advisories tailored for high-altitude UV and weather conditions in Tansen, Palpa.

### Emotional Demeanor
- **Trustworthy & Authoritative:** Instills immediate confidence in medical guidance, formulation safety, and pharmacist dermatological assessments.
- **Calm & Dignified:** Relieves customer vulnerability around skin conditions (acne, hyperpigmentation, mountain sun exposure, barrier damage) without clinical stigma.
- **Accessible & Touch-First:** Designed for high physical touch accuracy on standing kiosks and fast workflow throughput in administrative desktop management.

---

## 2. Color Palette & Token System

All color tokens map to semantic roles within CSS variables and Tailwind tokens.

### Core Primary Palette (Sage Deep & Botanical Growth)
| Token Name | Hex Code | Semantic Role & Usage |
|---|---|---|
| `primary` | `#004c22` | Deepest authoritative contrast, primary brand emphasis |
| `primary-container` | `#166534` | Main primary buttons, dominant headers, active selection tiles |
| `on-primary` | `#ffffff` | Text and icons atop `primary` and `primary-container` |
| `on-primary-container` | `#93e0a2` | Soft mint highlights, badges, and high-contrast tinted indicators |
| `primary-fixed` | `#a6f4b5` | Fixed affirmative accent ground |
| `primary-fixed-dim` / `inverse-primary` | `#8bd79b` | Subtle botanical accents, secondary focus rings |
| `surface-tint` | `#1f6c3a` | Ambient elevation tint |

### Secondary Palette (Clinical Soft Cyan & Active Diagnostics)
| Token Name | Hex Code | Semantic Role & Usage |
|---|---|---|
| `secondary` | `#006a61` | Diagnostic indicators, active ingredient tags, hydration metrics |
| `secondary-container` | `#86f2e4` | Soft teal container fills, interactive feature chips |
| `on-secondary` | `#ffffff` | Text atop secondary filled elements |
| `on-secondary-container` | `#006f66` | Deep teal contrast text on tinted badges |
| `secondary-fixed` | `#89f5e7` | Light cyan accent background |
| `secondary-fixed-dim` | `#6bd8cb` | Mid cyan indicator tone |

### Tertiary Palette (Serene Amber Caution & Pharmacist Attention)
| Token Name | Hex Code | Semantic Role & Usage |
|---|---|---|
| `tertiary` | `#653400` | Deep warm amber for clinical alert headers |
| `tertiary-container` | `#874700` | Accent warning borders and warning badge fills |
| `on-tertiary` | `#ffffff` | Text atop solid tertiary actions |
| `on-tertiary-container` | `#ffc292` | Soft peach contrast on alert containers |
| `tertiary-fixed` | `#ffdcc3` | Light warm amber caution ground |
| `tertiary-fixed-dim` | `#ffb77d` | Subtle warning accent |
| *Amber Warning Wash* | `#FEF3C7` / `#FFFBEB` | Banner background for "Consult Pharmacist" & severe symptoms |
| *Amber Accent Stripe* | `#D97706` | Left vertical accent line on clinical disclaimer banners |

### Foundation, Surfaces & Neutrals
| Token Name | Hex Code | Semantic Role & Usage |
|---|---|---|
| `surface` / `background` | `#f8f9ff` | Crisp ultra-light canvas base for tablet kiosks and app viewport |
| `surface-container-lowest` | `#ffffff` | Pure white clinical cards, selection containers, and modals |
| `surface-container-low` | `#eff4ff` | Subtle recessed section background |
| `surface-container` | `#e5eeff` | Soft contrast table headers, chip default backgrounds |
| `surface-container-high` | `#dce9ff` | Deepened card background for grouped metrics |
| `surface-container-highest` | `#d3e4fe` / `surface-variant` | Inactive stepper backgrounds, dividers |
| `surface-dim` | `#cbdbf5` | Modal backdrop overlay base tint |
| `on-surface` / `on-background` | `#0b1c30` | High-contrast primary reading text and title copy |
| `on-surface-variant` | `#404940` | Muted secondary text, instructions, and subtitles |
| `outline` | `#707a6f` | Standard border line for inputs and neutral dividers |
| `outline-variant` | `#bfc9bd` | Ultra-fine border line (`1px solid #bfc9bd` / `#E2E8F0`) |
| `inverse-surface` | `#213145` | Tooltips, dark floating toasts, and high-contrast status snacks |
| `inverse-on-surface` | `#eaf1ff` | Text on inverted dark surfaces |

### Error & Destructive Palette
| Token Name | Hex Code | Semantic Role & Usage |
|---|---|---|
| `error` | `#ba1a1a` | Destructive actions, validation errors, critical fail states |
| `error-container` | `#ffdad6` | Error banner and input error state background |
| `on-error` | `#ffffff` | Text on error buttons |
| `on-error-container` | `#93000a` | Error description text inside alert boxes |

---

## 3. Typography & Hierarchy

The typography pairs **Plus Jakarta Sans** (approachable, human, modern geometric curves) for all interactive headings and action elements with **Inter** (precision engineered, maximum legibility for dosages and ingredient lists) for clinical copy.

### Font Families
- **Display & Headings:** `'Plus Jakarta Sans', sans-serif`
- **Body & Dosages:** `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
- **Labels & Microcopy:** `'Plus Jakarta Sans', sans-serif`
- **Icons:** `'Material Symbols Outlined'`

### Typographic Scale
| Style Token | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|---|
| `headline-xl` | Plus Jakarta Sans | `40px` (2.5rem) | Bold (`700`) | `48px` | `-0.02em` | Desktop Hero banners, Welcome title |
| `headline-xl-mobile` | Plus Jakarta Sans | `30px` (1.875rem) | Bold (`700`) | `38px` | `-0.01em` | Tablet Kiosk Welcome & Main Step Titles |
| `headline-lg` | Plus Jakarta Sans | `32px` (2rem) | SemiBold (`600`) | `40px` | `-0.01em` | Section headers in Admin portal |
| `headline-lg-mobile` | Plus Jakarta Sans | `24px` (1.5rem) | SemiBold (`600`) | `32px` | `-0.01em` | Screen headers on Mobile / Tablet Survey |
| `headline-md` | Plus Jakarta Sans | `24px` (1.5rem) | SemiBold (`600`) | `32px` | `0` | Card titles, Modal headers |
| `headline-sm` | Plus Jakarta Sans | `20px` (1.25rem) | SemiBold (`600`) | `28px` | `0` | Subsection headers, Product name titles |
| `body-lg` | Inter | `18px` (1.125rem) | Regular (`400`) | `28px` | `0` | Standing kiosk body text, instructions |
| `body-md` | Inter | `16px` (1rem) | Regular (`400`) / Med (`500`) | `24px` | `0` | Standard form fields, table cell contents |
| `body-sm` | Inter | `14px` (0.875rem) | Regular (`400`) | `20px` | `0` | Captions, timestamps, ingredient notes |
| `label-lg` | Plus Jakarta Sans | `16px` (1rem) | SemiBold (`600`) | `24px` | `+0.01em` | Primary button labels, Action triggers |
| `label-md` | Plus Jakarta Sans | `14px` (0.875rem) | SemiBold (`600`) | `20px` | `+0.02em` | Form labels, Tab items, Navigation links |
| `label-sm` | Plus Jakarta Sans | `12px` (0.75rem) | SemiBold (`600`) | `16px` | `+0.04em` | Category badges, status tags, pill chips |

---

## 4. Spacing, Elevation, and Geometry

### 8-Point Rhythmic Spacing Scale
- `space-xs`: `0.375rem` (6px)
- `space-sm`: `0.75rem` (12px)
- `space-md`: `1.25rem` (20px)
- `space-lg`: `2rem` (32px)
- `space-xl`: `3rem` (48px)
- `gutter`: `1.5rem` (24px) / `gutter-mobile`: `1rem` (16px)
- `margin`: `2rem` (32px) / `margin-mobile`: `1rem` (16px)

### Border Radius (`rounded`)
- `rounded-sm`: `0.25rem` (4px) — Micro tags, badge indicators
- `rounded-DEFAULT`: `0.5rem` (8px) — Inputs, standard dropdown menus
- `rounded-md`: `0.75rem` (12px) — Action buttons, small card modules
- `rounded-lg`: `1rem` (16px) — Primary interactive selection tiles, input cards
- `rounded-xl`: `1.5rem` (24px) — Main product recommendation cards, modal containers
- `rounded-full`: `9999px` — Circular avatars, formulation badges, pill chips

### Depth Stratification & Shadows
- **Base Canvas (Level 0):** Flat `#f8f9ff` or `#ffffff`.
- **Level 1 (Clinical Container Cards):**  
  `box-shadow: 0 2px 8px -2px rgba(22, 101, 52, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02);`  
  Border: `1px solid #bfc9bd` / `1px solid #e2e8f0`.
- **Level 2 (Selected State / Interactive Cards on Hover):**  
  `box-shadow: 0 10px 25px -5px rgba(13, 148, 136, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03);`  
  Border: `2px solid #166534` (or `2px solid #0d9488`).
- **Level 3 (Modals, Overlays, Floating Trays):**  
  `box-shadow: 0 20px 30px -10px rgba(15, 23, 42, 0.12);`  
  Scrim: `rgba(15, 23, 42, 0.4)` with `backdrop-filter: blur(8px)`.

---

## 5. Core UI Component Specifications

### 5.1 Buttons
1. **Primary Action Button:**
   - Height: Minimum `56px` (Touch target)
   - Background: `primary-container` (`#166534`)
   - Text: `on-primary` (`#ffffff`), `font-label-lg` (16px/SemiBold)
   - Corner Radius: `14px` / `rounded-md` (`12px`)
   - Hover / Active: `#14532d`, `transform: scale(0.98)` on touch tap
   - Shadow: `0 4px 14px 0 rgba(22, 101, 52, 0.25)`

2. **Secondary / Outline Consultation Button:**
   - Height: `56px`
   - Background: `#f0fdfa` (Soft Cyan Wash)
   - Border: `1.5px solid #0d9488`
   - Text: `#0d9488` (Secondary Cyan)
   - Hover: Background `#ccfbf1`

3. **Tertiary / Pharmacist Escalation Button:**
   - Height: `56px`
   - Background: `#fffbeb`
   - Border: `1.5px solid #d97706`
   - Text: `#d97706` (Amber)

4. **Ghost / Text Button:**
   - Height: `44px`–`48px`
   - Text: `on-surface-variant` (`#404940`)
   - Hover: Background `surface-container-low` (`#eff4ff`)

### 5.2 Form Fields & Inputs
- **Container Height:** `56px` (Optimized for kiosk on-screen keyboard & tap accuracy)
- **Background:** `surface-container-lowest` (`#ffffff`)
- **Border:** `1.5px solid #cbd5e1` / `#bfc9bd`
- **Border Radius:** `12px` (`rounded-md`)
- **Typography:** `18px` (`body-lg`) to ensure zero zoom-in on mobile and arm's-length kiosk visibility
- **Focus State:** Border `#0d9488` with `box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15)`
- **Error State:** Border `#ba1a1a` with `box-shadow: 0 0 0 3px rgba(186, 26, 26, 0.15)`

### 5.3 Selection Cards & Tile Containers
- **Skin Type / Symptom Tile (Unselected):**
  - Background: `#ffffff`
  - Border: `1.5px solid #e2e8f0`
  - Padding: `20px`
  - Minimum Height: `88px`
  - Radius: `20px` (`rounded-xl`)
  - Typography: Title `18px SemiBold`, Subtitle `14px Regular`
- **Skin Type / Symptom Tile (Selected):**
  - Background: `#f0fdf4` (Gentle Herbal Ground)
  - Border: `2.5px solid #166534` (Deep Sage)
  - Radio/Check Indicator: Filled `#166534` with white check glyph or concentric dot
  - Scale: `scale(1.01)` with gentle emerald glow

### 5.4 Product Recommendation Cards
- **Structure:**
  1. **Header Zone:** Product image (with `rounded-lg`), Brand name (`font-label-sm` in `text-on-surface-variant`), and Product Name (`font-headline-sm`).
  2. **Clinical Efficacy Badges:** Pill chips (`Hypoallergenic`, `Altitude SPF 50+`, `Non-comedogenic`, `Ceramide Complex`).
  3. **Prescription/OTC Indicator:** Clear green (`OTC / Safe Routine`) or Amber (`Pharmacist Verification Required`).
  4. **Usage & Dosage Box:** Recessed background (`#f8fafc` / `#f0fdf4`), `14px Inter` showing Morning/Night steps, frequency, and application notes.
  5. **Pricing & Selection Checkbox:** Price in `NPR` (`Rs. XXXX`) with a high-contrast primary selection toggle.

### 5.5 Tables (Admin Portal)
- **Header:** Background `#e5eeff` (`surface-container`), Text `label-md` (`#0b1c30`), Uppercase tracking, Height `48px`.
- **Row:** Height `64px`, Border-bottom `1px solid #e2e8f0`, Hover state `#f8f9ff`.
- **Cells:** Text `body-md` (`#0b1c30`), aligned left, actions aligned right with icon buttons (`edit`, `delete`, `visibility`).
- **Pagination:** Sticky bottom bar with item counts, page buttons, and per-page dropdown.

### 5.6 Badges & Pills
- **Category / Active Badge:** `bg-[#e5eeff] text-[#004c22] px-3 py-1 rounded-full font-label-sm`
- **Clinical Active Tag:** `bg-[#f0fdfa] text-[#0d9488] border border-[#86f2e4] px-2.5 py-0.5 rounded-full font-label-sm`
- **Safety / Caution Tag:** `bg-[#fef3c7] text-[#874700] border border-[#fcd34d] px-2.5 py-0.5 rounded-full font-label-sm`
- **Out of Stock / Danger Tag:** `bg-[#ffdad6] text-[#93000a] px-2.5 py-0.5 rounded-full font-label-sm`

### 5.7 Alerts & Safeguard Banners
1. **Severe Condition Warning Banner (High Altitude / Acute Symptoms):**
   - Background: `#fef3c7`
   - Border: `1px solid #fcd34d`
   - Left Accent Bar: `4px solid #d97706`
   - Icon: Amber `warning` / `health_and_safety`
   - Copy: *"Severe barrier irritation or infection risk detected. Please consult with the attending pharmacist before using active exfoliants."*
2. **Success Banner:** Background `#f0fdf4`, Border `1px solid #86efac`, Left Accent `4px solid #166534`.
3. **Info Clinical Note:** Background `#f0fdfa`, Border `1px solid #99f6e4`, Left Accent `4px solid #0d9488`.

### 5.8 Modals & Slide-Over Drawers
- **Backdrop:** `rgba(15, 23, 42, 0.45)` with `backdrop-filter: blur(8px)`.
- **Modal Body:** Pure white `#ffffff`, `rounded-2xl` (`24px`), `max-width: 560px` for dialogs, `max-width: 840px` for forms.
- **Header:** Sticky top, title in `headline-md`, close icon button (44px hit target).
- **Footer:** Two-button layout (Cancel ghost button on left, Confirm primary button on right).

### 5.9 Sidebar Navigation (Admin Panel)
- **Width:** `288px` (`w-72`), fixed on desktop (`lg:translate-x-0`), collapsible drawer on mobile/tablet.
- **Background:** `surface-container-lowest` (`#ffffff`) with right border `1px solid #e2e8f0`.
- **Brand Header:** Official Palpa Wellness Pharmacy Skincare logo + "Ronit Pharmacy Admin".
- **Navigation Links:**
  - Height: `48px`, `rounded-lg` (`12px`), margin `space-xs` (6px).
  - Inactive: Text `on-surface-variant` (`#404940`), hover background `#f8f9ff`.
  - Active: Background `#f0fdf4`, text `#166534`, left border indicator `3px solid #166534`, SemiBold weight.
- **Footer Info:** Active pharmacist profile, role badge ("Chief Pharmacist"), and Logout action.

---

## 6. Layout Breakpoints & Ergonomics

| Breakpoint | Width Range | Target Environment | Ergonomic Considerations |
|---|---|---|---|
| **Mobile (`sm`)** | `360px` – `480px` | Customer Phone Handover (QR view) | Single column vertical stack, bottom sticky CTA bar, sticky top navigation. |
| **Tablet Portrait (`md`)** | `768px` – `834px` | Countertop Kiosk (iPad 10.2", Galaxy Tab) | Large touch hit targets (min 56px), lower 2/3 tap action zones, safe thumb reach. |
| **Tablet Landscape (`lg`)** | `1024px` – `1280px` | Pharmacist Station / Admin iPad | Split 2-column layout (Left: Diagnostic Form, Right: Live Regimen Tray). |
| **Desktop (`xl`)** | `1280px` – `2560px` | Back-office Admin Workstation | Fixed 288px sidebar, data tables with pagination, live preview drawers. |

---

## 7. State Specifications

### 7.1 Empty States
- **Illustration/Icon:** Large dual-tone icon (`folder_off`, `inventory_2`, `sentiment_satisfied`, `search_off`) inside a `96px` circular soft mint or cyan container (`#f0fdf4` or `#f0fdfa`).
- **Heading:** `font-headline-sm` (`#0b1c30`).
- **Body:** `font-body-md` (`#404940`) with clear instructions.
- **CTA:** Primary action button (e.g., *"Add First Product"*, *"Clear Search Filters"*, *"Start New Consultation"*).

### 7.2 Loading States
- **Skeleton Shimmer:** Animated pulse background using `linear-gradient(90deg, #eff4ff 0%, #e5eeff 50%, #eff4ff 100%)`.
- **Kiosk Processing Spinner:** Concentric dual ring with primary deep sage (`#166534`) and secondary cyan (`#0d9488`).
- **Progress Stepper Indicator:** 5-step header tracker with completed check icons and pulsating active circle.

### 7.3 Success & Confirmation States
- **Icon:** Filled check badge `#166534` with animated pulse ring.
- **Messaging:** Clear confirmation of session storage, QR generation, or product database updates.
- **Auto-timeout:** 60-second auto-reset timer on Kiosk screens with manual *"Start New Survey"* button.

### 7.4 Error & Fallback States
- **Network / Offline Mode:** Amber sticky banner at top: *"Operating in Offline Local Mode — Consultations saved locally."*
- **Validation Errors:** Red border `#ba1a1a`, microtext below field in `#ba1a1a` with `error` icon.

---

## 8. Screen Inventory & Architecture (23 Stitch Screens)

All 23 screens from the Stitch design project (`projects/14751615782904611286`) are categorized into two core operational flows:

```
Ronit Pharmacy Application
├── Customer Tablet Kiosk & Mobile Flow (Screens 1 – 10 + Logo)
│   ├── 1. Tablet Welcome Screen (Hero start, language selection, photo teaser)
│   ├── 2. Customer Name & Basic Info Screen (Name, age group, gender, phone optional)
│   ├── 3. Skin Type Selection (Oily, Dry, Combination, Sensitive, Normal)
│   ├── 4. Skin Concerns & Live Selection Tray (Acne, Melasma, High Altitude Sun, Dryness, Redness)
│   ├── 5. Consultation Summary & Review Screen (Pre-recommendation confirmation)
│   ├── 6. Personalized Recommendations & Categorized Products (Routine Builder: Cleanse, Treat, Protect)
│   ├── 7. QR Code Sharing Modal (Instant sync to customer mobile phone)
│   ├── 8. Mobile Customer Web App (Customer's personal saved routine on smartphone)
│   ├── 9. End Session & Reset Confirmation Screen (Privacy reassurance, rating, reset timer)
│   ├── 10. Tablet Fallback & State Handler (Offline mode, loading transitions, empty states)
│   └── Brand Asset: Palpa Wellness Pharmacy Skincare Emblem / SVG Logo
│
└── Pharmacist Admin Portal (Screens Admin 1 – Admin 12)
    ├── Admin 1. Pharmacist Login Screen (Secure access PIN & credential entry)
    ├── Admin 2. Management Dashboard (Live kiosk analytics, daily scans, top concerns in Tansen)
    ├── Admin 3. Product Categories Management (Category grid, active/hidden toggles)
    ├── Admin 4. Add / Edit Category Modal & Form (Name, slug, clinical description, order)
    ├── Admin 5. Skin Problems & Conditions Management (Condition list, severity criteria, contraindications)
    ├── Admin 6. Add / Edit Skin Problem Form (Problem details, high-altitude triggers, recommended active ingredients)
    ├── Admin 7. Products Catalog Management (Inventory table, stock, price, OTC vs Prescription tag)
    ├── Admin 8. Add Product & Real-time Kiosk Live Preview (Form paired with real-time card simulator)
    ├── Admin 9. Bulk Product Import Workflow (CSV/Excel upload, column mapper, validation preview)
    ├── Admin 10. Reports & Recent Customer Sessions (Consultation history logs, exported reports)
    ├── Admin 11. System Settings & Safeguard Modals (Kiosk timeout limits, clinical warnings, altitude toggles)
    └── Admin 12. Admin Empty, Loading & Error Fallback Matrix (Error boundary, zero-data screens)
```

---

## 9. Implementation Notes for Subsequent Phase

1. **No Spec Deviation:** Colors, typography scale, radii, and component proportions strictly follow the tokens recorded above.
2. **Vanilla CSS + Clean Layouts:** CSS custom properties will encapsulate `--color-primary`, `--color-surface`, etc., matching the Stitch Material Design 3 token spec.
3. **Accessibility:** Touch targets must maintain minimum `56px` height on tablet kiosk routes; font sizes on survey questions will not drop below `18px`.
4. **Altitude-Aware Logic:** High UV, severe barrier dryness, and pigmentation (melasma) specific to Tansen, Palpa are integrated into condition presets and warning triggers.
