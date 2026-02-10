<template>
  <div class="min-h-screen bg-cyberpunk-dark text-cyberpunk-text overflow-x-hidden">
    <!-- Animated Background Grid -->
    <div class="fixed inset-0 -z-20">
      <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyberpunk-primary/30 to-transparent blur-3xl rounded-full"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyberpunk-accent/20 to-transparent blur-3xl rounded-full"></div>
    </div>

    <!-- Navigation -->
    <nav class="relative z-40 bg-cyberpunk-dark/80 backdrop-blur-xl border-b border-cyberpunk-primary/30 sticky top-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-3xl font-black tracking-tighter">
            <span class="bg-gradient-to-r from-cyberpunk-primary via-cyberpunk-accent to-cyberpunk-highlight bg-clip-text text-transparent">
              ⚡ Launchpilot
            </span>
          </span>
        </div>
        <div class="flex items-center gap-4">
          <button
            @click="goToAuth('login')"
            class="px-4 py-2 text-cyberpunk-text-secondary hover:text-cyberpunk-primary transition duration-300 font-semibold"
          >
            Sign In
          </button>
          <button
            @click="goToAuth('signup')"
            class="px-6 py-2 bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-accent text-cyberpunk-dark font-bold rounded-none hover:shadow-lg hover:shadow-cyberpunk-primary/50 transition duration-300 border-2 border-cyberpunk-primary"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
      <div class="space-y-8 animate-fade-in-up">
        <!-- Neon Badge -->
        <div class="inline-block">
          <span class="px-4 py-2 border-2 border-cyberpunk-primary text-cyberpunk-primary font-mono text-sm font-bold bg-cyberpunk-primary/10 rounded-none">
            ⚡ AI Marketing for Solo Founders
          </span>
        </div>

        <!-- Hero Title -->
        <h1 class="text-6xl sm:text-7xl font-black leading-tight tracking-tighter">
          <span class="block text-cyberpunk-text">Get Your First</span>
          <span class="block bg-gradient-to-r from-cyberpunk-primary via-cyberpunk-accent to-cyberpunk-highlight bg-clip-text text-transparent">
            10 Customers.
          </span>
        </h1>

        <!-- Hero Subtitle -->
        <p class="text-xl sm:text-2xl text-cyberpunk-text-secondary max-w-3xl mx-auto leading-relaxed font-light">
          Your AI marketing command center. 35+ mini-apps generate social posts, email sequences, landing pages, and more — so you focus on selling, not writing.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row justify-center gap-6 pt-4">
          <button
            @click="goToAuth('signup')"
            class="group px-10 py-4 bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-accent text-cyberpunk-dark font-black text-lg rounded-none border-2 border-cyberpunk-primary hover:border-cyberpunk-accent hover:shadow-xl hover:shadow-cyberpunk-primary/60 transition duration-300 transform hover:scale-105 uppercase tracking-wider"
          >
            Start Free →
          </button>
          <button
            @click="() => { trackCtaClick('explore_features', 'hero'); scrollToSection('features') }"
            class="px-10 py-4 border-2 border-cyberpunk-accent text-cyberpunk-accent font-black text-lg rounded-none hover:bg-cyberpunk-accent hover:text-cyberpunk-dark transition duration-300 uppercase tracking-wider"
          >
            Explore Features
          </button>
        </div>

        <!-- Trust Badges -->
        <p class="text-cyberpunk-text-secondary font-mono text-sm pt-4">
          ✓ Free Forever Plan • ✓ 40 AI Generations/Month • ✓ No Credit Card
        </p>
      </div>
    </section>

    <!-- Lead Capture / Waitlist Section -->
    <section class="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div class="bg-cyberpunk-surface border-2 border-cyberpunk-primary/40 p-8 sm:p-12">
        <h2 class="text-2xl sm:text-3xl font-black mb-4 tracking-tight">
          <span class="bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-accent bg-clip-text text-transparent">
            Get Early Access
          </span>
        </h2>
        <p class="text-cyberpunk-text-secondary mb-8 max-w-lg mx-auto">
          Join founders already using AI to land their first customers. Free forever plan included.
        </p>

        <!-- Success State -->
        <div v-if="leadCaptureSuccess" class="py-8">
          <div class="text-5xl mb-4">🚀</div>
          <h3 class="text-xl font-black text-cyberpunk-primary mb-2">You're on the list!</h3>
          <p class="text-cyberpunk-text-secondary">We'll notify you when new features drop.</p>
        </div>

        <!-- Form -->
        <form
          v-else
          name="waitlist"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          @submit.prevent="handleLeadCapture"
          class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
        >
          <input type="hidden" name="form-name" value="waitlist" />
          <p class="hidden">
            <label>Don't fill this out: <input name="bot-field" /></label>
          </p>

          <input
            v-model="leadEmail"
            type="email"
            name="email"
            placeholder="founder@example.com"
            required
            :disabled="leadCaptureLoading"
            class="flex-1 px-4 py-3 bg-cyberpunk-dark border-2 border-cyberpunk-primary/40 text-cyberpunk-text placeholder-cyberpunk-text-secondary/50 font-mono focus:border-cyberpunk-primary focus:outline-none"
            aria-label="Email address for waitlist"
          />
          <button
            type="submit"
            :disabled="leadCaptureLoading"
            class="px-8 py-3 bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-accent text-cyberpunk-dark font-black uppercase tracking-wider border-2 border-cyberpunk-primary hover:shadow-lg hover:shadow-cyberpunk-primary/50 transition duration-300 disabled:opacity-50"
          >
            {{ leadCaptureLoading ? 'Joining...' : 'Join Waitlist' }}
          </button>
        </form>

        <p v-if="leadCaptureError" class="text-cyberpunk-accent mt-4 text-sm font-mono">
          {{ leadCaptureError }}
        </p>
      </div>
    </section>

    <!-- Features Section -->
    <section ref="featuresSection" class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t-2 border-cyberpunk-primary/30">
      <h2 class="text-5xl font-black text-center mb-4 tracking-tighter">
        <span class="bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-highlight bg-clip-text text-transparent">
          Supercharged Features
        </span>
      </h2>
      <p class="text-center text-cyberpunk-text-secondary text-lg mb-16 max-w-2xl mx-auto">
        Everything you need to dominate online sales & marketing
      </p>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Feature 1: AI Motivation Engine -->
        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-primary/40 p-8 rounded-none hover:border-cyberpunk-primary hover:shadow-2xl hover:shadow-cyberpunk-primary/30 transition duration-300 transform hover:-translate-y-2">
          <div class="text-5xl mb-4 group-hover:animate-pulse">🔥</div>
          <h3 class="text-xl font-black text-cyberpunk-primary mb-3 uppercase tracking-wide">AI Motivation Engine</h3>
          <p class="text-cyberpunk-text-secondary leading-relaxed">
            Get daily motivation, accountability check-ins, and action prompts. AI pushes you to do the work that drives revenue.
          </p>
        </div>

        <!-- Feature 2: Task-Driven Revenue -->
        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-accent/40 p-8 rounded-none hover:border-cyberpunk-accent hover:shadow-2xl hover:shadow-cyberpunk-accent/30 transition duration-300 transform hover:-translate-y-2">
          <div class="text-5xl mb-4 group-hover:animate-pulse">💰</div>
          <h3 class="text-xl font-black text-cyberpunk-accent mb-3 uppercase tracking-wide">Task-to-Revenue</h3>
          <p class="text-cyberpunk-text-secondary leading-relaxed">
            Every task connects to money. Social posts → followers → customers. Guided workflows that directly impact your bottom line.
          </p>
        </div>

        <!-- Feature 3: AI Content Assistant -->
        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-highlight/40 p-8 rounded-none hover:border-cyberpunk-highlight hover:shadow-2xl hover:shadow-cyberpunk-highlight/30 transition duration-300 transform hover:-translate-y-2">
          <div class="text-5xl mb-4 group-hover:animate-pulse">✨</div>
          <h3 class="text-xl font-black text-cyberpunk-highlight mb-3 uppercase tracking-wide">AI Content Generator</h3>
          <p class="text-cyberpunk-text-secondary leading-relaxed">
            Generate social posts, email sequences, landing pages. Let AI handle creation so you focus on selling.
          </p>
        </div>

        <!-- Feature 4: Smart Task Management -->
        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-primary/40 p-8 rounded-none hover:border-cyberpunk-primary hover:shadow-2xl hover:shadow-cyberpunk-primary/30 transition duration-300 transform hover:-translate-y-2">
          <div class="text-5xl mb-4 group-hover:animate-pulse">📊</div>
          <h3 class="text-xl font-black text-cyberpunk-primary mb-3 uppercase tracking-wide">Action Tracking</h3>
          <p class="text-cyberpunk-text-secondary leading-relaxed">
            Never miss a revenue-generating task. Checklists, templates, deadlines. Do the work. Track progress. Get paid.
          </p>
        </div>

        <!-- Feature 5: Quick Win Templates -->
        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-accent/40 p-8 rounded-none hover:border-cyberpunk-accent hover:shadow-2xl hover:shadow-cyberpunk-accent/30 transition duration-300 transform hover:-translate-y-2">
          <div class="text-5xl mb-4 group-hover:animate-pulse">⚡</div>
          <h3 class="text-xl font-black text-cyberpunk-accent mb-3 uppercase tracking-wide">Quick-Win Strategies</h3>
          <p class="text-cyberpunk-text-secondary leading-relaxed">
            Proven frameworks for social selling, email marketing, landing pages. Get to action in minutes, not days.
          </p>
        </div>

        <!-- Feature 6: Progress Visualization -->
        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-highlight/40 p-8 rounded-none hover:border-cyberpunk-highlight hover:shadow-2xl hover:shadow-cyberpunk-highlight/30 transition duration-300 transform hover:-translate-y-2">
          <div class="text-5xl mb-4 group-hover:animate-pulse">📈</div>
          <h3 class="text-xl font-black text-cyberpunk-highlight mb-3 uppercase tracking-wide">Revenue Insights</h3>
          <p class="text-cyberpunk-text-secondary leading-relaxed">
            See which tasks make you money. Analytics dashboard shows ROI on every action. Double down on winners.
          </p>
        </div>
      </div>
    </section>

    <!-- Social Proof Section -->
    <section class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t-2 border-cyberpunk-primary/30">
      <h2 class="text-5xl font-black text-center mb-4 tracking-tighter">
        <span class="bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-highlight bg-clip-text text-transparent">
          Built for Founders Like You
        </span>
      </h2>
      <p class="text-center text-cyberpunk-text-secondary text-lg mb-16 max-w-2xl mx-auto">
        Solo founders shipping products and landing customers
      </p>

      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div class="bg-cyberpunk-surface border-2 border-cyberpunk-primary/40 p-8">
          <p class="text-cyberpunk-text leading-relaxed mb-6 italic">
            "I went from zero marketing to a full content calendar in one afternoon. The AI generates posts that actually sound like me."
          </p>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-accent flex items-center justify-center font-black text-cyberpunk-dark">
              JK
            </div>
            <div>
              <p class="font-bold text-cyberpunk-text text-sm">Jake K.</p>
              <p class="text-cyberpunk-text-secondary text-xs">SaaS Founder</p>
            </div>
          </div>
        </div>

        <div class="bg-cyberpunk-surface border-2 border-cyberpunk-accent/40 p-8">
          <p class="text-cyberpunk-text leading-relaxed mb-6 italic">
            "The milestone tracker kept me accountable. Went from idea to first paying customer in 3 weeks using the playbook."
          </p>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-r from-cyberpunk-accent to-cyberpunk-highlight flex items-center justify-center font-black text-cyberpunk-dark">
              SM
            </div>
            <div>
              <p class="font-bold text-cyberpunk-text text-sm">Sarah M.</p>
              <p class="text-cyberpunk-text-secondary text-xs">E-commerce Founder</p>
            </div>
          </div>
        </div>

        <div class="bg-cyberpunk-surface border-2 border-cyberpunk-highlight/40 p-8">
          <p class="text-cyberpunk-text leading-relaxed mb-6 italic">
            "Best part: I don't need 5 different marketing tools anymore. LaunchPilot handles content, email sequences, and landing pages in one place."
          </p>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-r from-cyberpunk-highlight to-cyberpunk-primary flex items-center justify-center font-black text-cyberpunk-dark">
              AP
            </div>
            <div>
              <p class="font-bold text-cyberpunk-text text-sm">Alex P.</p>
              <p class="text-cyberpunk-text-secondary text-xs">Indie Developer</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section ref="pricingSection" class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t-2 border-cyberpunk-primary/30">
      <h2 class="text-5xl font-black text-center mb-4 tracking-tighter">
        <span class="bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-highlight bg-clip-text text-transparent">
          Pricing That Scales With You
        </span>
      </h2>
      <p class="text-center text-cyberpunk-text-secondary text-lg mb-16 max-w-2xl mx-auto">
        Start free. Upgrade when you're making money.
      </p>

      <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <!-- Free Plan -->
        <div class="bg-cyberpunk-surface border-2 border-cyberpunk-text-secondary/50 p-10 rounded-none hover:border-cyberpunk-primary transition duration-300">
          <div class="mb-6">
            <h3 class="text-3xl font-black text-cyberpunk-text uppercase tracking-wide">Starter</h3>
            <p class="text-cyberpunk-text-secondary mt-2">Perfect for beginners</p>
          </div>

          <div class="mb-8">
            <p class="text-5xl font-black text-cyberpunk-text">
              $0<span class="text-xl text-cyberpunk-text-secondary">/month</span>
            </p>
          </div>

          <div class="mb-10 border-t-2 border-cyberpunk-primary/30 pt-8">
            <ul class="space-y-4 font-semibold">
              <li class="flex items-center gap-3 text-cyberpunk-text">
                <span class="text-cyberpunk-primary text-lg">⚡</span>
                40 AI Generations/Month
              </li>
              <li class="flex items-center gap-3 text-cyberpunk-text">
                <span class="text-cyberpunk-primary text-lg">⚡</span>
                AI Motivation Engine
              </li>
              <li class="flex items-center gap-3 text-cyberpunk-text">
                <span class="text-cyberpunk-primary text-lg">⚡</span>
                Task Checklists & Templates
              </li>
              <li class="flex items-center gap-3 text-cyberpunk-text">
                <span class="text-cyberpunk-primary text-lg">⚡</span>
                Content Generation Basics
              </li>
              <li class="flex items-center gap-3 text-cyberpunk-text/50">
                <span class="text-cyberpunk-text-secondary text-lg">✗</span>
                Advanced Analytics
              </li>
              <li class="flex items-center gap-3 text-cyberpunk-text/50">
                <span class="text-cyberpunk-text-secondary text-lg">✗</span>
                Priority Support
              </li>
            </ul>
          </div>

          <button
            @click="goToAuth('signup')"
            class="w-full px-6 py-3 border-2 border-cyberpunk-primary text-cyberpunk-primary font-black uppercase tracking-wider rounded-none hover:bg-cyberpunk-primary hover:text-cyberpunk-dark transition duration-300"
          >
            Start Free
          </button>
        </div>

        <!-- Premium Plan -->
        <div class="bg-gradient-to-br from-cyberpunk-primary/20 to-cyberpunk-accent/10 border-2 border-cyberpunk-primary p-10 rounded-none relative overflow-hidden hover:shadow-2xl hover:shadow-cyberpunk-primary/40 transition duration-300">
          <div class="absolute -top-20 -right-20 w-64 h-64 bg-cyberpunk-primary/30 blur-3xl rounded-full"></div>

          <div class="relative z-10">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-3xl font-black text-cyberpunk-primary uppercase tracking-wide">Pro</h3>
              <span class="px-3 py-1 bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-accent text-cyberpunk-dark text-xs font-black rounded-none uppercase tracking-wider">
                Most Popular
              </span>
            </div>
            <p class="text-cyberpunk-primary font-semibold mb-8">For serious revenue makers</p>

            <div class="mb-8">
              <p class="text-5xl font-black text-cyberpunk-primary">
                $19<span class="text-xl text-cyberpunk-text-secondary">/month</span>
              </p>
            </div>

            <div class="mb-10 border-t-2 border-cyberpunk-primary/30 pt-8">
              <ul class="space-y-4 font-semibold">
                <li class="flex items-center gap-3 text-cyberpunk-text">
                  <span class="text-cyberpunk-accent text-lg">✨</span>
                  400 AI Generations/Month
                </li>
                <li class="flex items-center gap-3 text-cyberpunk-text">
                  <span class="text-cyberpunk-accent text-lg">✨</span>
                  Advanced AI Motivation
                </li>
                <li class="flex items-center gap-3 text-cyberpunk-text">
                  <span class="text-cyberpunk-accent text-lg">✨</span>
                  Priority Template Library
                </li>
                <li class="flex items-center gap-3 text-cyberpunk-text">
                  <span class="text-cyberpunk-accent text-lg">✨</span>
                  Revenue Analytics Dashboard
                </li>
                <li class="flex items-center gap-3 text-cyberpunk-text">
                  <span class="text-cyberpunk-accent text-lg">✨</span>
                  24/7 Priority Support
                </li>
                <li class="flex items-center gap-3 text-cyberpunk-text">
                  <span class="text-cyberpunk-accent text-lg">✨</span>
                  Early Access to New Features
                </li>
              </ul>
            </div>

            <button
              @click="goToAuth('signup')"
              class="w-full px-6 py-3 bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-accent text-cyberpunk-dark font-black uppercase tracking-wider rounded-none hover:shadow-xl hover:shadow-cyberpunk-primary/60 transition duration-300 transform hover:scale-105 text-lg"
            >
              Launch Pro →
            </button>

            <p class="text-center text-cyberpunk-text-secondary text-sm mt-4 font-mono">Cancel anytime • No hidden fees</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t-2 border-cyberpunk-primary/30">
      <h2 class="text-5xl font-black text-center mb-4 tracking-tighter">
        <span class="bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-highlight bg-clip-text text-transparent">
          Questions? We've Got Answers
        </span>
      </h2>
      <p class="text-center text-cyberpunk-text-secondary text-lg mb-16">
        Everything you need to know to get started and dominate
      </p>

      <div class="space-y-4">
        <!-- Product Questions -->
        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-primary/40 p-8 rounded-none hover:border-cyberpunk-primary hover:bg-cyberpunk-surface/80 transition duration-300 cursor-pointer" @click="toggleFaq(0)">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-black text-cyberpunk-primary uppercase tracking-wide">What marketing tasks can I do with LaunchPilot?</h3>
            <span class="text-cyberpunk-text-secondary text-xl transition-transform duration-300" :class="{ 'rotate-180': faqOpen[0] }">&#9660;</span>
          </div>
          <p v-show="faqOpen[0]" class="text-cyberpunk-text-secondary mt-3 leading-relaxed">
            LaunchPilot has 35+ AI-powered mini-apps covering everything: social media posts, email sequences, landing pages, blog posts, competitor analysis, sales funnels, ad copy, and more. Each task guides you step-by-step with AI generating the content.
          </p>
        </div>

        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-accent/40 p-8 rounded-none hover:border-cyberpunk-accent hover:bg-cyberpunk-surface/80 transition duration-300 cursor-pointer" @click="toggleFaq(1)">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-black text-cyberpunk-accent uppercase tracking-wide">How does the AI content generation work?</h3>
            <span class="text-cyberpunk-text-secondary text-xl transition-transform duration-300" :class="{ 'rotate-180': faqOpen[1] }">&#9660;</span>
          </div>
          <p v-show="faqOpen[1]" class="text-cyberpunk-text-secondary mt-3 leading-relaxed">
            You fill in a few details about your product and audience, and our AI generates ready-to-use marketing content in seconds. Edit, copy, and publish. It works for social posts, emails, landing page copy, blog drafts, and more.
          </p>
        </div>

        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-highlight/40 p-8 rounded-none hover:border-cyberpunk-highlight hover:bg-cyberpunk-surface/80 transition duration-300 cursor-pointer" @click="toggleFaq(2)">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-black text-cyberpunk-highlight uppercase tracking-wide">Is my data secure?</h3>
            <span class="text-cyberpunk-text-secondary text-xl transition-transform duration-300" :class="{ 'rotate-180': faqOpen[2] }">&#9660;</span>
          </div>
          <p v-show="faqOpen[2]" class="text-cyberpunk-text-secondary mt-3 leading-relaxed">
            Yes. We use Supabase for authentication and data storage with row-level security. Your data is encrypted in transit and at rest. We never share your content or business information with third parties.
          </p>
        </div>

        <!-- Pricing & Billing Questions -->
        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-primary/40 p-8 rounded-none hover:border-cyberpunk-primary hover:bg-cyberpunk-surface/80 transition duration-300 cursor-pointer" @click="toggleFaq(3)">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-black text-cyberpunk-primary uppercase tracking-wide">Can I upgrade to Pro anytime?</h3>
            <span class="text-cyberpunk-text-secondary text-xl transition-transform duration-300" :class="{ 'rotate-180': faqOpen[3] }">&#9660;</span>
          </div>
          <p v-show="faqOpen[3]" class="text-cyberpunk-text-secondary mt-3 leading-relaxed">
            Absolutely! Upgrade instantly anytime. You'll get immediate access to 400 generations/month and all Pro features. Billing resets on the 1st of each month.
          </p>
        </div>

        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-accent/40 p-8 rounded-none hover:border-cyberpunk-accent hover:bg-cyberpunk-surface/80 transition duration-300 cursor-pointer" @click="toggleFaq(4)">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-black text-cyberpunk-accent uppercase tracking-wide">Do unused generations carry over?</h3>
            <span class="text-cyberpunk-text-secondary text-xl transition-transform duration-300" :class="{ 'rotate-180': faqOpen[4] }">&#9660;</span>
          </div>
          <p v-show="faqOpen[4]" class="text-cyberpunk-text-secondary mt-3 leading-relaxed">
            No, your monthly AI generation quota resets on the 1st of each month. Use them throughout the month or they reset. Pro tip: Plan your content calendar to maximize your allocations!
          </p>
        </div>

        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-highlight/40 p-8 rounded-none hover:border-cyberpunk-highlight hover:bg-cyberpunk-surface/80 transition duration-300 cursor-pointer" @click="toggleFaq(5)">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-black text-cyberpunk-highlight uppercase tracking-wide">What payment methods do you accept?</h3>
            <span class="text-cyberpunk-text-secondary text-xl transition-transform duration-300" :class="{ 'rotate-180': faqOpen[5] }">&#9660;</span>
          </div>
          <p v-show="faqOpen[5]" class="text-cyberpunk-text-secondary mt-3 leading-relaxed">
            We accept all major credit cards (Visa, Mastercard, AmEx), PayPal, Apple Pay, and Google Pay through Stripe. All payments are encrypted and secure.
          </p>
        </div>

        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-primary/40 p-8 rounded-none hover:border-cyberpunk-primary hover:bg-cyberpunk-surface/80 transition duration-300 cursor-pointer" @click="toggleFaq(6)">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-black text-cyberpunk-primary uppercase tracking-wide">Can I cancel my Pro subscription?</h3>
            <span class="text-cyberpunk-text-secondary text-xl transition-transform duration-300" :class="{ 'rotate-180': faqOpen[6] }">&#9660;</span>
          </div>
          <p v-show="faqOpen[6]" class="text-cyberpunk-text-secondary mt-3 leading-relaxed">
            Yes, cancel anytime with zero penalties. No long-term contracts. You'll revert to the Free plan at the end of your billing cycle. Your tasks and history remain accessible.
          </p>
        </div>

        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-accent/40 p-8 rounded-none hover:border-cyberpunk-accent hover:bg-cyberpunk-surface/80 transition duration-300 cursor-pointer" @click="toggleFaq(7)">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-black text-cyberpunk-accent uppercase tracking-wide">Is there a trial for Pro?</h3>
            <span class="text-cyberpunk-text-secondary text-xl transition-transform duration-300" :class="{ 'rotate-180': faqOpen[7] }">&#9660;</span>
          </div>
          <p v-show="faqOpen[7]" class="text-cyberpunk-text-secondary mt-3 leading-relaxed">
            Your Free plan IS the trial! 40 AI generations/month + all core features. Try everything risk-free. When you're ready to scale, upgrade to Pro.
          </p>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t-2 border-cyberpunk-primary/30 text-center">
      <div class="relative z-10">
        <h2 class="text-6xl sm:text-7xl font-black mb-6 tracking-tighter">
          <span class="block text-cyberpunk-text mb-3">Ready to</span>
          <span class="bg-gradient-to-r from-cyberpunk-primary via-cyberpunk-accent to-cyberpunk-highlight bg-clip-text text-transparent">
            Start Building?
          </span>
        </h2>
        <p class="text-xl sm:text-2xl text-cyberpunk-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Join founders using AI to build their marketing engine. Start with 40 free AI generations — no credit card required.
        </p>

        <button
          @click="goToAuth('signup')"
          class="group px-12 py-5 bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-accent text-cyberpunk-dark font-black text-xl rounded-none border-2 border-cyberpunk-primary hover:border-cyberpunk-highlight hover:shadow-2xl hover:shadow-cyberpunk-primary/60 transition duration-300 transform hover:scale-110 uppercase tracking-widest"
        >
          Start Free →
        </button>

        <p class="text-cyberpunk-text-secondary font-mono text-sm mt-8">
          No credit card • Free forever • Cancel anytime
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t-2 border-cyberpunk-primary/30 text-center">
      <p class="text-cyberpunk-text-secondary font-mono">
        &copy; 2026 LaunchPilot. Built for founders who ship.
      </p>
      <p class="text-cyberpunk-text-secondary/60 text-sm mt-2 font-mono">
        <a href="https://x.com/launchpilot_app" target="_blank" rel="noopener noreferrer" class="hover:text-cyberpunk-primary transition">@launchpilot_app</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useHead } from '@unhead/vue'
