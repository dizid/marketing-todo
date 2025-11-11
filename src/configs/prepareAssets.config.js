/**
 * Prepare Assets Configuration
 *
 * Asset definitions for the Prepare Assets mini app.
 * Each asset has guidance on what to create, why it matters, and pro tips.
 */

export const assets = [
  {
    id: 'logo',
    name: 'Logo',
    icon: '📝',
    description: 'Company/product logo in multiple formats',
    why: 'Users recognize your brand instantly. A professional logo builds trust and looks polished on all platforms.',
    instruction: 'Create a logo in SVG (scalable) and PNG (web) formats with a transparent background',
    specs: 'Minimum 1000x1000px for PNG, transparent background recommended',
    tools: [
      { name: 'Canva (easiest)', url: 'https://www.canva.com/create/logos/' },
      { name: 'Figma (professional)', url: 'https://www.figma.com' },
      { name: 'Adobe Illustrator', url: 'https://www.adobe.com/products/illustrator.html' }
    ],
    helpText: 'Ask a designer friend or use Canva\'s templates. You need: SVG file (for scaling on web) and PNG file (for social media and screenshots). Keep the file size under 500KB.'
  },

  {
    id: 'hero-image',
    name: 'Hero Image / Screenshot',
    icon: '🖼️',
    description: 'Main product image or demo screenshot for your landing page',
    why: 'The first image users see makes a huge impression. It should show your product in action or create excitement.',
    instruction: 'Take a professional screenshot of your app, or create a mockup showing how your product solves the problem',
    specs: 'Recommended: 1200x800px or 1600x900px, JPG or PNG format, under 2MB',
    tools: [
      { name: 'Screenshot tool (Mac/Windows)', url: 'https://support.microsoft.com/en-us/windows/use-snipping-tool-to-capture-screenshots-00246869' },
      { name: 'Figma mockups', url: 'https://www.figma.com' },
      { name: 'Canva templates', url: 'https://www.canva.com/' }
    ],
    helpText: 'For SaaS: Show your app with real data. For physical products: show it in use. For services: show the result/benefit. Make it visually appealing!'
  },

  {
    id: 'demo-video',
    name: 'Demo Video',
    icon: '🎬',
    description: 'Short product demo video (30-60 seconds)',
    why: 'Video converts better than text or images. Users understand your product faster when they see it in action.',
    instruction: 'Record a quick screen recording or video showing the key features and benefits of your product',
    specs: 'Duration: 30-60 seconds max. Format: MP4 or WebM. Resolution: 1080p (1920x1080) recommended',
    tools: [
      { name: 'Loom (easiest)', url: 'https://www.loom.com' },
      { name: 'OBS Studio (free)', url: 'https://obsproject.com/' },
      { name: 'ScreenFlow (Mac)', url: 'https://www.telestream.net/screenflow/' }
    ],
    helpText: 'Keep it short and punchy. Show: Problem → Solution → Key feature → Call-to-action. No need for fancy editing - authenticity wins. Talk naturally at normal speed.'
  },

  {
    id: 'brand-colors',
    name: 'Brand Colors & Fonts',
    icon: '🎨',
    description: 'Document your brand color palette and typography',
    why: 'Consistent colors and fonts make your brand recognizable. They tie everything together visually.',
    instruction: 'Choose 2-3 primary colors and 1-2 accent colors. Pick 1-2 fonts for headings and body text.',
    specs: 'Save colors as: Primary (#HEX), Secondary (#HEX), Accent (#HEX). Fonts: Specify font names and weights (Bold, Regular, etc)',
    tools: [
      { name: 'Coolors (color picker)', url: 'https://coolors.co' },
      { name: 'Google Fonts', url: 'https://fonts.google.com' },
      { name: 'Adobe Color', url: 'https://color.adobe.com' }
    ],
    helpText: 'Use 2-3 colors max (psychology matters: blue=trust, green=growth, red=urgency). Pick readable fonts. Google Fonts are free and professional. Save this in a doc or image.'
  },

  {
    id: 'social-images',
    name: 'Social Media Images',
    icon: '📸',
    description: 'Pre-sized images for social media posts',
    why: 'Each platform has different image dimensions. Pre-sized images save time and ensure they look great everywhere.',
    instruction: 'Create image templates in the correct sizes for Twitter, LinkedIn, Instagram, and Facebook',
    specs: 'Twitter: 1200x675px | LinkedIn: 1200x627px | Instagram: 1080x1080px (square) | Facebook: 1200x628px',
    tools: [
      { name: 'Canva (templates included)', url: 'https://www.canva.com/create/social-media-posts/' },
      { name: 'Figma templates', url: 'https://www.figma.com' },
      { name: 'Buffer (free)', url: 'https://buffer.com/resources/social-media-sizes' }
    ],
    helpText: 'Use Canva - it has built-in templates for each platform with the correct sizes. Add your logo, colors, and a compelling message. Save as PNG or JPG.'
  }
]

export const prepareAssetsTask = {
  id: 'setup-4',
  name: 'Prepare Assets',
  description: 'Create logos, images, videos, and brand guidelines',
  category: 'setup',

  // Freemium model - Premium tier task
  tier: 'premium',
  what: 'Organize and create all your brand assets—logos, hero images, demo videos, color palettes, and social media templates. One central place for all brand materials.',
  why: 'Consistent branding across all channels builds recognition and trust. Disorganized assets waste time when you need them fast. A brand guideline saves hundreds of hours.',
  how: 'Follow the 5-step asset checklist. Create or upload each asset (logo, hero image, videos, colors, social templates). Export as ready-to-use files for any channel.',

  form: [],
  ai: null,

  output: {
    enabled: false
  },

  customComponent: 'PrepareAssetsMiniApp',
  assets: assets
}
