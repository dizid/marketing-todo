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
            ⚡ The Future of Sales & Marketing Automation
          </span>
        </div>

        <!-- Hero Title -->
        <h1 class="text-6xl sm:text-7xl font-black leading-tight tracking-tighter">
          <span class="block text-cyberpunk-text">Make Money.</span>
          <span class="block bg-gradient-to-r from-cyberpunk-primary via-cyberpunk-accent to-cyberpunk-highlight bg-clip-text text-transparent">
            Take Action. Win.
          </span>
        </h1>

        <!-- Hero Subtitle -->
        <p class="text-xl sm:text-2xl text-cyberpunk-text-secondary max-w-3xl mx-auto leading-relaxed font-light">
          Your personal AI sales & marketing command center. Turn ideas into revenue. Get motivated. Take action daily.
          Watch your profits grow with AI-powered assistance at every step.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row justify-center gap-6 pt-4">
          <button
            @click="goToAuth('signup')"
            class="group px-10 py-4 bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-accent text-cyberpunk-dark font-black text-lg rounded-none border-2 border-cyberpunk-primary hover:border-cyberpunk-accent hover:shadow-xl hover:shadow-cyberpunk-primary/60 transition duration-300 transform hover:scale-105 uppercase tracking-wider"
          >
            Launch Dashboard →
          </button>
          <button
            @click="scrollToSection('features')"
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
        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-primary/40 p-8 rounded-none hover:border-cyberpunk-primary hover:bg-cyberpunk-surface/80 transition duration-300 cursor-pointer">
          <h3 class="text-lg font-black text-cyberpunk-primary uppercase tracking-wide">Can I upgrade to Pro anytime?</h3>
          <p class="text-cyberpunk-text-secondary mt-3 leading-relaxed">
            Absolutely! Upgrade instantly anytime. You'll get immediate access to 400 generations/month and all Pro features. Billing resets on the 1st of each month.
          </p>
        </div>

        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-accent/40 p-8 rounded-none hover:border-cyberpunk-accent hover:bg-cyberpunk-surface/80 transition duration-300 cursor-pointer">
          <h3 class="text-lg font-black text-cyberpunk-accent uppercase tracking-wide">Do unused generations carry over?</h3>
          <p class="text-cyberpunk-text-secondary mt-3 leading-relaxed">
            No, your monthly AI generation quota resets on the 1st of each month. Use them throughout the month or they reset. Pro tip: Plan your content calendar to maximize your allocations!
          </p>
        </div>

        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-highlight/40 p-8 rounded-none hover:border-cyberpunk-highlight hover:bg-cyberpunk-surface/80 transition duration-300 cursor-pointer">
          <h3 class="text-lg font-black text-cyberpunk-highlight uppercase tracking-wide">What payment methods do you accept?</h3>
          <p class="text-cyberpunk-text-secondary mt-3 leading-relaxed">
            We accept all major credit cards (Visa, Mastercard, AmEx), PayPal, Apple Pay, and Google Pay through Stripe. All payments are encrypted and secure. You can manage your payment method anytime.
          </p>
        </div>

        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-primary/40 p-8 rounded-none hover:border-cyberpunk-primary hover:bg-cyberpunk-surface/80 transition duration-300 cursor-pointer">
          <h3 class="text-lg font-black text-cyberpunk-primary uppercase tracking-wide">Can I cancel Pro subscription?</h3>
          <p class="text-cyberpunk-text-secondary mt-3 leading-relaxed">
            Yes, cancel anytime with zero penalties. No long-term contracts. You'll revert to the Free plan at the end of your billing cycle. Your tasks and history remain accessible.
          </p>
        </div>

        <div class="group bg-cyberpunk-surface border-2 border-cyberpunk-accent/40 p-8 rounded-none hover:border-cyberpunk-accent hover:bg-cyberpunk-surface/80 transition duration-300 cursor-pointer">
          <h3 class="text-lg font-black text-cyberpunk-accent uppercase tracking-wide">Is there a trial for Pro?</h3>
          <p class="text-cyberpunk-text-secondary mt-3 leading-relaxed">
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
            Make Real Money?
          </span>
        </h2>
        <p class="text-xl sm:text-2xl text-cyberpunk-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Stop dreaming. Start doing. Launch your Launchpilot dashboard today and turn your sales & marketing into a revenue-generating machine.
        </p>

        <button
          @click="goToAuth('signup')"
          class="group px-12 py-5 bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-accent text-cyberpunk-dark font-black text-xl rounded-none border-2 border-cyberpunk-primary hover:border-cyberpunk-highlight hover:shadow-2xl hover:shadow-cyberpunk-primary/60 transition duration-300 transform hover:scale-110 uppercase tracking-widest"
        >
          Launch Now →
        </button>

        <p class="text-cyberpunk-text-secondary font-mono text-sm mt-8">
          No credit card • Free forever • Cancel anytime
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t-2 border-cyberpunk-primary/30 text-center">
      <p class="text-cyberpunk-text-secondary font-mono">
        &copy; 2025 Launchpilot. Built for online revenue makers.
      </p>
      <p class="text-cyberpunk-text-secondary/60 text-sm mt-2 font-mono">
        Make money. Take action. Win.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const pricingSection = ref(null)
const featuresSection = ref(null)

const goToAuth = (mode) => {
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
