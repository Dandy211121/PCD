---
name: Crack Inspection Platform
description: AI-powered civil engineering concrete crack audit and structural telemetry platform
colors:
  primary: "#2563eb"
  primary-hover: "#1d4ed8"
  primary-light: "#3b82f6"
  surface-cockpit: "#0b0f19"
  surface-card: "#0f172a"
  surface-glass: "rgba(15, 23, 42, 0.75)"
  surface-panel: "rgba(30, 41, 59, 0.70)"
  border-subtle: "rgba(255, 255, 255, 0.08)"
  border-active: "#3b82f6"
  text-primary: "#f8fafc"
  text-secondary: "#94a3b8"
  text-muted: "#64748b"
  status-safe: "#10b981"
  status-minor: "#eab308"
  status-moderate: "#f59e0b"
  status-critical: "#ef4444"
typography:
  display:
    fontFamily: "'Outfit', system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "'Outfit', system-ui, -apple-system, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Outfit', system-ui, -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Outfit', system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.05em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  card-glass:
    backgroundColor: "{colors.surface-glass}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "24px"
---

# Design System: Crack Inspection Platform

## Overview

**Creative North Star: "The Structural Cockpit"**

The Crack Inspection Platform is a mission-critical civil engineering telemetry and forensic audit console. It operates as a focused, dark-mode cockpit for structural engineers and field inspectors evaluating concrete integrity across bridges, high-rise building pillars, and dams. The visual atmosphere is calm, precise, and authoritative—eliminating visual noise while presenting high-resolution spatial crack maps, AI confidence values, and structural risk indicators with zero ambiguity.

Every surface is engineered with tactile clarity. Rich obsidian backdrops (`#0b0f19`) host frosted glass panels with subtle border highlights (`rgba(255,255,255,0.08)`) and high-contrast telemetry accents. Color is strictly functional: glowing blues signify AI system state and active coordinates, while a calibrated four-tier safety spectrum (Emerald, Yellow, Amber, Rose) communicates structural degradation levels instantaneously.

**Key Characteristics:**
- **Zero-Distraction Telemetry:** Deep obsidian surfaces with frosted glass layers keeping spatial crack maps and quantitative metrics central.
- **Calibrated Safety Spectrum:** Uncompromising color grammar mapping directly to structural danger levels.
- **Tactile Decisiveness:** Rounded 12px–24px containers with micro-scale interactive states, crisp luminous borders, and responsive feedback.
- **Engineering Authenticity:** Font choices, monospace coordinate badges (`P12 [3,4]`), and ReportLab-aligned tabular data.

## Colors

The palette character follows the "Obsidian Telemetry" philosophy—a deep architectural dark theme balanced with precision blues and industrial safety standards.