import { trackLeadCapture, trackCtaClick } from '@/utils/analytics'

// SEO meta tags, Open Graph, Twitter Card, and JSON-LD structured data
useHead({
  title: 'LaunchPilot - AI Marketing Command Center for Founders',
  meta: [
    { name: 'description', content: 'Get your first 10 customers with AI-powered marketing. 35+ mini-apps for content, email, landing pages & more. Free forever plan.' },
    { name: 'keywords', content: 'AI marketing tools, solo founder marketing, get first customers, marketing automation, startup marketing, AI content generation' },
    { property: 'og:title', content: 'LaunchPilot - AI Marketing Command Center for Founders' },
    { property: 'og:description', content: 'Get your first 10 customers with AI-powered marketing. 35+ mini-apps, guided tasks, and AI copy generation.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://launchpilot.marketing' },
    { property: 'og:image', content: 'https://launchpilot.marketing/original-rocket-logo.png' },
    { property: 'og:site_name', content: 'LaunchPilot' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@launchpilot_app' },
    { name: 'twitter:title', content: 'LaunchPilot - AI Marketing Command Center for Founders' },
    { name: 'twitter:description', content: 'Get your first 10 customers with AI-powered marketing. Free forever plan.' },
    { name: 'twitter:image', content: 'https://launchpilot.marketing/original-rocket-logo.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://launchpilot.marketing' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'LaunchPilot',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: 'https://launchpilot.marketing',
        description: 'AI-powered marketing command center that helps founders get their first 10 customers with guided tasks, AI copy generation, and landing page publishing.',
        offers: [
          {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            name: 'Starter',
            description: '40 AI Generations/Month, AI Motivation Engine, Task Checklists'
          },
          {
            '@type': 'Offer',
            price: '19',
            priceCurrency: 'USD',
            name: 'Pro',
            description: '400 AI Generations/Month, Advanced Analytics, Priority Support'
          }
        ],
        creator: {
          '@type': 'Organization',
          name: 'LaunchPilot',
          url: 'https://launchpilot.marketing'
        }
      })
    }
  ]
})

