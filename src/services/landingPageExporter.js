/**
 * Landing Page Exporter
 *
 * Converts user-provided form data into clean, responsive HTML/CSS
 * that can be copy-pasted or downloaded and used anywhere.
 */

/**
 * Generate complete landing page HTML
 * @param {Object} formData - Form data from wizard
 * @returns {string} Complete HTML document
 */
export function generateLandingPageHTML(formData) {
  const {
    brand_name = 'My Product',
    tagline = 'Your amazing product tagline',
    primary_color = '#6366f1',
    logo_url = '',
    hero_headline = 'Welcome',
    hero_subheadline = 'Your subheadline here',
    hero_cta_text = 'Get Started',
    hero_image_url = '',
    features = [],
    signup_headline = 'Ready to get started?',
    signup_button_text = 'Create Account',
    signup_success_message = 'Check your email!',
    footer_company_name = 'My Company',
    footer_email = '',
    footer_links = ''
  } = formData

  const css = generateCSS(primary_color)
  const featureSections = generateFeatureSections(features, primary_color)
  const footerHTML = generateFooterHTML(footer_company_name, footer_email, footer_links)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brand_name} - ${tagline}</title>
  <style>
${css}
  </style>
</head>
<body>
  <!-- Navigation -->
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        ${logo_url ? `<img src="${logo_url}" alt="${brand_name}" class="logo">` : ''}
        <span class="brand-name">${brand_name}</span>
      </div>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#signup">Get Started</a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <h1 class="hero-headline">${escapeHTML(hero_headline)}</h1>
        <p class="hero-subheadline">${escapeHTML(hero_subheadline)}</p>
        <button class="btn btn-primary" onclick="document.getElementById('signup').scrollIntoView({behavior: 'smooth'})">${escapeHTML(hero_cta_text)}</button>
      </div>
      ${hero_image_url ? `<div class="hero-image"><img src="${hero_image_url}" alt="Product showcase"></div>` : ''}
    </div>
  </section>

  <!-- Features Section -->
  <section class="features" id="features">
    <div class="container">
      <h2 class="section-title">Why Choose Us?</h2>
      <div class="features-grid">
${featureSections}
      </div>
    </div>
  </section>

  <!-- Signup Section -->
  <section class="signup" id="signup">
    <div class="container">
      <div class="signup-card">
        <h2 class="signup-headline">${escapeHTML(signup_headline)}</h2>
        <form class="signup-form" onsubmit="handleSignup(event)">
          <input
            type="email"
            class="form-input"
            placeholder="Enter your email"
            required
          >
          <button type="submit" class="btn btn-primary">${escapeHTML(signup_button_text)}</button>
        </form>
        <p class="form-note">${escapeHTML(signup_success_message)}</p>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
${footerHTML}
  </footer>

  <script>
    function handleSignup(event) {
      event.preventDefault()
      alert('Thank you for signing up! ${escapeHTML(signup_success_message)}')
      event.target.reset()
    }
  </script>