### Primary
- **Cobalt Radar** (#2563eb / #3b82f6): Used for primary calls-to-action, active AI scan indicators, selection rings, and interactive sliders. Represents computational precision and authority.

### Neutral
- **Obsidian Deep** (#0b0f19): Root viewport background providing extreme contrast and depth.
- **Slate Cockpit** (#0f172a): Deep container surface for underlying data matrices and table headers.
- **Cockpit Glass** (rgba(15, 23, 42, 0.75)): Core glassmorphism card background with 10px backdrop blur.
- **Panel Frost** (rgba(30, 41, 59, 0.70)): Secondary floating panels and navigation bars with 12px backdrop blur.
- **Ghost Border** (rgba(255, 255, 255, 0.08)): Subtle 1px structural separator dividing cards and metrics without harsh lines.
- **Text Polar White** (#f8fafc): Primary high-contrast typography for headers, metrics, and key data points.
- **Text Slate Muted** (#94a3b8 / #64748b): Secondary labels, timestamps, field notes, and units.

### Status & Severity Signals
- **Safety Emerald** (#10b981): Structural safe state (0.0% crack ratio). Signals intact load-bearing capability.
- **Warning Yellow** (#eab308): Minor hairline cracks (>0% to 10.0%). Requires surface sealing and routine observation.
- **Caution Amber** (#f59e0b): Moderate active structural cracks (>10.0% to 25.0%). Demands low-pressure epoxy injection.
- **Alarm Rose** (#ef4444): Critical degradation (>25.0% crack ratio). Triggers emergency forensic audit and load restriction.

### Named Rules
**The Rarity of Red Rule.** The Alarm Rose hue is strictly reserved for confirmed structural cracks and emergency hazard states. It must never appear on generic action buttons or secondary UI decorations.

**The Glass Depth Rule.** Floating cards must always maintain subtle border illumination (`rgba(255,255,255,0.08)`) with backdrop blur (`10px–12px`) against the obsidian canvas, avoiding opaque flat gray blocks.

## Typography

**Display Font:** Outfit (with system-ui, -apple-system, sans-serif fallback)  
**Body Font:** Outfit  
**Mono Font:** JetBrains Mono, ui-monospace, Menlo, Monaco, Consolas (for grid coordinates and telemetry data)

**Character:** Modern, geometric, and ultra-crisp. Outfit elevates the interface with contemporary Linear/Raycast polish while JetBrains Mono anchors technical telemetry and coordinate matrices with scientific rigor.

### Hierarchy
- **Display** (800 weight, clamp(1.75rem, 4vw, 2.25rem), 1.2 line-height): Hero titles and cockpit screen headers.
- **Headline** (700 weight, 1.5rem, 1.3 line-height): Section titles and modal dialog headings.
- **Title** (600 weight, 1.125rem, 1.4 line-height): Card titles, location names, and panel subheadings.
- **Body** (400 weight, 0.875rem, 1.5 line-height): Field notes, engineering descriptions, and diagnostic instructions.
- **Label** (600 weight, 0.75rem, 1.2 line-height, uppercase tracking-wide): Table headers, coordinate tags (`P1 [1,1]`), and severity badge pills.

### Named Rules
**The Monospace Telemetry Rule.** All grid cell identifiers (`P1–P36`), coordinates (`[row, col]`), percentages, and audit IDs must render in monospace font to emphasize scientific precision.

## Layout

The spatial model uses an 8px base rhythm with fluid responsive grid containers:
- **Max Canvas Width:** `max-w-7xl` (1280px) for wide telemetry dashboards; `max-w-4xl` (896px) for focused upload and audit workflows.
- **Padding Rhythm:** 24px–32px (`p-6` to `p-8`) internal card padding on desktop; 16px (`p-4`) on mobile viewports.
- **Grid Architecture:** 
  - 6x6 square matrix for AI petak grid slicing (36 computational cells).
  - 3-column quick metric telemetry bar (`Total Petak`, `Petak Retak`, `Rasio Retak`).
  - Split-screen comparison viewport with interactive drag slider.

## Elevation & Depth

Depth is established primarily through **Tonal Layering** and **Frosted Glassmorphism**, not heavy drop shadows. Surfaces elevate based on priority and user interaction:
- **Level 0 (Canvas):** Solid Obsidian (`#0b0f19`).
- **Level 1 (Panels & Cards):** Glass cards (`rgba(15, 23, 42, 0.75)` + `backdrop-blur-md` + 1px subtle border).
- **Level 2 (Modals & Popups):** Elevated overlays (`#1e293b` + `shadow-2xl` + `border-slate-700`).
- **Level 3 (Active Selection):** Blue glowing ring (`ring-2 ring-blue-500 shadow-lg shadow-blue-500/20`).

### Named Rules
**The Tonal Lift Rule.** Hovering over interactive cards or inspection rows translates elements upwards by 1px–2px with a subtle background light lift, avoiding artificial dark shadows.

## Shapes

- **Base Radius:** 12px (`rounded-xl`) for buttons, text inputs, and table rows.
- **Card Containers:** 24px (`rounded-3xl` / `rounded-2xl`) for primary glass panels.
- **Pills & Badges:** Fully rounded (`rounded-full`) for status indicators and severity badges.
- **Grid Matrix Petak:** 12px (`rounded-xl`) square tiles maintaining tactile touch targets.

## Components

### Buttons
- **Shape:** Rounded 12px (`rounded-xl`).
- **Primary:** Background Cobalt Radar (`#2563eb`), white bold text, internal padding `10px 20px`, subtle glow shadow (`shadow-lg shadow-blue-600/25`).
- **Hover / Focus:** Scale 102% (`hover:scale-105 active:scale-95`), background shifts to `#1d4ed8`, transition 200ms.
- **Secondary / Ghost:** Slate 800 background (`#1e293b`), border 1px `slate-700`, hover background `#334155`.

### Cards / Containers
- **Corner Style:** Rounded 24px (`rounded-3xl`).
- **Background:** Frosted Cockpit Glass (`rgba(15, 23, 42, 0.75)` with `backdrop-filter: blur(10px)`).
- **Border:** 1px hairline border (`rgba(255, 255, 255, 0.08)`).
- **Padding:** 24px (`p-6` to `p-8`).

### Inputs / Fields
- **Style:** Background `#0f172a`, border 1px `#334155`, text `#f8fafc`, rounded 12px (`rounded-xl`), padding `10px 14px`.
- **Focus:** Border shifts to Cobalt Radar (`#3b82f6`) with crisp outline prevention.

### Navigation
- **Style:** Fixed sticky top header, frosted panel (`rgba(30, 41, 59, 0.70)` + blur 12px), hairline bottom border, live AI heartbeat status beacon.

### Signature Component: Grid Slicing Matrix (6x6)
- **Structure:** 36 clickable cells dynamically colored by inference state:
  - Crack Active: Background `rgba(239, 68, 68, 0.20)`, border `#ef4444`, red glow.
  - Normal: Background `rgba(15, 23, 42, 0.60)`, border `#1e293b`, subtle hover border.
  - Selected Cell: Luminous ring (`ring-2 ring-blue-400 scale-105 z-10`).

## Do's and Don'ts

### Do:
- **Do** format all AI petak IDs, rows, columns, and percentages with monospace font.
- **Do** maintain the 6x6 matrix spatial proportions (square aspect ratio) during image slicing.
- **Do** reserve high-saturation red exclusively for active cracks and critical degradation alerts.
- **Do** display both the raw cell count (e.g. `4 / 36 Petak`) alongside the calculated percentage (`11.1%`).
- **Do** keep cards and navigation frosted (`backdrop-filter: blur`) against the obsidian canvas.

### Don't:
- **Don't** use generic bright primary colors outside the established civil engineering safety spectrum.
- **Don't** use opaque flat gray cards that kill the glassmorphism depth.
- **Don't** hide quantitative metrics behind unnecessary clicks—keep critical indicators immediately visible.
- **Don't** display crack detections without corresponding AI confidence percentages.
