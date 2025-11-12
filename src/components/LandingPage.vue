<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
    <!-- Navigation -->
    <nav class="bg-gray-900 bg-opacity-90 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            🚀 TaskMaster
          </span>
        </div>
        <div class="flex items-center gap-4">
          <button
            @click="goToAuth('login')"
            class="px-4 py-2 text-gray-300 hover:text-white transition"
          >
            Sign In
          </button>
          <button
            @click="goToAuth('signup')"
            class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 blur-3xl"></div>

      <h1 class="text-5xl sm:text-6xl font-bold text-white mb-6">
        AI-Powered Task <br />
        <span class="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
          Management
        </span>
      </h1>

      <p class="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
        Create better content faster with AI assistance. From social media posts to graphics, TaskMaster helps your
        marketing team work smarter.
      </p>

      <div class="flex justify-center gap-4">
        <button
          @click="goToAuth('signup')"
          class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-lg rounded-lg hover:from-indigo-700 hover:to-blue-700 transition transform hover:scale-105"
        >
          Start Free Today
        </button>
        <button
          @click="scrollToSection('pricing')"
          class="px-8 py-4 border-2 border-gray-500 text-white font-bold text-lg rounded-lg hover:border-gray-400 transition"
        >
          View Pricing
        </button>
      </div>

      <p class="mt-6 text-gray-400">✓ No credit card required • ✓ 20 free AI generations</p>
    </section>

    <!-- Features Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-700">
      <h2 class="text-4xl font-bold text-white text-center mb-12">Powerful Features</h2>

      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-8 hover:border-indigo-500 transition">
          <div class="text-4xl mb-4">✨</div>
          <h3 class="text-xl font-bold text-white mb-3">AI Generation</h3>
          <p class="text-gray-400">Generate social posts, captions, graphics, and more with advanced AI.</p>
        </div>

        <div class="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-8 hover:border-indigo-500 transition">
          <div class="text-4xl mb-4">📊</div>
          <h3 class="text-xl font-bold text-white mb-3">Task Management</h3>
          <p class="text-gray-400">Organize your workflow with checklists, templates, and progress tracking.</p>
        </div>

        <div class="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-8 hover:border-indigo-500 transition">
          <div class="text-4xl mb-4">🚀</div>
          <h3 class="text-xl font-bold text-white mb-3">Quota System</h3>
          <p class="text-gray-400">Scale from 20 free generations/month to 200 with Premium.</p>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section ref="pricingSection" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-700">
      <h2 class="text-4xl font-bold text-white text-center mb-12">Simple Pricing</h2>

      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <!-- Free Plan -->
        <div class="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-8">
          <h3 class="text-2xl font-bold text-white mb-2">Free</h3>
          <p class="text-gray-400 mb-6">Perfect for getting started</p>
          <p class="text-4xl font-bold text-white mb-6">
            $0
            <span class="text-lg text-gray-400">/month</span>
          </p>

          <div class="mb-8 border-t border-gray-700 pt-8">
            <ul class="space-y-4">
              <li class="flex items-center gap-3 text-gray-300">
                <span class="text-green-400">✓</span>
                20 AI generations/month
              </li>
              <li class="flex items-center gap-3 text-gray-300">
                <span class="text-green-400">✓</span>
                Basic task management
              </li>
              <li class="flex items-center gap-3 text-gray-300">
                <span class="text-green-400">✓</span>
                All core features
              </li>
              <li class="flex items-center gap-3 text-gray-400">
                <span class="text-gray-600">✗</span>
                Priority support
              </li>
              <li class="flex items-center gap-3 text-gray-400">
                <span class="text-gray-600">✗</span>
                Early access to new features
              </li>
            </ul>
          </div>

          <button
            @click="goToAuth('signup')"
            class="w-full px-6 py-3 border-2 border-indigo-600 text-indigo-400 font-semibold rounded-lg hover:bg-indigo-600 hover:text-white transition"
          >
            Get Started Free
          </button>
        </div>

        <!-- Premium Plan -->
        <div class="bg-gradient-to-br from-indigo-900 to-blue-900 border-2 border-indigo-500 rounded-lg p-8 relative overflow-hidden">
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-indigo-400 rounded-full opacity-20 blur-3xl"></div>

          <div class="relative z-10">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-2xl font-bold text-white">Premium</h3>
              <span class="px-3 py-1 bg-indigo-500 text-white text-sm font-bold rounded-full">
                POPULAR
              </span>
            </div>
            <p class="text-indigo-200 mb-6">Best for growing teams</p>
            <p class="text-5xl font-bold text-white mb-6">
              $19
              <span class="text-lg text-indigo-200">/month</span>
            </p>

            <div class="mb-8 border-t border-indigo-700 pt-8">
              <ul class="space-y-4">
                <li class="flex items-center gap-3 text-white font-semibold">
                  <span class="text-green-300">✓</span>
                  200 AI generations/month
                </li>
                <li class="flex items-center gap-3 text-white font-semibold">
                  <span class="text-green-300">✓</span>
                  Advanced features
                </li>
                <li class="flex items-center gap-3 text-white font-semibold">
                  <span class="text-green-300">✓</span>
                  All free features
                </li>
                <li class="flex items-center gap-3 text-white font-semibold">
                  <span class="text-green-300">✓</span>
                  Priority support
                </li>
                <li class="flex items-center gap-3 text-white font-semibold">
                  <span class="text-green-300">✓</span>
                  Early access to new features
                </li>
              </ul>
            </div>

            <button
              @click="goToAuth('signup')"
              class="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-blue-600 transition transform hover:scale-105"
            >
              Start Premium
            </button>

            <p class="text-center text-indigo-200 text-sm mt-4">Cancel anytime • No hidden fees</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison Table -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-700">
      <h2 class="text-4xl font-bold text-white text-center mb-12">Feature Comparison</h2>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="text-left py-4 px-4 text-gray-300 font-semibold">Feature</th>
              <th class="text-center py-4 px-4 text-white font-semibold">Free</th>
              <th class="text-center py-4 px-4 text-white font-semibold">Premium</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-700">
              <td class="py-4 px-4 text-gray-300">AI Generations/Month</td>
              <td class="text-center py-4 px-4 text-gray-300">20</td>
              <td class="text-center py-4 px-4 font-bold text-indigo-400">200</td>
            </tr>
            <tr class="border-b border-gray-700">
              <td class="py-4 px-4 text-gray-300">AI Features</td>
              <td class="text-center py-4 px-4">✓</td>
              <td class="text-center py-4 px-4">✓</td>
            </tr>
            <tr class="border-b border-gray-700">
              <td class="py-4 px-4 text-gray-300">Task Management</td>
              <td class="text-center py-4 px-4">✓</td>
              <td class="text-center py-4 px-4">✓</td>
            </tr>
            <tr class="border-b border-gray-700">
              <td class="py-4 px-4 text-gray-300">Email Support</td>
              <td class="text-center py-4 px-4 text-gray-600">✗</td>
              <td class="text-center py-4 px-4 text-green-400">✓</td>
            </tr>
            <tr>
              <td class="py-4 px-4 text-gray-300">Early Access Features</td>
              <td class="text-center py-4 px-4 text-gray-600">✗</td>
              <td class="text-center py-4 px-4 text-green-400">✓</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-700">
      <h2 class="text-4xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>

      <div class="space-y-6">
        <div class="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6">
          <h3 class="text-lg font-bold text-white mb-3">Can I cancel anytime?</h3>
          <p class="text-gray-400">
            Yes! There are no long-term contracts. You can cancel your Premium subscription anytime from your account
            settings.
          </p>
        </div>

        <div class="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6">
          <h3 class="text-lg font-bold text-white mb-3">Do unused generations carry over?</h3>
          <p class="text-gray-400">
            No, your monthly quota resets on the 1st of each month. We recommend using your generations throughout the
            month.
          </p>
        </div>

        <div class="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6">
          <h3 class="text-lg font-bold text-white mb-3">What payment methods do you accept?</h3>
          <p class="text-gray-400">
            We accept all major credit cards and PayPal for secure, encrypted payments.
          </p>
        </div>

        <div class="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6">
          <h3 class="text-lg font-bold text-white mb-3">Is there a free trial for Premium?</h3>
          <p class="text-gray-400">
            Our Free plan gives you 20 AI generations per month to try the platform risk-free.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-700 text-center">
      <h2 class="text-4xl font-bold text-white mb-6">Ready to get started?</h2>
      <p class="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
        Join thousands of marketing teams using TaskMaster to create better content faster.
      </p>

      <button
        @click="goToAuth('signup')"
        class="px-10 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-lg rounded-lg hover:from-indigo-700 hover:to-blue-700 transition transform hover:scale-105"
      >
        Start Free Today →
      </button>
    </section>

    <!-- Footer -->
    <footer class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-700 text-center text-gray-500">
      <p>&copy; 2025 TaskMaster. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const pricingSection = ref(null)

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
  }
}
</script>

<style scoped>
/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}
</style>