const router = useRouter()
const pricingSection = ref(null)
const featuresSection = ref(null)

// FAQ toggle state
const faqOpen = ref({})
const toggleFaq = (index) => {
  faqOpen.value[index] = !faqOpen.value[index]
}

// Lead capture form state
const leadEmail = ref('')
const leadCaptureSuccess = ref(false)
const leadCaptureLoading = ref(false)
const leadCaptureError = ref('')

const handleLeadCapture = async () => {
  leadCaptureError.value = ''
  leadCaptureLoading.value = true

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(leadEmail.value)) {
    leadCaptureError.value = 'Please enter a valid email address.'
    leadCaptureLoading.value = false
    return
  }

  try {
    const formData = new URLSearchParams()
    formData.append('form-name', 'waitlist')
    formData.append('email', leadEmail.value)

    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    })

    trackLeadCapture('landing_waitlist')
    leadCaptureSuccess.value = true
  } catch (err) {
    leadCaptureError.value = 'Something went wrong. Please try again.'
    console.error('Lead capture error:', err)
  } finally {
    leadCaptureLoading.value = false
  }
}

const goToAuth = (mode) => {
  trackCtaClick(`${mode}_button`, 'navigation')
  // Redirect signup to onboarding wizard, login to auth page
  if (mode === 'signup') {
    router.push('/welcome')
  } else {
    router.push(`/auth?mode=${mode}`)
  }
}

