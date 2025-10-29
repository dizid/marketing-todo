/**
 * Landing Page Creator Assistant Configuration
 *
 * Defines the 5-step wizard flow for creating landing pages.
 * Each step contains field definitions, tips, and AI helpers.
 */

export const wizardSteps = [
  {
    id: 'brand-basics',
    stepNumber: 1,
    title: '🎨 Step 1: Brand Basics',
    guide:
      'Start with your brand identity. This is what visitors see first. Your tagline should answer: "What is this and why should I care?"',
    fields: [
      {
        id: 'brand_name',
        type: 'text',
        label: 'Product/Brand Name',
        placeholder: 'e.g., CloudSync, TaskFlow, SendVibes',
        tip: 'This is the name of what you\'re promoting. Keep it clear and memorable.',
        description: 'The name that appears at the top of your landing page',
        required: true
      },
      {
        id: 'tagline',
        type: 'text',
        label: 'Your Tagline (One-liner)',
        placeholder: 'e.g., The easiest way to collaborate in real-time',
        tip: 'A one-sentence description of what you do. Focus on BENEFITS, not features. Avoid jargon.',
        description: 'This appears in the header and makes visitors understand your value in seconds',
        required: true,
        aiTip: true
      },
      {
        id: 'logo_url',
        type: 'text',
        label: 'Logo URL (Optional)',
        placeholder: 'https://example.com/logo.png',
        tip: 'Full URL to your logo image (PNG, JPG, SVG). Make sure the URL works. If you don\'t have a logo, leave this blank.',
        description: 'URL to your brand logo image'
      },
      {
        id: 'primary_color',
        type: 'color',
        label: 'Brand Color',
        placeholder: '#6366f1',
        tip: 'Pick your brand color. This will be used for buttons and highlights. Try colors that match your brand identity.',
        description: 'Your primary brand color (hex format)',
        required: true,
        default: '#6366f1'
      }
    ]
  },

  {
    id: 'hero-section',
    stepNumber: 2,
    title: '🎯 Step 2: Hero Section (Your Hook)',
    guide:
      'The hero section is your first impression. Your headline should grab attention and make people want to read more. Think: "What\'s the biggest benefit I provide?"',
    fields: [
      {
        id: 'hero_headline',
        type: 'text',
        label: 'Main Headline',
        placeholder: 'e.g., Ship Products 2x Faster | The Easiest CRM Ever Made',
        tip: 'Your biggest, boldest statement. Make it benefit-focused, not feature-focused. Example: NOT "Real-time Collaboration" but "Work With Your Team Instantly"',
        description: 'The main headline visitors see first. Make it powerful.',
        required: true,
        aiTip: true
      },
      {
        id: 'hero_subheadline',
        type: 'textarea',
        label: 'Sub-headline (Supporting Text)',
        placeholder: 'e.g., Join 10,000+ teams who already save 15+ hours per week',
        tip: 'Support your main headline with a concrete benefit or proof point. Use numbers, results, or social proof.',
        description: '2-3 sentences that explain your value and add credibility',
        rows: 3,
        required: true,
        aiTip: true
      },
      {
        id: 'hero_cta_text',
        type: 'text',
        label: 'CTA Button Text',
        placeholder: 'e.g., Get Started Free, Try Risk-Free, Book Demo',
        tip: 'Action-oriented text on your button. "Sign Up" is boring. Try "Start Free Trial", "Get Started Now", "Book a Demo"',
        description: 'Text on the main call-to-action button',
        required: true,
        default: 'Get Started Free',
        aiTip: true
      },
      {
        id: 'hero_image_url',
        type: 'text',
        label: 'Hero Image URL (Optional)',
        placeholder: 'https://example.com/hero-image.png',
        tip: 'A product screenshot, demo video thumbnail, or compelling image. This should show your product in action or illustrate the benefit.',
        description: 'Full URL to your hero image or product screenshot'
      }
    ]
  },

  {
    id: 'features',
    stepNumber: 3,
    title: '⭐ Step 3: Features & Benefits (Why They Should Care)',
    guide:
      'Show 3-5 key benefits. Focus on WHAT USERS GAIN, not what the product does. Example: Instead of "API Integration" say "Connects With Your Favorite Tools".',
    fields: [
      {
        id: 'feature_1_title',
        type: 'text',
        label: 'Benefit 1 Title',
        placeholder: 'e.g., Save Hours Every Week',
        tip: 'Focus on outcome, not feature. What benefit do they get?',
        required: true,
        aiTip: true
      },
      {
        id: 'feature_1_description',
        type: 'textarea',
        label: 'Benefit 1 Description',
        placeholder: 'Why this matters and how users benefit from this feature',
        tip: 'Write 1-2 sentences explaining the benefit. Be specific. Use "you" language. Example: "You save 15+ hours weekly so you can focus on what matters."',
        rows: 2,
        required: true,
        aiTip: true
      },
      {
        id: 'feature_1_icon',
        type: 'emoji-picker',
        label: 'Benefit 1 Icon (Emoji)',
        placeholder: '⭐',
        tip: 'Pick an emoji that represents this benefit. This makes your landing page more visual and friendly.',
        default: '✨'
      },

      {
        id: 'feature_2_title',
        type: 'text',
        label: 'Benefit 2 Title',
        placeholder: 'e.g., Works With Everything You Use',
        required: true,
        aiTip: true
      },
      {
        id: 'feature_2_description',
        type: 'textarea',
        label: 'Benefit 2 Description',
        placeholder: 'Why this matters and how users benefit from this feature',
        rows: 2,
        required: true,
        aiTip: true
      },
      {
        id: 'feature_2_icon',
        type: 'emoji-picker',
        label: 'Benefit 2 Icon (Emoji)',
        default: '⚡'
      },

      {
        id: 'feature_3_title',
        type: 'text',
        label: 'Benefit 3 Title',
        placeholder: 'e.g., Bank-Level Security',
        required: true,
        aiTip: true
      },
      {
        id: 'feature_3_description',
        type: 'textarea',
        label: 'Benefit 3 Description',
        placeholder: 'Why this matters and how users benefit from this feature',
        rows: 2,
        required: true,
        aiTip: true
      },
      {
        id: 'feature_3_icon',
        type: 'emoji-picker',
        label: 'Benefit 3 Icon (Emoji)',
        default: '🔒'
      },

      {
        id: 'feature_4_title',
        type: 'text',
        label: 'Benefit 4 Title (Optional)',
        placeholder: 'e.g., 24/7 Expert Support',
        aiTip: true
      },
      {
        id: 'feature_4_description',
        type: 'textarea',
        label: 'Benefit 4 Description',
        placeholder: 'Why this matters and how users benefit from this feature',
        rows: 2,
        aiTip: true
      },
      {
        id: 'feature_4_icon',
        type: 'emoji-picker',
        label: 'Benefit 4 Icon (Emoji)',
        default: '💬'
      },

      {
        id: 'feature_5_title',
        type: 'text',
        label: 'Benefit 5 Title (Optional)',
        placeholder: 'e.g., Scale Without Limits',
        aiTip: true
      },
      {
        id: 'feature_5_description',
        type: 'textarea',
        label: 'Benefit 5 Description',
        placeholder: 'Why this matters and how users benefit from this feature',
        rows: 2,
        aiTip: true
      },
      {
        id: 'feature_5_icon',
        type: 'emoji-picker',
        label: 'Benefit 5 Icon (Emoji)',
        default: '📈'
      }
    ]
  },

  {
    id: 'signup',
    stepNumber: 4,
    title: '📧 Step 4: Signup Section (Your Conversion Tool)',
    guide:
      'This is where you convert visitors into users. Make it irresistible. Create urgency, add social proof, and remove friction. Keep the form simple - ask for email only.',
    fields: [
      {
        id: 'signup_headline',
        type: 'text',
        label: 'Signup Section Headline',
        placeholder: 'e.g., Ready to get started? | Join 10,000+ happy users',
        tip: 'This should create a sense of urgency or excitement. Why should they sign up NOW?',
        required: true,
        default: 'Ready to get started?',
        aiTip: true
      },
      {
        id: 'signup_subheadline',
        type: 'textarea',
        label: 'Signup Sub-headline (Optional)',
        placeholder: 'e.g., Start for free. No credit card required. Cancel anytime.',
        tip: 'Remove objections. "No credit card" "Free forever" "Cancel anytime" "Money-back guarantee"',
        rows: 2,
        aiTip: true
      },
      {
        id: 'signup_button_text',
        type: 'text',
        label: 'Signup Button Text',
        placeholder: 'e.g., Create My Free Account | Try Free For 14 Days',
        tip: 'Be specific and action-oriented. "Create Account" converts better than "Submit"',
        required: true,
        default: 'Create Free Account',
        aiTip: true
      },
      {
        id: 'signup_success_message',
        type: 'text',
        label: 'Success Message',
        placeholder: 'e.g., Check your email to verify your account!',
        tip: 'What should visitors see after they sign up? Confirm what happens next.',
        required: true,
        default: 'Check your email to verify your account!',
        aiTip: true
      }
    ]
  },

  {
    id: 'footer',
    stepNumber: 5,
    title: '📄 Step 5: Footer & Finish',
    guide: 'Almost done! Add your footer with company info and links. This builds trust and provides legal/support info.',
    fields: [
      {
        id: 'footer_company_name',
        type: 'text',
        label: 'Company Name (Footer)',
        placeholder: 'Your Company Inc.',
        tip: 'Shows who created this. Builds trust.',
        description: 'Your company name for the footer'
      },
      {
        id: 'footer_email',
        type: 'text',
        label: 'Contact Email',
        placeholder: 'hello@example.com',
        tip: 'Support email for visitors who want to reach you before signing up.',
        description: 'Email address for visitors to contact you'
      },
      {
        id: 'footer_links',
        type: 'textarea',
        label: 'Footer Links (Optional)',
        placeholder: 'Privacy Policy|https://example.com/privacy\nTerms of Service|https://example.com/terms\nAbout Us|https://example.com/about',
        tip: 'Add links to Privacy, Terms, etc. Format: Label|URL (one per line)',
        rows: 3,
        description: 'Links for footer (Label|URL format, one per line)'
      }
    ]
  }
]

