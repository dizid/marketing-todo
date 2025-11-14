/**
 * Lead Magnet Ideas Generator - Task 8.1
 */

export const leadMagnetTask = {
  id: 'growth-1',
  name: 'Lead Magnet Ideas Generator',
  description: 'Generate high-converting lead magnet ideas with landing pages and nurture sequences',
  category: 'growth',
  tier: 'free',

  what: 'Get 10 lead magnet ideas tailored to your audience and business model. For each idea, receive conversion-optimized landing page copy, delivery mechanisms, follow-up nurture sequences, and promotion strategies. Transform cold traffic into qualified leads.',

  why: 'Your email list is your most valuable asset - subscribers convert 10x higher than social followers. But generic "newsletter signups" get 1-2% opt-in rates. The right lead magnet can achieve 30-60% opt-in rates and attract pre-qualified buyers.',

  how: 'Describe your industry, target audience, main customer problem, and business model. AI will generate 10 lead magnet concepts aligned with your eventual offer, complete with landing page templates, delivery strategies, and nurture sequences to convert leads to customers.',

  form: [
    {
      id: 'industry',
      type: 'text',
      label: 'Industry/Niche',
      placeholder: 'e.g., B2B SaaS, E-commerce, Coaching, etc.',
      required: true
    },
    {
      id: 'target_audience',
      type: 'textarea',
      label: 'Target Audience',
      placeholder: 'Who are you trying to attract? (role, challenges, goals)',
      required: true,
      rows: 2
    },
    {
      id: 'main_problem',
      type: 'textarea',
      label: 'Main Problem You Solve',
      placeholder: 'What is the #1 pain point your business addresses?',
      required: true,
      rows: 2,
      description: 'Lead magnet should address a quick win related to this problem'
    },
    {
      id: 'business_model',
      type: 'select',
      label: 'Business Model',
      options: [
        { value: 'info-product', label: 'Info products (courses, ebooks)' },
        { value: 'service', label: 'Service business (coaching, consulting, agency)' },
        { value: 'saas', label: 'SaaS/Software' },
        { value: 'ecommerce', label: 'E-commerce' },
        { value: 'local', label: 'Local business' },
        { value: 'affiliate', label: 'Affiliate/Content site' }
      ],
      required: true,
      description: 'Different business models need different lead magnet types'
    },
    {
      id: 'existing_content',
      type: 'checkboxes',
      label: 'Existing Content/Assets',
      options: [
        { value: 'blog', label: 'Blog posts' },
        { value: 'videos', label: 'Video content' },
        { value: 'podcast', label: 'Podcast episodes' },
        { value: 'templates', label: 'Templates/Tools' },
        { value: 'case-studies', label: 'Case studies' },
        { value: 'none', label: 'Starting from scratch' }
      ],
      description: 'Can repurpose existing content into lead magnets'
    },
    {
      id: 'distribution_channels',
      type: 'checkboxes',
      label: 'Where Will You Promote Lead Magnet?',
      options: [
        { value: 'paid-ads', label: 'Paid advertising' },
        { value: 'social-organic', label: 'Organic social media' },
        { value: 'seo', label: 'SEO/Content marketing' },
        { value: 'partnerships', label: 'Partnerships/Affiliates' },
        { value: 'existing-traffic', label: 'Website traffic/Popup' }
      ],
      description: 'Distribution channel affects lead magnet format'
    }
  ],

  ai: {
    template: `Generate lead magnet ideas based on:

Industry: {industry}
Target Audience: {target_audience}
Main Problem: {main_problem}
Business Model: {business_model}
Existing Content: {existing_content}
Distribution Channels: {distribution_channels}

Create a comprehensive lead magnet strategy:

## 1. LEAD MAGNET IDEAS (10 CONCEPTS)

For each idea, include: Format, Title, Core Promise, Estimated Opt-in Rate

**Idea #1: [Format] - "[Title]"**
- **Format:** [Checklist/Template/Guide/Video/Quiz/Tool/etc.]
- **Core Promise:** [Specific outcome in X minutes]
- **Why It Works:** [Psychology behind appeal]
- **Estimated Opt-in Rate:** [X]%
- **Production Effort:** Low/Medium/High
- **Best For:** [Traffic source that converts best]

**Idea #2: [Format] - "[Title]"**
[Same structure]

[Continue for 10 ideas, varied formats]

**Recommended Top 3:**
1. [Idea #] - [Why this is best for your audience]
2. [Idea #] - [Why]
3. [Idea #] - [Why]

## 2. LANDING PAGE TEMPLATES

**Template A: Minimal (Above-the-fold only)**
Perfect for: Paid ads, where traffic is cold

*Headline:*
"[Specific Benefit] in [Timeframe] (Without [Pain Point])"

*Subheadline:*
"[Elaborate on promise + social proof number]"

*Bullet Points:*
• [Specific thing they'll get]
• [Specific thing they'll learn]
• [Specific outcome they'll achieve]

*Form:*
[Email + Name (optional) + CTA button]

*CTA Button Text:*
"Get My Free [Lead Magnet Name]"

*Trust Line:*
"Join [X] others. Unsubscribe anytime."

---

**Template B: Standard (With social proof)**
Perfect for: Organic traffic, warmer audiences

[Hero section from Template A]

*Social Proof:*
"[X] downloads | [Y] star rating"
+ 2-3 testimonial snippets

*What's Inside:*
- Module 1: [Specific benefit]
- Module 2: [Specific benefit]
- Module 3: [Specific benefit]

*About Creator:*
[2 sentences establishing credibility]

*CTA (Repeat):*
[Same as above]

---

**Template C: Long-form (For competitive niches)**
Perfect for: SEO traffic, high-intent searches

[All elements from Template B, plus:]

*Problem Agitation:*
"Are you struggling with [pain 1], [pain 2], and [pain 3]?"

*How It Helps:*
[Explain the transformation in 3-4 sentences]

*FAQ:*
Q: [Common question]
A: [Answer]

[3-5 FAQs]

*Final CTA:*
[Urgency note + CTA button]

## 3. DELIVERY MECHANISMS

**Immediate Delivery (Recommended):**

**Email Delivery:**
- Subject: "Here's your [Lead Magnet Name] 🎉"
- Body: Thank you + download link + next step
- Works for: PDFs, templates, checklists

**Thank-You Page:**
- After opt-in, redirect to page with immediate access
- Embed video or show download button
- Include: Next steps, social share buttons, upsell opportunity

**Autoresponder Series:**
- For multi-part lead magnets (e.g., 5-day challenge)
- Day 1: Part 1 + intro
- Day 2: Part 2 + value content
- [Continue drip delivery]

**Alternative: Gated Content**
- For tools/calculators: Access behind login
- For communities: Invite link in email
- For webinars: Calendar invite + reminder sequence

## 4. NURTURE SEQUENCES (Lead Magnet → Customer)

**Welcome Sequence Structure:**

**Email 1 (Immediate): Deliver + Welcome**
- Subject: "Your [Lead Magnet] is here!"
- Deliver the lead magnet
- Set expectations (what emails to expect)
- Quick win: One actionable tip

**Email 2 (Day 2): Value + Story**
- Subject: "[Curiosity hook related to problem]"
- Share a personal story or case study
- No pitch, pure value
- Goal: Build relationship

**Email 3 (Day 4): Education + Authority**
- Subject: "The [X] mistake most people make with [topic]"
- Demonstrate expertise
- Preview your paid solution (soft mention)

**Email 4 (Day 6): Social Proof**
- Subject: "How [Customer Name] achieved [Result]"
- Case study or testimonial
- Show what's possible
- Link to sales page (low-key)

**Email 5 (Day 8): Soft Pitch**
- Subject: "Ready to [achieve bigger result]?"
- Introduce your paid offer
- Focus on transformation
- CTA to learn more (not buy yet)

**Email 6 (Day 10): Objection Handling**
- Subject: "You might be wondering..."
- Address top objection
- More social proof
- Gentle CTA

**Email 7 (Day 14): Offer + Urgency**
- Subject: "[Time-sensitive opportunity]"
- Direct pitch
- Clear offer, clear CTA
- Bonus for fast action

## 5. UPGRADE PATHS (Lead Magnet → Paid Product)

**Immediate Upsell (Thank You Page):**
"Love this? Get the complete [Product Name] for [X]% off"
- Works best for: Low-ticket offers ($27-$97)
- Conversion rate: 3-8% of lead magnet opt-ins

**Tripwire Offer:**
"Before you go... grab [Mini Product] for just $7"
- Turns leads into buyers immediately
- Makes email list profitable from day 1

**Webinar Funnel:**
"Want to go deeper? Join my free training on [Date]"
- Pitch paid offer at end of webinar
- Works for: Higher-ticket offers ($500+)

**Email Sequence → Sales Page:**
[Use nurture sequence above]

## 6. PROMOTION STRATEGIES

**For Paid Ads:**
- Create landing page (Template A)
- Target: [Specific audience based on {target_audience}]
- Budget: Start with $10-20/day
- Expected CPA: $2-$5 per lead
- Optimize for: Opt-ins, not clicks

**For Organic Social:**
- Tease lead magnet in posts (don't give everything away)
- "DM me [word] for free access"
- Pin to profile
- Share testimonials from lead magnet users

**For SEO/Content:**
- Create blog post around main problem
- Embed opt-in throughout post
- Content upgrade: "Download PDF version"
- Retarget readers with ads

**For Website Traffic:**
- Exit-intent popup: "Wait! Get your free [Lead Magnet]"
- Hello bar at top of site
- Sidebar opt-in form
- Content upgrade in blog posts

**For Partnerships:**
- Offer as bonus for partner promotions
- Guest post with lead magnet CTA
- Podcast interview → Lead magnet offer
- Co-create lead magnet with complementary brand

## 7. DESIGN GUIDELINES

**Visual Style:**
- Professional but not overdesigned
- Match your brand colors
- Use Canva templates (search "[format] template")

**For PDFs/Guides:**
- 5-15 pages (sweet spot: 8 pages)
- Mix of text, images, white space
- Actionable (checklists, worksheets)
- Branded (logo, colors, fonts)

**For Checklists:**
- Checkbox format (feels actionable)
- 10-25 items
- Categorize if >15 items
- PDF or Google Doc

**For Templates:**
- Fill-in-the-blank format
- Include examples
- Editable (Google Sheets/Docs or downloadable)

**For Video:**
- 5-15 minutes
- High value, low production
- Slide deck or screen share
- Upload to YouTube (unlisted) or Vimeo

**For Quizzes:**
- 5-10 questions
- Personalized results
- Email required to see results
- Tools: Typeform, Interact, LeadQuizzes

## 8. A/B TESTING FRAMEWORK

**Test Priority 1: Lead Magnet Title**
- Test: [Two title variations]
- Expected lift: 20-50% opt-in improvement

**Test Priority 2: Landing Page Headline**
- Test: Benefit-focused vs Curiosity-driven
- Expected lift: 10-30%

**Test Priority 3: Form Fields**
- Test: Email only vs Email + Name
- Tradeoff: More fields = lower opt-ins but higher quality

**Test Priority 4: CTA Button**
- Test: Color, text, placement
- Expected lift: 5-15%

## 9. LEAD MAGNET METRICS

**Opt-in Rate Benchmarks:**
- Paid ads: 15-30% (good), 30-60% (excellent)
- Organic traffic: 5-15% (good), 15-30% (excellent)
- Exit popup: 2-5% (good), 5-10% (excellent)

**Lead Quality Metrics:**
- Email open rate: Should be 30%+ (list health indicator)
- Click rate: Should be 3%+ (engagement indicator)
- Unsubscribe rate: <0.5% (quality indicator)

**ROI Metrics:**
- Cost per lead: $[X] (from paid ads)
- Lead-to-customer rate: [Y]% (from nurture sequence)
- Customer LTV: $[Z]
- ROI: [LTV × conversion rate] - [cost per lead]

**Goal:** Break even on lead acquisition within 90 days

Format with specific, ready-to-implement ideas and copy examples.`,

    temperature: 0.8,
    maxTokens: 3000,

    contextProvider: () => {
      try {
        const stored = localStorage.getItem('marketing-app-data')
        if (stored) {
          const data = JSON.parse(stored)
          return {
            app_description: data.appDescription || '',
            company_name: data.companyName || ''
          }
        }
      } catch (e) {
        console.error('Error loading context:', e)
      }
      return {}
    }
  },

  output: {
    enabled: true,
    exportFilename: 'lead-magnet-ideas',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  }
}