const scrollToSection = (sectionId) => {
  if (sectionId === 'pricing' && pricingSection.value) {
    pricingSection.value.scrollIntoView({ behavior: 'smooth' })
  } else if (sectionId === 'features' && featuresSection.value) {
    featuresSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Cyberpunk Color Palette - CSS Variables */
:root {
  /* Primary neon cyan */
  --cyberpunk-primary: #00d9ff;
  /* Secondary neon magenta */
  --cyberpunk-accent: #ff006e;
  /* Highlight neon yellow */
  --cyberpunk-highlight: #ffbe0b;
  /* Dark background */
  --cyberpunk-dark: #0a0e27;
  /* Surface secondary */
  --cyberpunk-surface: #151932;
  /* Text primary */
  --cyberpunk-text: #f0f3f5;
  /* Text secondary */
  --cyberpunk-text-secondary: #a8b5c6;
}

/* Apply cyberpunk colors */
.bg-cyberpunk-dark {
  background-color: var(--cyberpunk-dark);
}

.bg-cyberpunk-surface {
  background-color: var(--cyberpunk-surface);
}

.text-cyberpunk-text {
  color: var(--cyberpunk-text);
}

.text-cyberpunk-text-secondary {
  color: var(--cyberpunk-text-secondary);
}

.text-cyberpunk-primary {
  color: var(--cyberpunk-primary);
}

.text-cyberpunk-accent {
  color: var(--cyberpunk-accent);
}

.text-cyberpunk-highlight {
  color: var(--cyberpunk-highlight);
}

.border-cyberpunk-primary {
  border-color: var(--cyberpunk-primary);
}

.border-cyberpunk-accent {
  border-color: var(--cyberpunk-accent);
}

.border-cyberpunk-highlight {
  border-color: var(--cyberpunk-highlight);
}

.border-cyberpunk-text-secondary {
  border-color: var(--cyberpunk-text-secondary);
}

.bg-gradient-to-r.from-cyberpunk-primary {
  background-image: linear-gradient(
    to right,
    var(--cyberpunk-primary),
    var(--cyberpunk-accent),
    var(--cyberpunk-highlight)
  );
}

/* Grid pattern background */
.bg-grid-pattern {
  background-image:
    linear-gradient(var(--cyberpunk-primary) 1px, transparent 1px),
    linear-gradient(90deg, var(--cyberpunk-primary) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out both;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Smooth transitions */
button,
a {
  transition: all 0.3s ease;
}
</style>