/**
 * Tips and guides for teaching users about landing page best practices
 */
export const landingPageGuides = {
  headlines: {
    title: 'How to Write Great Headlines',
    tips: [
      'Focus on BENEFITS, not features. What does the user gain?',
      'Use numbers: "Save 5 hours per week" vs "Save time"',
      'Create urgency: "Limited time" "Start today"',
      'Be specific: "The easiest CRM for teams" vs "CRM software"',
      'Test different headlines - they matter most'
    ]
  },

  features: {
    title: 'Features vs Benefits',
    features: [
      {
        bad: 'Real-time collaboration',
        good: 'Work with your team instantly, no delays'
      },
      {
        bad: 'API integration',
        good: 'Connect with tools you already use'
      },
      {
        bad: 'Advanced security',
        good: 'Your data is protected with military-grade encryption'
      },
      {
        bad: '99.9% uptime',
        good: 'Always available when you need it'
      }
    ]
  },

  socialProof: {
    title: 'Add Social Proof',
    tips: [
      'Customer count: "Join 50,000+ users"',
      'Testimonials: "Our customers love us"',
      'Results: "Save 10+ hours per week"',
      'Trust badges: "Used by Fortune 500 companies"',
      'Reviews: Show ratings and reviews'
    ]
  }
}

/**
 * Starter templates for quick-start
 */
