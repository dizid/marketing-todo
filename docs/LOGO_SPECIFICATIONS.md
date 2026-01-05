# Launchpilot Logo Specifications

**Designer Handoff Document** | Version 1.0 | December 2025

---

## Brand Context

**Product:** Launchpilot - AI-powered marketing command center
**Audience:** Entrepreneurs, freelancers, webshop owners, website owners
**Aesthetic:** Cyberpunk neon (dark backgrounds, vibrant neon accents)
**Personality:** Energetic, futuristic, empowering, direct, bold

**The logo should convey:**
- Action and momentum (launch)
- Guidance and control (pilot)
- Modern technology
- Success and achievement
- Energy and speed

---

## Logo Concept Directions

### Concept A: Rocket Pilot

**Symbol:** Stylized rocket with pilot/compass navigation elements

**Rationale:** "Launch" = rocket taking off, "Pilot" = navigation/guidance

**Visual Elements:**
- Angular rocket silhouette (matches sharp UI aesthetic)
- Integrated compass needle or navigation indicator at nose
- Neon trail/exhaust suggesting upward movement
- Geometric construction, no curves
- Single continuous form

**Mood:** Dynamic, ascending, purposeful

```
Reference sketch:
    ▲
   /|\
  / | \
 /  |  \
    |
   ===
```

### Concept B: Lightning Compass

**Symbol:** Compass rose with lightning bolt integration

**Rationale:** Navigation guidance + speed/energy + the current ⚡ placeholder

**Visual Elements:**
- Minimalist compass design (N/S/E/W points)
- Lightning bolt replacing or integrated with north indicator
- Circular or hexagonal frame (optional)
- Strong geometric lines
- Can work as both contained and standalone symbol

**Mood:** Decisive, electric, directional

```
Reference sketch:
     ⚡
   ╱   ╲
  ╱     ╲
 ●       ●
  ╲     ╱
   ╲   ╱
     ▼
```

### Concept C: Launch Arrow

**Symbol:** Abstract upward arrow with subtle pilot wings

**Rationale:** Growth trajectory + control/mastery + simplicity

**Visual Elements:**
- Bold arrow pointing upper-right (45° angle = progress)
- Subtle wing elements for "pilot" reference
- Angle suggests acceleration and momentum
- Extremely simple - works at 16x16px
- Single color viable

**Mood:** Progressive, ambitious, streamlined

```
Reference sketch:
      ╱
    ╱╱
  ╱╱
═══
```

### Concept D: LP Monogram

**Symbol:** Stylized L and P letterforms combined

**Rationale:** Brand initial recognition + hidden imagery potential

**Visual Elements:**
- Geometric letter construction
- L forms launch pad or base
- P's bowl forms rocket trajectory or rising element
- Negative space creates secondary imagery
- Tech-forward, minimal approach
- Works in single line weight

**Mood:** Professional, clever, memorable

```
Reference sketch:
|     ╔═╗
|     ║ ║
|     ╠═╝
|     ║
└─────╨
```

---

## Logo Variations Required

### 1. Primary Logo (Full)

- **Format:** Symbol + "Launchpilot" wordmark
- **Orientation:** Horizontal
- **Minimum width:** 200px digital / 50mm print
- **Usage:** Website header, marketing materials, presentations

```
[Symbol] Launchpilot
```

### 2. Stacked Logo

- **Format:** Symbol above wordmark
- **Orientation:** Vertical/stacked
- **Minimum height:** 80px digital / 20mm print
- **Usage:** Social media profiles, square placements, print materials

```
  [Symbol]
Launchpilot
```

### 3. Compact Logo

- **Format:** Symbol + "LP" abbreviation
- **Minimum width:** 120px digital / 30mm print
- **Usage:** App header, tight spaces, favicons at larger sizes

```
[Symbol] LP
```

### 4. Icon Only

- **Format:** Symbol isolated
- **Minimum size:** 16x16px (must be legible)
- **Ratio:** Square or near-square
- **Usage:** Favicon, app icon, avatars, small UI elements

```
[Symbol]
```

---

## Wordmark Specifications

### Typography

| Property | Value |
|----------|-------|
| Font | Unbounded Bold (700) or custom variant |
| Case | "Launchpilot" - Capital L, lowercase rest |
| Letter Spacing | -0.02em (slightly tight) |
| Weight | Bold to Extra Bold (700-800) |

### Wordmark Styling Options

