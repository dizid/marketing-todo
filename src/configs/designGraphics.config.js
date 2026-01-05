/**
 * Design Graphics Configuration
 *
 * Configuration for the guided graphics design mini-app.
 * AI generates design briefs, users follow step-by-step guides to create graphics.
 */

export const designPurposes = [
  {
    id: 'social-banner',
    name: 'Social Media Banner',
    description: 'Eye-catching posts for Twitter, LinkedIn, Facebook',
    specs: '1200x628px or 1080x1080px',
    emoji: '📱'
  },
  {
    id: 'website-hero',
    name: 'Website Hero Image',
    description: 'Large featured image for website homepage',
    specs: '1920x600px or 2560x1440px',
    emoji: '🏠'
  },
  {
    id: 'infographic',
    name: 'Infographic',
    description: 'Data visualization or educational graphic',
    specs: '1200x1600px or custom',
    emoji: '📊'
  },
  {
    id: 'ad-creative',
    name: 'Paid Ad Creative',
    description: 'Google Ads, Facebook Ads, LinkedIn Ads',
    specs: '1200x628px, 1080x1080px, 300x250px',
    emoji: '📢'
  },
  {
    id: 'product-screenshot',
    name: 'Product Screenshot',
    description: 'Feature showcase with annotations',
    specs: 'Native screen size + annotations',
    emoji: '📸'
  },
  {
    id: 'thumbnail',
    name: 'YouTube Thumbnail',
    description: 'Video preview thumbnail',
    specs: '1280x720px',
    emoji: '▶️'
  }
]

export const designStyles = [
  { id: 'modern-minimal', name: 'Modern & Minimal', description: 'Clean, simple, spacious design' },
  { id: 'bold-vibrant', name: 'Bold & Vibrant', description: 'Energetic, colorful, eye-catching' },
  { id: 'professional', name: 'Professional', description: 'Corporate, trust-building, formal' },
  { id: 'playful', name: 'Playful & Fun', description: 'Friendly, approachable, casual' },
  { id: 'luxury', name: 'Luxury & Premium', description: 'High-end, sophisticated, elegant' },
  { id: 'tech', name: 'Tech-Focused', description: 'Modern, futuristic, innovation-driven' }
]

