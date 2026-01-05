# Launchpilot Brand Style Guide

**Version 1.0** | December 2025

---

## Table of Contents

1. [Brand Foundation](#1-brand-foundation)
2. [Logo System](#2-logo-system)
3. [Color Palette](#3-color-palette)
4. [Typography](#4-typography)
5. [Spacing & Layout](#5-spacing--layout)
6. [Component Styling](#6-component-styling)
7. [Voice & Tone](#7-voice--tone)
8. [Do's and Don'ts](#8-dos-and-donts)

---

## 1. Brand Foundation

### Brand Name

**Launchpilot** (one word, capital L, lowercase p)

- Correct: Launchpilot
- Incorrect: LaunchPilot, Launch Pilot, LAUNCHPILOT, launchpilot

### Tagline

**Primary:** "Make Money. Take Action. Win."

**Secondary:** "Your AI sales & marketing command center"

### Brand Story

Launchpilot is the AI-powered marketing command center for entrepreneurs, freelancers, and online business owners. We transform overwhelmed solopreneurs into confident marketers by providing task-driven workflows that connect directly to revenue generation.

Every feature, every task, every AI generation is designed with one goal: helping you make money.

### Target Audience

| Segment | Description |
|---------|-------------|
| Entrepreneurs | Launching products/services, need structured marketing approach |
| Freelancers | Building client base, managing multiple projects |
| Webshop Owners | Growing online stores, need consistent marketing |
| Website Owners | Monetizing platforms, seeking revenue optimization |

### Brand Personality

| Trait | Description |
|-------|-------------|
| **Energetic** | High-energy, action-oriented, momentum-focused |
| **Futuristic** | Modern, cutting-edge tech aesthetic, forward-thinking |
| **Empowering** | Builds confidence, enables success, supportive |
| **Direct** | No fluff, results-focused, clear communication |
| **Bold** | Unapologetic, stands out, makes a statement |

### Brand Values

1. **Action over perfection** - Done is better than perfect
2. **Revenue-focused results** - Every feature ties to making money
3. **AI-augmented creativity** - Technology amplifies human potential
4. **Accessible expertise** - Professional marketing for everyone
5. **Momentum and progress** - Small wins compound into big success

---

## 2. Logo System

See [LOGO_SPECIFICATIONS.md](./LOGO_SPECIFICATIONS.md) for detailed logo concepts and designer handoff specifications.

### Current Implementation

Until custom logo assets are delivered, the brand uses:

```
⚡ Launchpilot
```

- Symbol: Lightning bolt emoji (⚡)
- Wordmark: "Launchpilot" in Unbounded font
- Style: Gradient text (cyan → magenta → yellow)

### Logo Placement

| Location | Format |
|----------|--------|
| Navigation | Symbol + Wordmark (horizontal) |
| Favicon | Symbol only (16x16, 32x32) |
| App Icon | Symbol only (centered) |
| Footer | Wordmark only |
| Social Media | Symbol + Wordmark (stacked) |

---

## 3. Color Palette

### Primary Colors

#### Neon Cyan (Primary Brand Color)

| Variant | Hex | RGB | Usage |
|---------|-----|-----|-------|
| Primary | `#00d9ff` | 0, 217, 255 | CTAs, primary buttons, links, brand accents |
| Dark | `#00a8cc` | 0, 168, 204 | Hover states, pressed states |
| Light | `#33e6ff` | 51, 230, 255 | Highlights, glows |

**CSS Variable:** `--cyberpunk-primary`

#### Neon Magenta (Accent Color)

| Variant | Hex | RGB | Usage |
|---------|-----|-----|-------|
| Primary | `#c9004f` | 201, 0, 79 | Secondary CTAs, highlights, premium features |
| Dark | `#990042` | 153, 0, 66 | Hover states |
| Light | `#e6005f` | 230, 0, 95 | Emphasis |

**CSS Variable:** `--cyberpunk-accent`

#### Neon Yellow (Highlight Color)

| Variant | Hex | RGB | Usage |
|---------|-----|-----|-------|
| Primary | `#ffbe0b` | 255, 190, 11 | Warnings, achievements, special features |
| Dark | `#ccaa08` | 204, 170, 8 | Hover states |
| Light | `#ffd633` | 255, 214, 51 | Soft highlights |

**CSS Variable:** `--cyberpunk-highlight`

### Background Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Dark Base | `#0a0e27` | `--cyberpunk-dark` | Main page background |
| Dark Secondary | `#0f1535` | `--cyberpunk-dark-secondary` | Alternate sections |
| Surface | `#151932` | `--cyberpunk-surface` | Cards, elevated elements |
| Surface Light | `#1a1f3a` | `--cyberpunk-surface-light` | Hover states, inputs |

### Text Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Primary | `#f0f3f5` | `--cyberpunk-text` | Headlines, body text |
| Secondary | `#a8b5c6` | `--cyberpunk-text-secondary` | Descriptions, captions |
| Tertiary | `#6b7684` | `--cyberpunk-text-tertiary` | Placeholders, disabled text |

### Border Colors

| Name | Value | CSS Variable | Usage |
|------|-------|--------------|-------|
| Default | `rgba(0, 217, 255, 0.2)` | `--cyberpunk-border` | Card borders, dividers |
| Strong | `rgba(0, 217, 255, 0.4)` | `--cyberpunk-border-strong` | Focus states, hover |

### Semantic Colors

| Purpose | Color | Hex |
|---------|-------|-----|
| Success | Cyan | `#00d9ff` |
| Warning | Yellow | `#ffbe0b` |
| Error | Magenta | `#c9004f` |
| Info | Cyan Light | `#33e6ff` |

### Brand Gradient

**Primary Brand Gradient:**
```css
background: linear-gradient(to right, #00d9ff, #c9004f, #ffbe0b);
```

Used for:
- Logo text
- Hero headlines
- Premium badges
- Special callouts

---

## 4. Typography

### Font Stack

#### Display Font - Unbounded

**Usage:** Headlines, brand name, hero text, section titles

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Subtle headers |
| Semi-Bold | 600 | Sub-headers |
| Bold | 700 | Section titles |
| Extra-Bold | 800 | Hero headlines |
| Black | 900 | Brand name, primary CTAs |

**CSS Variable:** `--font-display`

**Google Fonts Import:**
```css
@import url("https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&display=swap");
```

#### Body Font - Space Grotesk

**Usage:** Body text, paragraphs, UI elements, buttons

| Weight | Value | Usage |
|--------|-------|-------|
| Light | 300 | Large body text |
| Regular | 400 | Body paragraphs |
| Medium | 500 | Emphasized text |
| Semi-Bold | 600 | Buttons, labels |
| Bold | 700 | Strong emphasis |

**CSS Variable:** `--font-body`

**Google Fonts Import:**
```css
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap");
```

#### Monospace Font - JetBrains Mono

**Usage:** Code, technical data, trust badges, stats, timestamps

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Code blocks |
| Medium | 500 | Emphasized code |
| Semi-Bold | 600 | Stats, numbers |
| Bold | 700 | Key metrics |

**CSS Variable:** `--font-mono`

**Google Fonts Import:**
```css
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap");
```

### Typography Scale

| Element | Size | Weight | Font | Letter Spacing |
|---------|------|--------|------|----------------|
| Hero H1 | 4.5rem (72px) | 900 | Unbounded | -0.025em |
| Section H2 | 3rem (48px) | 800 | Unbounded | -0.025em |
| Card H3 | 1.25rem (20px) | 700 | Unbounded | 0.05em |
| Body Large | 1.125rem (18px) | 400 | Space Grotesk | normal |
| Body | 1rem (16px) | 400 | Space Grotesk | normal |
| Small/Caption | 0.875rem (14px) | 400 | Space Grotesk | normal |
| Button | 0.95rem (15px) | 600 | Space Grotesk | 0.5px |
| Badge | 0.8rem (13px) | 600 | Space Grotesk | 0.5px |

### Text Styling Rules

| Element | Style |
|---------|-------|
| Section Headers | UPPERCASE, tracking-wide |
| Body Text | Sentence case, line-height 1.6-1.8 |
| Buttons | UPPERCASE, tracking-wider |
| Labels | Sentence case, semi-bold |

---

## 5. Spacing & Layout

### Base Unit

**8px grid system** - All spacing values are multiples of 8px

### Spacing Scale

| Token | Value | Pixels | CSS Class | Usage |
|-------|-------|--------|-----------|-------|
| xs | 0.5rem | 8px | `gap-xs` | Tight spacing, inline elements |
| sm | 1rem | 16px | `gap-sm` | Related elements |
| md | 1.5rem | 24px | `gap-md` | Card padding, section gaps |
| lg | 2rem | 32px | `gap-lg` | Section spacing |
| xl | 3rem | 48px | `gap-xl` | Major sections |

### Container Widths

| Container | Width | Usage |
|-----------|-------|-------|
| Max Content | 80rem (1280px) | Page content |
| Narrow | 48rem (768px) | Text content, forms |
| Card | Auto with padding | Individual cards |

### Component Spacing

| Component | Padding |
|-----------|---------|
| Card | 1.5rem (24px) |
| Button | 0.75rem 1.5rem (12px 24px) |
| Input | 0.75rem 1rem (12px 16px) |
| Badge | 0.375rem 0.75rem (6px 12px) |
| Section | 6rem vertical (96px) |

### Border Radius

**Border radius: 0** (sharp edges)

This is intentional - the sharp, angular design reinforces the futuristic cyberpunk aesthetic. Do NOT add border-radius to any component.

---

## 6. Component Styling

### Buttons

#### Primary Button (`.btn-primary`)

```css
background: var(--cyberpunk-primary);      /* #00d9ff */
color: var(--cyberpunk-dark);              /* #0a0e27 */
padding: 0.75rem 1.5rem;
font-weight: 600;
font-size: 0.95rem;
letter-spacing: 0.5px;
border-radius: 0;
border: none;

/* Hover */
background: var(--cyberpunk-primary-light);
box-shadow: 0 0 16px rgba(0, 217, 255, 0.4);
```

#### Accent Button (`.btn-accent`)

```css
background: var(--cyberpunk-accent);       /* #c9004f */
color: white;
/* Same padding/sizing as primary */

/* Hover */
box-shadow: 0 0 16px rgba(255, 0, 110, 0.4);
```

#### Highlight Button (`.btn-highlight`)

```css
background: var(--cyberpunk-highlight);    /* #ffbe0b */
color: var(--cyberpunk-dark);
/* Same padding/sizing as primary */

/* Hover */
box-shadow: 0 0 16px rgba(255, 190, 11, 0.4);
```

#### Ghost Button (`.btn-ghost`)

```css
background: transparent;
color: var(--cyberpunk-primary);
border: 2px solid var(--cyberpunk-primary);
padding: 0.625rem 1.375rem;

/* Hover */
background: rgba(0, 217, 255, 0.1);
box-shadow: 0 0 16px rgba(0, 217, 255, 0.3);
```

### Cards

```css
background: var(--cyberpunk-surface);      /* #151932 */
border: 1px solid var(--cyberpunk-border); /* rgba(0, 217, 255, 0.2) */
border-radius: 0;
padding: 1.5rem;

/* Hover */
border-color: var(--cyberpunk-border-strong);
box-shadow: 0 0 20px rgba(0, 217, 255, 0.15);
```

### Input Fields

```css
background: var(--cyberpunk-surface);
color: var(--cyberpunk-text);
border: 2px solid var(--cyberpunk-border);
border-radius: 0;
padding: 0.75rem 1rem;
font-size: 0.95rem;

/* Focus */
background: var(--cyberpunk-surface-light);
border-color: var(--cyberpunk-primary);
box-shadow: 0 0 12px rgba(0, 217, 255, 0.2);
outline: none;

/* Placeholder */
color: var(--cyberpunk-text-tertiary);
```

### Badges

```css
display: inline-block;
padding: 0.375rem 0.75rem;
border-radius: 0;
font-size: 0.8rem;
font-weight: 600;
letter-spacing: 0.5px;
text-transform: uppercase;
```

**Variants:**

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| Primary | `rgba(0, 217, 255, 0.2)` | `#33e6ff` | `#00d9ff` |
| Accent | `rgba(255, 0, 110, 0.2)` | `#e6005f` | `#c9004f` |
| Highlight | `rgba(255, 190, 11, 0.2)` | `#ffbe0b` | `#ffbe0b` |

### Animations

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| fadeInUp | 0.6s | ease-out | Page load elements |
| fadeIn | 0.4s | ease-out | Modals, overlays |
| slideInLeft | 0.5s | ease-out | Side panels |
| glow | 2s | ease-in-out, infinite | Attention elements |
| pulse | 2s | ease-in-out, infinite | Loading states |

---

## 7. Voice & Tone

### Brand Voice Characteristics

| Characteristic | Description | Example |
|----------------|-------------|---------|
| **Direct** | Get to the point, no filler | "Generate content. Post it. Make money." |
| **Action-Oriented** | Use imperative verbs | "Launch your dashboard" not "You can launch..." |
| **Confident** | State benefits boldly | "Turn ideas into revenue" |
| **Energetic** | Short, punchy sentences | "Stop dreaming. Start doing." |
| **Empowering** | Focus on user capability | "You've got this. We've got your back." |

### Messaging Framework

#### Headlines

- Start with action verbs or benefits
- Keep under 8 words
- Use periods for impact (not question marks)
- UPPERCASE for maximum impact

**Examples:**
- "Make Money. Take Action. Win."
- "Stop dreaming. Start doing."
- "Launch your revenue machine."
- "Supercharged Features"

#### CTAs (Calls to Action)

- Action-first, clear outcome
- UPPERCASE for emphasis
- Use arrows (→) for direction
- Keep to 2-3 words

**Examples:**
- "LAUNCH DASHBOARD →"
- "START FREE"
- "GET STARTED NOW"
- "EXPLORE FEATURES"

#### Feature Descriptions

Structure: Benefit → Feature → Outcome

**Example:**
> "Generate revenue-driving content in minutes. AI creates posts, emails, and landing pages. Focus on selling, not writing."

#### Error Messages

Helpful and reassuring, not blaming.

**Examples:**
- "Something went wrong. Let's try again."
- "We couldn't save that. Check your connection."
- "Hmm, that didn't work. Here's what to try..."

#### Success Messages

Celebratory but brief.

**Examples:**
- "Task complete! Keep the momentum."
- "Saved! You're on fire."
- "Done. What's next?"

### Tone by Context

| Context | Tone | Example |
|---------|------|---------|
| Landing Page | Bold, exciting | "Ready to Make Real Money?" |
| Onboarding | Supportive, guiding | "Let's set up your first project" |
| Dashboard | Focused, productive | "3 priority tasks today" |
| Error States | Helpful, reassuring | "Something went wrong. Let's try again." |
| Success States | Celebratory, motivating | "Task complete! Keep the momentum." |
| Empty States | Encouraging, actionable | "No tasks yet. Let's create your first one." |

### Words to Use

| Use | Instead of |
|-----|------------|
| Launch | Start, Begin |
| Revenue | Income, Money (in formal contexts) |
| Action | Activity, Work |
| Generate | Create, Make |
| Dominate | Succeed, Do well |
| Momentum | Progress, Movement |

### Words to Avoid

- "Just" (minimizing)
- "Actually" (condescending)
- "Obviously" (assumptive)
- "Simple" / "Easy" (subjective)
- "Please" (unnecessary in UI)
- Passive voice ("was created" → "created")

---

## 8. Do's and Don'ts

### DO

| Guideline | Reason |
|-----------|--------|
| Use neon glow effects sparingly | Creates emphasis without visual fatigue |
| Maintain high contrast | Accessibility and readability |
| Keep sharp edges (border-radius: 0) | Reinforces cyberpunk aesthetic |
| Use the gradient for brand moments | Creates visual hierarchy |
| Apply glow shadows on hover states | Provides interactive feedback |
| Use UPPERCASE for headings and buttons | Conveys confidence and action |
| Use the established color palette | Maintains brand consistency |
| Write in active voice | More direct and engaging |
| Lead with benefits | Users care about outcomes |

### DON'T

| Guideline | Reason |
|-----------|--------|
| Don't use rounded corners | Breaks cyberpunk aesthetic |
| Don't use light backgrounds | Dark mode is core to brand identity |
| Don't mix in other color palettes | Dilutes brand recognition |
| Don't use soft/pastel colors | Contradicts energetic personality |
| Don't use serif fonts | Doesn't match tech-forward aesthetic |
| Don't overuse glow effects | Causes visual fatigue |
| Don't use emoji as icons (except ⚡) | Inconsistent with professional tone |
| Don't use passive voice | Less engaging |
| Don't write long paragraphs | Users scan, not read |

### Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| Color contrast | All text meets WCAG AA ratios |
| Focus states | Visible glow rings on focus |
| Reduced motion | Respect `prefers-reduced-motion` |
| Color independence | Never use color as only indicator |
| Keyboard navigation | All interactive elements focusable |

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Images | kebab-case, descriptive | `hero-background.png` |
| Icons | icon-[name] | `icon-rocket.svg` |
| Logos | logo-[variant] | `logo-full.svg`, `logo-icon.svg` |
| Social | social-[platform]-[size] | `social-twitter-1200x630.png` |

---

## Quick Reference

### CSS Variables

```css
/* Colors */
--cyberpunk-primary: #00d9ff;
--cyberpunk-accent: #c9004f;
--cyberpunk-highlight: #ffbe0b;
--cyberpunk-dark: #0a0e27;
--cyberpunk-surface: #151932;
--cyberpunk-text: #f0f3f5;
--cyberpunk-text-secondary: #a8b5c6;
--cyberpunk-border: rgba(0, 217, 255, 0.2);

/* Fonts */
--font-display: "Unbounded", sans-serif;
--font-body: "Space Grotesk", sans-serif;
--font-mono: "JetBrains Mono", monospace;
```

### Brand Colors (Copy-Paste)

| Usage | Hex |
|-------|-----|
| Primary | `#00d9ff` |
| Accent | `#c9004f` |
| Highlight | `#ffbe0b` |
| Background | `#0a0e27` |
| Surface | `#151932` |
| Text | `#f0f3f5` |

---

**Document maintained by:** Launchpilot Team
**Last updated:** December 2025
**Source of truth:** `/src/assets/main.css`