export const landingPageTemplates = {
  saas: {
    id: 'saas',
    name: 'SaaS/Software Product',
    description: 'Perfect for tools, apps, and cloud services',
    data: {
      brand_name: 'My Amazing Tool',
      tagline: 'The easiest way to solve your biggest problem',
      primary_color: '#6366f1',
      hero_headline: 'Build Better, Faster, Together',
      hero_subheadline:
        'Empower your team with tools they actually love. Join 50,000+ happy users saving hours every week.',
      hero_cta_text: 'Start Free Trial',
      features: [
        {
          title: 'Lightning Fast',
          description: 'Get results instantly. No waiting, no headaches. Designed for speed.',
          icon: '⚡'
        },
        {
          title: 'Easy to Use',
          description: 'So intuitive you\'ll start being productive in minutes.',
          icon: '✨'
        },
        {
          title: 'Secure & Reliable',
          description: 'Enterprise-grade security with 99.9% uptime guarantee.',
          icon: '🔒'
        },
        {
          title: 'Integrates With Everything',
          description: 'Connect with 1000+ apps and tools you already use.',
          icon: '🔗'
        }
      ],
      signup_headline: 'Join thousands of happy users today',
      signup_subheadline:
        'Start your free trial. No credit card required. Cancel anytime.',
      signup_button_text: 'Create My Free Account',
      footer_company_name: 'My Company'
    }
  },

  ecommerce: {
    id: 'ecommerce',
    name: 'E-commerce Product',
    description: 'Ideal for selling products or services',
    data: {
      brand_name: 'Premium Products',
      tagline: 'Quality products you\'ll love, at prices you\'ll love more',
      primary_color: '#ef4444',
      hero_headline: 'Discover Something Amazing',
      hero_subheadline:
        'Handpicked products. Premium quality. Unbeatable prices. Delivered fast.',
      hero_cta_text: 'Shop Now',
      features: [
        {
          title: 'Premium Quality',
          description: 'Everything is carefully tested and selected for excellence.',
          icon: '✨'
        },
        {
          title: 'Fast Free Shipping',
          description: 'Orders arrive in 2-3 days. Free shipping on orders over $50.',
          icon: '🚚'
        },
        {
          title: 'Happiness Guaranteed',
          description: 'Love it or get your money back, no questions asked.',
          icon: '✅'
        },
        {
          title: 'Expert Support',
          description: 'Chat with our team 24/7. We\'re here to help.',
          icon: '💬'
        }
      ],
      signup_headline: 'Get exclusive deals and early access',
      signup_subheadline: 'Be the first to know about new products and sales.',
      signup_button_text: 'Join Our Newsletter',
      footer_company_name: 'Premium Products Co.'
    }
  },

  agency: {
    id: 'agency',
    name: 'Service/Agency',
    description: 'For agencies, consultants, and service businesses',
    data: {
      brand_name: 'Design & Growth Agency',
      tagline: 'We help ambitious brands win through design and strategy',
      primary_color: '#8b5cf6',
      hero_headline: 'Your Brand Deserves Better',
      hero_subheadline:
        'Award-winning design and marketing strategies that drive real, measurable results. 300% average ROI for our clients.',
      hero_cta_text: 'Schedule Free Consultation',
      features: [
        {
          title: 'Expert Team',
          description:
            'Talented designers and strategists with 50+ years of combined experience.',
          icon: '👥'
        },
        {
          title: 'Proven Results',
          description: 'Average 300% ROI. Real case studies. Real results.',
          icon: '📊'
        },
        {
          title: 'Full Service',
          description: 'Brand strategy, design, marketing, and growth consulting.',
          icon: '🎨'
        },
        {
          title: 'Your Growth',
          description: 'We succeed when you succeed. Long-term partnership approach.',
          icon: '🚀'
        }
      ],
      signup_headline: 'Ready to grow your brand?',
      signup_subheadline: 'Let\'s chat about your vision.',
      signup_button_text: 'Schedule Consultation',
      footer_company_name: 'Design & Growth Agency'
    }
  }
}