export const diyGuides = {
  canva: {
    id: 'canva',
    name: 'Create in Canva',
    icon: '🎨',
    description: 'Easy drag-and-drop design tool (no experience needed)',
    url: 'https://canva.com',
    steps: [
      {
        number: 1,
        title: 'Create a New Design',
        description: 'Go to Canva.com and search for the size you need (e.g., "Social Media Post 1080x1080"). Create a new design.',
        tip: 'Use exact dimensions from the "Sizing Guide" in your design brief.'
      },
      {
        number: 2,
        title: 'Set Background Color',
        description: 'Click the background. Choose the primary color from your design brief. You can use the color picker or paste the hex code.',
        tip: 'Look for "Background" in the left panel, then click to change color.'
      },
      {
        number: 3,
        title: 'Add Elements & Icons',
        description: 'Click "Elements" on the left. Search for the shapes, icons, or illustrations mentioned in your design brief. Drag them onto the canvas.',
        tip: 'Filter by color to match your palette. Use "Graphics" for illustrations.'
      },
      {
        number: 4,
        title: 'Add Text & Copy',
        description: 'Click "Text" on the left. Click to add a text box. Type your key message/CTA from the brief. Use fonts and colors from the Typography section.',
        tip: 'Make text BIG and readable. Viewers should understand the message in 3 seconds.'
      },
      {
        number: 5,
        title: 'Polish & Download',
        description: 'Arrange elements so nothing overlaps. Use the alignment tools (↑↓←→) in the top toolbar. Download as PNG or JPG.',
        tip: 'Download at the highest quality. Check the box for transparent background if needed.'
      }
    ]
  },

  figma: {
    id: 'figma',
    name: 'Create in Figma',
    icon: '✏️',
    description: 'Professional design tool (free tier available)',
    url: 'https://figma.com',
    steps: [
      {
        number: 1,
        title: 'Create a New File',
        description: 'Go to Figma.com. Click "New File". Create a Frame (⌘F or Ctrl+F) with the exact dimensions from your design brief.',
        tip: 'Go to File → New Design File. Then choose Frame tool from the toolbar.'
      },
      {
        number: 2,
        title: 'Add Frame & Set Colors',
        description: 'With the frame selected, go to Design panel (right side). Set Fill to your primary color from the brief using the hex code.',
        tip: 'Click the Fill color box and paste hex code from your brief.'
      },
      {
        number: 3,
        title: 'Insert Shapes & Icons',
        description: 'Use Assets → Icons, or draw shapes using the shape tools (Rectangle, Circle). Match colors from your palette.',
        tip: 'Search "Feather Icons" or "Phosphor Icons" libraries in Assets for professional icons.'
      },
      {
        number: 4,
        title: 'Add Text Elements',
        description: 'Use the Text tool (T). Type your message/CTA. Apply font and size from the Typography section of your brief.',
        tip: 'Use the Character panel (right side) to set font size, weight, and color.'
      },
      {
        number: 5,
        title: 'Arrange & Export',
        description: 'Arrange elements with alignment tools (top right toolbar). Select the frame and go to File → Export to download as PNG/JPG.',
        tip: 'Set export scale to 2x for high resolution.'
      }
    ]
  },

  midjourney: {
    id: 'midjourney',
    name: 'Generate with Midjourney AI',
    icon: '🤖',
    description: 'AI image generation (requires subscription)',
    url: 'https://midjourney.com',
    steps: [
      {
        number: 1,
        title: 'Prepare Your Prompt',
        description: 'Use the Prompt Template below. Fill in details from your design brief. Write a clear, specific description of what you want.',
        template: '/imagine prompt: [STYLE], [DESIGN TYPE], [KEY ELEMENTS], [COLOR PALETTE], [MOOD], professional quality, high resolution'
      },
      {
        number: 2,
        title: 'Start a Midjourney Chat',
        description: 'Open Midjourney Discord. Go to a #general or #newbies channel. Use the /imagine command and paste your prompt.',
        tip: 'Midjourney creates 4 variations. React to pick your favorites (👍, 👎, etc).'
      },
      {
        number: 3,
        title: 'Refine Your Results',
        description: 'Use the U buttons (U1, U2, U3, U4) to upscale your chosen design. Use V buttons to create variations.',
        tip: 'Try multiple prompts. Iterate until you get what you want.'
      },
      {
        number: 4,
        title: 'Export the Design',
        description: 'Click on your final design. Click "Open in Web". Right-click and "Save Image As" to download as PNG.',
        tip: 'Download at 2x resolution for best quality.'
      },
      {
        number: 5,
        title: 'Enhance in Canva/Figma',
        description: 'Import the AI image into Canva or Figma. Add text overlays, logos, or final touches.',
        tip: 'AI images are great for backgrounds. Overlay your text and branding on top.'
      }
    ]
  },

  dall_e: {
    id: 'dalle',
    name: 'Generate with DALL-E',
    icon: '🎪',
    description: 'OpenAI image generation (requires subscription)',
    url: 'https://openai.com/dall-e',
    steps: [
      {
        number: 1,
        title: 'Open DALL-E 3',
        description: 'Go to ChatGPT.com (with DALL-E 3 access). Describe the graphic you want based on your design brief.',
        tip: 'You can chat naturally - DALL-E 3 understands context better than other tools.'
      },
      {
        number: 2,
        title: 'Write Your Description',
        description: 'Include: design purpose, style, colors, mood, and key elements from your brief. Be specific and detailed.',
        example: 'Create a modern social media banner (1200x628px) for a SaaS product. Bold and vibrant style. Use blue and orange colors. Show a laptop and happy users. Include text "Start Free Trial Today".'
      },
      {
        number: 3,
        title: 'Generate & Iterate',
        description: 'DALL-E creates the image. Ask ChatGPT to regenerate with changes. "Make the colors more vibrant" or "Add more technology elements".',
        tip: 'Iteration is key. Keep refining until it matches your brief.'
      },
      {
        number: 4,
        title: 'Download the Image',
        description: 'Right-click the final image and select "Save Image As" to download as PNG.',
        tip: 'Download at full resolution.'
      },
      {
        number: 5,
        title: 'Add Text Overlay',
        description: 'Import into Canva or Figma to add text, logos, and branding elements on top.',
        tip: 'AI excels at backgrounds and concepts. Add your branding on top.'
      }
    ]
  }
}