**1. Solid**
- Single color application
- Options: Cyan (#00d9ff), White (#f0f3f5), or Dark (#0a0e27)

**2. Gradient**
- Brand gradient: cyan → magenta → yellow
- ```css
  background: linear-gradient(to right, #00d9ff, #c9004f, #ffbe0b);
  ```

**3. Outlined (Neon Effect)**
- For dark backgrounds only
- Stroke with glow effect
- ```css
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
  ```

---

## Color Variations

### Full Color on Dark Background (Primary)

| Element | Color |
|---------|-------|
| Symbol | Gradient (cyan → magenta → yellow) OR Solid cyan (#00d9ff) |
| Wordmark | White (#f0f3f5) OR Gradient |
| Background | Dark (#0a0e27) or transparent |

**This is the PRIMARY logo variation - use whenever possible**

### Full Color on Light Background

| Element | Color |
|---------|-------|
| Symbol | Cyan (#00d9ff) OR Dark (#0a0e27) |
| Wordmark | Dark (#0a0e27) |
| Background | White or light gray |

### Monochrome - White

| Element | Color |
|---------|-------|
| All elements | White (#ffffff) |
| Usage | Dark photography, video overlays, merchandise |

### Monochrome - Black

| Element | Color |
|---------|-------|
| All elements | Black (#000000) |
| Usage | Print, fax, single-color applications, legal documents |

### Monochrome - Cyan

| Element | Color |
|---------|-------|
| All elements | Cyan (#00d9ff) |
| Usage | Brand merchandise, special applications, neon signs |

---

## Clear Space Requirements

### Definition

Clear space = minimum empty area around the logo where no other elements may appear.

### Measurement

**Clear space = height of the capital "L" in Launchpilot**

Apply this measurement to all four sides of the logo.

```
┌──────────────────────────────────┐
│            [X space]             │
│                                  │
│  [X]  ⚡ Launchpilot        [X]  │
│                                  │
│            [X space]             │
└──────────────────────────────────┘

X = height of capital L
```

### Clear Space Rules

1. No text within clear space
2. No graphics within clear space
3. No busy backgrounds directly behind logo
4. Adequate padding from container edges

---

## Minimum Size Requirements

| Variation | Digital (px) | Print (mm) | Notes |
|-----------|--------------|------------|-------|
| Primary (full) | 150px wide | 40mm wide | Wordmark must be legible |
| Stacked | 100px wide | 25mm wide | Symbol must be clear |
| Compact | 80px wide | 20mm wide | "LP" must be readable |
| Icon only | 16px | 4mm | Must be recognizable |

### Small Size Considerations

At sizes below 32px:
- Use icon-only variation
- Ensure adequate stroke weight
- Test at actual size before approval

---

## File Format Deliverables

### Vector Formats (Required)

| Format | Usage | Notes |
|--------|-------|-------|
| SVG | Web, scalable applications | Optimized, clean paths |
| AI | Source file | Editable Adobe Illustrator |
| EPS | Universal vector | Print compatibility |
| PDF | Print-ready vector | CMYK for print, RGB for digital |

### Raster Formats (Required)

| Format | Sizes (px) | Notes |
|--------|------------|-------|
| PNG | 16, 32, 64, 128, 256, 512, 1024 | Transparent background |
| PNG @2x | Double above sizes | Retina displays |
| PNG @3x | Triple above sizes | High-DPI mobile |
| ICO | 16, 32, 48 multi-res | Favicon package |
| WEBP | Match PNG sizes | Web-optimized |

### Special Formats

| Format | Specification | Usage |
|--------|---------------|-------|
| iOS App Icon | 1024x1024 PNG | App Store |
| Android Icon | 512x512 PNG | Play Store |
| Favicon Package | 16, 32, 48, 180, 192, 512 | All browsers |
| Open Graph | 1200x630 PNG | Social sharing |
| Twitter Card | 1200x600 PNG | Twitter previews |

---

## Usage Examples to Provide

### Required Mockups

Please provide mockups showing the logo in these contexts:

1. **Website Header**
   - Desktop (1440px width)
   - Mobile (375px width)
   - Both with dark background

2. **Favicon in Browser Tab**
   - Chrome, Safari, Firefox
   - Show at actual tab size

3. **Social Media Profile**
   - Twitter/X circular crop
   - LinkedIn square
   - Facebook square

4. **Email Signature**
   - 200px wide max
   - On white and dark backgrounds

5. **Business Card**
   - Front: Logo centered
   - Standard 3.5" x 2" size

6. **App Splash Screen**
   - Mobile (iPhone/Android)
   - Centered, dark background

7. **Marketing Banner**
   - Web banner 728x90
   - Social banner 1200x630

---

## Design Guidelines for Designer

### Style Requirements

| Requirement | Specification |
|-------------|---------------|
| Edges | Sharp, angular - NO rounded corners |
| Construction | Geometric, mathematical precision |
| Line Weight | Minimum 2px stroke at small sizes |
| Negative Space | Use strategically for dual imagery |
| Symmetry | Preferred but not required |
| Complexity | Simple enough for 16x16px |

### Aesthetic Alignment

The logo must match the app's cyberpunk aesthetic:
- Dark, moody
- Neon accents
- Tech-forward
- Clean but bold
- Angular, not organic

### What to Avoid

| Avoid | Reason |
|-------|--------|
| Overly complex details | Won't scale to favicon |
| Literal rocket clip-art | Too generic, not ownable |
| Soft/organic curves | Contradicts brand aesthetic |
| Thin hairline strokes | Disappear at small sizes |
| More than 3 colors | Reduces versatility |
| Gradients in icon-only | Must work in single color |
| Drop shadows in base logo | Reduces scalability |
| Trendy effects | Limits longevity |

### Technical Requirements Checklist

- [ ] Recognizable at 16x16 pixels
- [ ] Works in single color (monochrome)
- [ ] Balanced visual weight
- [ ] Clear silhouette shape
- [ ] No orphaned elements
- [ ] Consistent stroke weights
- [ ] Clean vector paths (no artifacts)
- [ ] Proper anchor points
- [ ] No overlapping shapes
- [ ] Expandable outlines available

---

## Color Specifications

### Primary Brand Colors (for logo use)

| Color | Hex | RGB | CMYK (approximate) | Pantone (closest) |
|-------|-----|-----|--------------------|--------------------|
| Cyan | #00d9ff | 0, 217, 255 | 70, 0, 0, 0 | 311 C |
| Magenta | #c9004f | 201, 0, 79 | 0, 100, 50, 15 | 206 C |
| Yellow | #ffbe0b | 255, 190, 11 | 0, 25, 95, 0 | 116 C |
| Dark | #0a0e27 | 10, 14, 39 | 95, 85, 45, 70 | Black 6 C |
| White | #f0f3f5 | 240, 243, 245 | 5, 2, 2, 0 | Cool Gray 1 C |

### Gradient Specification

```css
/* CSS */
background: linear-gradient(90deg, #00d9ff 0%, #c9004f 50%, #ffbe0b 100%);

/* For design tools */
Start: #00d9ff (0%)
Middle: #c9004f (50%)
End: #ffbe0b (100%)
Angle: 90° (left to right)
```

---

## Delivery Checklist

### File Organization

```
launchpilot-logo/
├── source/
│   ├── launchpilot-logo.ai
│   └── launchpilot-logo.eps
├── svg/
│   ├── logo-full.svg
│   ├── logo-full-white.svg
│   ├── logo-full-dark.svg
│   ├── logo-stacked.svg
│   ├── logo-compact.svg
│   └── logo-icon.svg
├── png/
│   ├── @1x/
│   │   ├── logo-full-color-dark-bg.png
│   │   ├── logo-full-white.png
│   │   ├── logo-icon-16.png
│   │   ├── logo-icon-32.png
│   │   ├── logo-icon-64.png
│   │   ├── logo-icon-128.png
│   │   ├── logo-icon-256.png
│   │   ├── logo-icon-512.png
│   │   └── logo-icon-1024.png
│   ├── @2x/
│   │   └── [same files at 2x]
│   └── @3x/
│       └── [same files at 3x]
├── favicon/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── apple-touch-icon.png (180x180)
│   ├── icon-192.png
│   └── icon-512.png
├── social/
│   ├── og-image.png (1200x630)
│   ├── twitter-card.png (1200x600)
│   └── profile-square.png (400x400)
└── mockups/
    ├── website-header.png
    ├── favicon-browser.png
    ├── social-profiles.png
    ├── email-signature.png
    ├── business-card.png
    ├── app-splash.png
    └── marketing-banner.png
```

### Final Delivery

- [ ] All variations in all formats
- [ ] All color versions
- [ ] All sizes with proper naming
- [ ] Organized folder structure
- [ ] Mockups for each use case
- [ ] Brief usage guide PDF

---

## Contact

For questions about these specifications:

**Project:** Launchpilot
**Document Version:** 1.0
**Last Updated:** December 2025

---

## Appendix: Current Placeholder

Until the custom logo is designed, the application uses:

```html
<span class="text-3xl font-black tracking-tighter">
  <span class="bg-gradient-to-r from-cyberpunk-primary via-cyberpunk-accent to-cyberpunk-highlight bg-clip-text text-transparent">
    ⚡ Launchpilot
  </span>
</span>
```

**Visual:** ⚡ Launchpilot (with gradient text)

The final logo should capture the energy of the lightning bolt while being more distinctive and professionally crafted.
