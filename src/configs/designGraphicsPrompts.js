/**
 * Design Graphics Prompt Templates
 *
 * AI-optimized prompt templates for different design purposes and styles
 * Each template includes placeholders that get filled with user input
 */

export const promptTemplates = {
  'social-banner': {
    'modern-minimal': 'A clean, minimal social media post design featuring {keyMessage}. Minimalist aesthetic, plenty of white space, single accent color, sans-serif typography. Professional but approachable. 1080x1080px',
    'bold-vibrant': 'A vibrant, eye-catching social media post with {keyMessage}. Bold colors, high contrast, dynamic composition, modern without being corporate. Designed to stop the scroll. 1080x1080px',
    'professional': 'A professional social media announcement featuring {keyMessage}. Corporate aesthetic, balanced composition, subtle gradient or color blocking, trust-building design. Business-ready. 1200x628px',
    'playful': 'A fun and playful social media graphic with {keyMessage}. Friendly, approachable, rounded shapes, vibrant colors, whimsical elements. Engaging and inviting. 1080x1080px',
    'luxury': 'A luxury brand social media post featuring {keyMessage}. Sophisticated, elegant, high-end aesthetic, premium colors (black, gold, white), spacious layout, refined typography. 1080x1080px',
    'tech': 'A tech-focused social media design with {keyMessage}. Futuristic elements, gradient backgrounds, geometric shapes, modern typography, innovation-driven aesthetic. Forward-thinking. 1080x1080px'
  },

  'website-hero': {
    'modern-minimal': 'A clean, modern website hero image for {keyMessage}. Minimalist design, lots of breathing room, subtle background with prominent text area, contemporary aesthetic. 1920x600px',
    'bold-vibrant': 'A bold, impactful website hero image featuring {keyMessage}. Vibrant gradient background, dynamic composition, large engaging visuals, modern and energetic. 1920x600px',
    'professional': 'A professional website hero banner for {keyMessage}. Corporate aesthetic, balanced layout, professional imagery, trust-building design. Business website ready. 1920x600px',
    'playful': 'A fun and engaging website hero for {keyMessage}. Friendly, approachable, colorful, welcoming design that invites exploration. Consumer-focused. 1920x600px',
    'luxury': 'A premium, luxury website hero featuring {keyMessage}. Elegant, sophisticated, high-end aesthetic with refined typography and premium imagery. Upscale brand positioning. 1920x600px',
    'tech': 'A cutting-edge tech company website hero with {keyMessage}. Futuristic elements, gradient or holographic effects, modern UI/UX aesthetic, innovation-forward. 1920x600px'
  },

  'infographic': {
    'modern-minimal': 'A clean, minimal infographic about {keyMessage}. Minimalist design with plenty of white space, single accent color, clear hierarchy, easy to scan. Educational and beautiful. 1200x1600px',
    'bold-vibrant': 'A vibrant, colorful infographic presenting {keyMessage}. Bright colors, bold typography, engaging layout, eye-catching design that communicates data clearly. 1200x1600px',
    'professional': 'A professional infographic showing {keyMessage}. Corporate style, clear data visualization, balanced layout, trust-building design. Business presentation ready. 1200x1600px',
    'playful': 'A fun infographic about {keyMessage}. Playful design with illustrations, friendly typography, engaging layout. Makes complex information accessible and fun. 1200x1600px',
    'luxury': 'A premium infographic about {keyMessage}. Sophisticated design, elegant typography, premium color palette (blacks, golds, whites), upscale aesthetic. 1200x1600px',
    'tech': 'A tech-focused infographic explaining {keyMessage}. Modern design with data visualization, tech elements, futuristic aesthetic, clear information architecture. 1200x1600px'
  },

  'ad-creative': {
    'modern-minimal': 'A minimalist paid ad for {keyMessage}. Clean design, clear CTA, minimal text, strong visual hierarchy, modern aesthetic. High conversion potential. 1200x628px',
    'bold-vibrant': 'A bold, attention-grabbing ad creative for {keyMessage}. Vibrant colors, high contrast, eye-catching design, clear call-to-action, scroll-stopping power. 1200x628px',
    'professional': 'A professional paid ad featuring {keyMessage}. Corporate aesthetic, clear value proposition, professional imagery, B2B ready, trust-building design. 1200x628px',
    'playful': 'A fun, engaging ad for {keyMessage}. Playful design, friendly message, approachable aesthetic, designed to appeal to consumer audiences. 1200x628px',
    'luxury': 'A luxury brand ad featuring {keyMessage}. Premium aesthetic, elegant design, high-end imagery, sophisticated typography, aspirational messaging. 1200x628px',
    'tech': 'A tech product ad with {keyMessage}. Futuristic design, product-focused, modern UI aesthetic, innovation highlighted, forward-thinking messaging. 1200x628px'
  },

  'product-screenshot': {
    'modern-minimal': 'A clean, minimal product screenshot showcasing {keyMessage}. Annotations with arrows, minimalist aesthetic, focus on key features, whitespace-heavy design. 1080x1080px',
    'bold-vibrant': 'A bold product screenshot featuring {keyMessage}. Colorful annotations, vibrant callouts, engaging visual design, highlights key features prominently. 1080x1080px',
    'professional': 'A professional product screenshot of {keyMessage}. Corporate styling, clear annotations, professional callouts, B2B aesthetic, feature-focused. 1080x1080px',
    'playful': 'A fun product screenshot displaying {keyMessage}. Playful annotations, friendly callouts, engaging design, consumer-friendly presentation. 1080x1080px',
    'luxury': 'A premium product screenshot of {keyMessage}. Sophisticated presentation, elegant annotations, upscale aesthetic, highlighting premium features. 1080x1080px',
    'tech': 'A tech-focused product screenshot of {keyMessage}. Modern interface design, technical callouts, futuristic aesthetic, feature-rich presentation. 1080x1080px'
  },

  'thumbnail': {
    'modern-minimal': 'A clean YouTube thumbnail for {keyMessage}. Minimalist design, maximum readability, single accent color, professional typography. Clickable without clutter. 1280x720px',
    'bold-vibrant': 'A bold, eye-catching YouTube thumbnail with {keyMessage}. High contrast colors, large readable text, vibrant design, maximizes click-through rate. 1280x720px',
    'professional': 'A professional YouTube thumbnail for {keyMessage}. Clean design, professional appearance, business-appropriate, high visibility. 1280x720px',
    'playful': 'A fun, engaging YouTube thumbnail about {keyMessage}. Playful design, bright colors, friendly aesthetic, appealing to casual viewers. 1280x720px',
    'luxury': 'A premium YouTube thumbnail for {keyMessage}. Elegant design, sophisticated colors, upscale aesthetic, luxury brand positioning. 1280x720px',
    'tech': 'A tech-focused YouTube thumbnail of {keyMessage}. Modern design, tech aesthetic, futuristic elements, appeals to tech-savvy viewers. 1280x720px'
  }
}