</body>
</html>`
}

/**
 * Generate CSS with custom primary color
 */
function generateCSS(primaryColor) {
  // Convert hex color to RGB for transparency effects
  const rgbColor = hexToRgb(primaryColor)
  const rgbString = `${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}`

  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #fff;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Navigation */
    .navbar {
      background: white;
      border-bottom: 1px solid #f0f0f0;
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: bold;
      font-size: 1.2rem;
      color: ${primaryColor};
    }

    .logo {
      height: 40px;
      width: auto;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
    }

    .nav-links a {
      text-decoration: none;
      color: #666;
      transition: color 0.3s;
    }

    .nav-links a:hover {
      color: ${primaryColor};
    }

    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, rgba(${rgbString}, 0.1) 0%, rgba(${rgbString}, 0.05) 100%);
      padding: 80px 0;
    }

    .hero .container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .hero-headline {
      font-size: 3rem;
      font-weight: bold;
      line-height: 1.2;
      color: #111;
    }

    .hero-subheadline {
      font-size: 1.25rem;
      color: #666;
      line-height: 1.5;
    }

    .hero-image {
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .hero-image img {
      width: 100%;
      height: auto;
      display: block;
    }

    /* Buttons */
    .btn {
      padding: 12px 28px;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .btn-primary {
      background-color: ${primaryColor};
      color: white;
    }

    .btn-primary:hover {
      background-color: ${darkenColor(primaryColor, 10)};
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(${rgbString}, 0.3);
    }

    /* Features Section */
    .features {
      padding: 80px 0;
      background-color: #f9f9f9;
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: bold;
      text-align: center;
      margin-bottom: 50px;
      color: #111;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }

    .feature-card {
      background: white;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      transition: all 0.3s;
      border: 1px solid #f0f0f0;
    }

    .feature-card:hover {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transform: translateY(-5px);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 15px;
    }

    .feature-title {
      font-size: 1.3rem;
      font-weight: bold;
      margin-bottom: 10px;
      color: #111;
    }

    .feature-description {
      color: #666;
      font-size: 0.95rem;
      line-height: 1.6;
    }

    /* Signup Section */
    .signup {
      padding: 80px 0;
      background: linear-gradient(135deg, ${primaryColor} 0%, ${darkenColor(primaryColor, 20)} 100%);
    }

    .signup-card {
      max-width: 500px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .signup-headline {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 20px;
      text-align: center;
      color: #111;
    }

    .signup-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 20px;
    }

    .form-input {
      padding: 12px 15px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-input:focus {
      outline: none;
      border-color: ${primaryColor};
      box-shadow: 0 0 0 3px rgba(${rgbString}, 0.1);
    }

    .form-note {
      text-align: center;
      color: #999;
      font-size: 0.9rem;
    }

    /* Footer */
    .footer {
      background-color: #1a1a1a;
      color: #fff;
      padding: 40px 0 20px;
      text-align: center;
    }

    .footer-content {
      margin-bottom: 20px;
    }

    .footer-company {
      font-weight: bold;
      margin-bottom: 5px;
    }

    .footer-email {
      color: #aaa;
      font-size: 0.9rem;
      margin-bottom: 20px;
    }

    .footer-links {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .footer-links a {
      color: #aaa;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.3s;
    }

    .footer-links a:hover {
      color: ${primaryColor};
    }

    .footer-credit {
      color: #666;
      font-size: 0.85rem;
      border-top: 1px solid #333;
      padding-top: 20px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero .container {
        grid-template-columns: 1fr;
        padding: 40px 0;
      }

      .hero-headline {
        font-size: 2rem;
      }

      .hero-subheadline {
        font-size: 1rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .signup-card {
        padding: 30px 20px;
      }

      .signup-headline {
        font-size: 1.5rem;
      }

      .nav-links {
        gap: 1rem;
        font-size: 0.9rem;
      }
    }

    @media (max-width: 480px) {
      .hero-headline {
        font-size: 1.5rem;
      }

      .section-title {
        font-size: 1.5rem;
      }

      .btn {
        padding: 10px 20px;
        font-size: 0.9rem;
      }
    }
  `
}

/**
 * Generate feature card sections
 */
function generateFeatureSections(features, primaryColor) {
  if (!features || features.length === 0) {
    return `
      <div class="feature-card">
        <div class="feature-icon">✨</div>
        <h3 class="feature-title">Feature One</h3>
        <p class="feature-description">Add your first feature description here</p>
      </div>
    `
  }

  return features
    .filter(f => f.title && f.description)
    .map(
      f => `
      <div class="feature-card">
        <div class="feature-icon">${f.icon || '✨'}</div>
        <h3 class="feature-title">${escapeHTML(f.title)}</h3>
        <p class="feature-description">${escapeHTML(f.description)}</p>
      </div>
    `
    )
    .join('')
}

/**
 * Generate footer HTML
 */
function generateFooterHTML(companyName, email, linksStr) {
  let footerLinks = ''

  if (linksStr && linksStr.trim()) {
    const links = linksStr.split('\n').filter(l => l.trim())
    footerLinks = `
    <div class="footer-links">
      ${links
        .map(link => {
          const [label, url] = link.split('|').map(s => s.trim())
          return `<a href="${url || '#'}">${label || 'Link'}</a>`
        })
        .join('\n      ')}
    </div>
    `
  }

  return `
    <div class="footer-content">
      ${companyName ? `<div class="footer-company">${escapeHTML(companyName)}</div>` : ''}
      ${email ? `<div class="footer-email">${escapeHTML(email)}</div>` : ''}
      ${footerLinks}
    </div>
    <div class="footer-credit">
      Created with Landing Page Creator Assistant
    </div>
  `
}

/**
 * Utility: Escape HTML special characters
 */
export function escapeHTML(str) {
  if (!str) return ''
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

/**
 * Utility: Convert hex to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : { r: 99, g: 102, b: 241 } // Default indigo
}

/**
 * Utility: Darken color by percentage
 */
function darkenColor(hex, percent) {
  const rgb = hexToRgb(hex)
  const factor = 1 - percent / 100
  const r = Math.max(0, Math.round(rgb.r * factor))
  const g = Math.max(0, Math.round(rgb.g * factor))
  const b = Math.max(0, Math.round(rgb.b * factor))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

// Main exports are:
// - generateLandingPageHTML(formData) - creates complete HTML
// - escapeHTML(str) - utility for HTML escaping