export const designGraphicsTask = {
  id: 'content-3',
  name: 'Design Graphics Brief Generator',
  description: 'Create professional graphics with AI-guided design briefs and Canva templates',
  category: 'content',

  // Freemium model - Premium tier task
  tier: 'premium',
  what: 'Get AI-guided design briefs and direct links to Canva templates to create professional graphics (hero images, social assets, infographics). Choose from 20+ pre-designed templates optimized for each design purpose.',
  why: 'Great graphics drive engagement (5-10x more shares). Consistent visual style builds brand recognition. Canva templates eliminate blank-canvas paralysis and get you creating in seconds.',
  how: 'Describe what you want to create, then get an AI-generated design brief AND curated Canva templates matching your design purpose and style. Click a template, customize with your colors/message, download. Done in 5 minutes.',

  form: [
    {
      id: 'design_purpose',
      type: 'select',
      label: 'Design Purpose',
      options: designPurposes.map(p => ({ value: p.id, label: p.name })),
      description: 'What type of graphic do you want to create?',
      required: true
    },
    {
      id: 'design_style',
      type: 'select',
      label: 'Design Style',
      options: designStyles.map(s => ({ value: s.id, label: s.name })),
      description: 'What visual style fits your brand?',
      required: true
    },
    {
      id: 'key_message',
      type: 'text',
      label: 'Key Message / CTA',
      placeholder: 'e.g., "Start Free Trial", "Join 10K+ Users"',
      description: 'What do you want the design to communicate?',
      required: true
    }
  ],

  customComponent: 'DesignGraphicsMiniApp',
  diyGuides: diyGuides,
  designPurposes: designPurposes,
  designStyles: designStyles,

  output: {
    enabled: false
  },

  help: {
    examples: [
      {
        scenario: 'Creating social media graphics for product launch',
        input: { design_purpose: 'social-banner', design_style: 'modern-minimal', key_message: 'Launch Week - 50% Off' },
        output: 'AI-generated design brief with composition guidelines (centered text with accent shape), color palette (primary blue #4A90E2, accent orange #F5A623, white background), typography recommendations (bold sans-serif 72pt for headline), and step-by-step Canva tutorial to create a 1200x628px launch banner with the promo message.'
      },
      {
        scenario: 'Designing hero image for landing page',
        input: { design_purpose: 'website-hero', design_style: 'tech', key_message: 'Build Faster with AI' },
        output: 'Design brief for 1920x600px hero image with futuristic gradient background (dark blue to purple), AI-generated Midjourney prompt for tech-focused imagery, layout suggestions for overlaying text, and Figma step-by-step guide to position headline, add subtle geometric shapes, and export at 2x resolution.'
      }
    ],
    commonMistakes: [
      'Using too many fonts and colors - mixing 5 fonts and 8 colors creates visual chaos. Stick to 1-2 fonts and 2-3 colors maximum for cohesive, professional designs.',
      'Making text too small - creating graphics with tiny text that\'s unreadable on mobile. Ensure headline text is at least 48pt, body text 24pt minimum for social media graphics.',
      'Forgetting to check mobile preview - designing on desktop and never checking how it looks on a phone screen. Always preview graphics at actual size on mobile devices.',
      'Not leaving breathing room - cramming every pixel with elements. Use white space generously - aim for 20-30% of your design to be empty space for visual clarity.',
      'Using low-resolution images - downloading images at 72dpi or small sizes that pixelate when enlarged. Always export at 2x resolution (300dpi for print, high-res for web).',
      'Ignoring brand consistency - creating each graphic with different styles. Maintain consistent colors, fonts, and visual style across all graphics to build brand recognition.'
    ]
  }
}