/**
 * Get prompt template for a specific purpose and style
 * @param {string} purposeId - Design purpose (e.g., 'social-banner')
 * @param {string} styleId - Design style (e.g., 'modern-minimal')
 * @param {string} keyMessage - User's key message to fill template
 * @returns {string} Filled prompt template
 */
export function getPromptTemplate(purposeId, styleId, keyMessage) {
  const templates = promptTemplates[purposeId]
  if (!templates) {
    return buildGenericPrompt(purposeId, styleId, keyMessage)
  }

  const template = templates[styleId]
  if (!template) {
    return buildGenericPrompt(purposeId, styleId, keyMessage)
  }

  return template.replace('{keyMessage}', keyMessage)
}

/**
 * Fallback generic prompt builder
 */
function buildGenericPrompt(purposeId, styleId, keyMessage) {
  const purposeNames = {
    'social-banner': 'social media post',
    'website-hero': 'website hero image',
    'infographic': 'infographic',
    'ad-creative': 'paid advertisement',
    'product-screenshot': 'product screenshot',
    'thumbnail': 'video thumbnail'
  }

  const styleAdjectives = {
    'modern-minimal': 'clean and minimal',
    'bold-vibrant': 'vibrant and bold',
    'professional': 'professional',
    'playful': 'fun and playful',
    'luxury': 'luxury and elegant',
    'tech': 'tech-focused and futuristic'
  }

  const purposeName = purposeNames[purposeId] || 'graphic'
  const styleAdj = styleAdjectives[styleId] || 'professional'

  return `A ${styleAdj} ${purposeName} with the message: "${keyMessage}". High quality, professional design, optimized for digital use.`
}

/**
 * Get all available styles for a purpose
 */
export function getStylesForPurpose(purposeId) {
  const templates = promptTemplates[purposeId]
  return templates ? Object.keys(templates) : []
}

/**
 * Validate that a purpose and style combination exists
 */
export function isValidCombination(purposeId, styleId) {
  const templates = promptTemplates[purposeId]
  return templates && templates[styleId] !== undefined
}
