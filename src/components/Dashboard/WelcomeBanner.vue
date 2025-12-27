<template>
  <div v-if="shouldShow" class="mb-6 animate-fade-in">
    <div class="p-5 bg-gradient-to-r from-indigo-900/40 to-purple-900/30 border border-indigo-500/30 rounded-xl">
      <!-- Header with dismiss -->
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <!-- Personalized greeting -->
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span>{{ greeting }}</span>
            <span v-if="productName" class="text-indigo-300">— {{ productName }}</span>
          </h2>

          <!-- What is Launchpilot (first visit) -->
          <p class="mt-2 text-gray-300 text-sm leading-relaxed">
            Your personal marketing co-pilot. Follow the tasks below to get your first users — no marketing experience needed.
          </p>
        </div>

        <!-- Dismiss button -->
        <button
          @click="dismiss"
          class="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition flex-shrink-0"
          title="Dismiss"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Goal card -->
      <div class="mt-4 flex items-center gap-4 bg-black/20 p-4 rounded-lg">
        <span class="text-3xl">{{ goalEmoji }}</span>
        <div class="flex-1">
          <p class="font-semibold text-white">{{ goalHeadline }}</p>
          <p class="text-sm text-gray-400 mt-0.5">{{ timelineMessage }}</p>
        </div>
        <div v-if="targetAudience" class="hidden sm:block text-right">
          <p class="text-xs text-gray-500 uppercase tracking-wide">Target</p>
          <p class="text-sm text-indigo-300 max-w-[200px] truncate">{{ targetAudience }}</p>
        </div>
      </div>

      <!-- Quick tip -->
      <div class="mt-4 flex items-start gap-2 text-sm">
        <span class="text-yellow-400">💡</span>
        <p class="text-gray-400">
          <strong class="text-gray-300">Tip:</strong> Start with the highlighted "Next Task" recommendation — it's picked based on what you've already done.
        </p>
      </div>

      <!-- Don't show again -->
      <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
        <label class="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-gray-400">
          <input
            type="checkbox"
            v-model="dontShowAgain"
            class="rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-500/50"
          />
          Don't show this again
        </label>
        <button
          @click="dismiss"
          class="text-sm text-indigo-400 hover:text-indigo-300 transition"
        >
          Got it, let's go →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'

const STORAGE_KEY = 'launchpilot-welcome-dismissed'

const projectStore = useProjectStore()
const dismissed = ref(false)
const dontShowAgain = ref(false)

// Only show for beginners who haven't dismissed
const shouldShow = computed(() => {
  if (projectStore.experienceLevel === 'intermediate') return false
  if (dismissed.value) return false
  return true
})

// Personalization data
const productName = computed(() => projectStore.currentProjectSettings?.productName || '')
const targetAudience = computed(() => projectStore.currentProjectSettings?.targetAudience || '')
const mainGoal = computed(() => projectStore.currentProjectSettings?.mainGoal || 'first_100')
const timeline = computed(() => projectStore.currentProjectSettings?.timeline || 'no_timeline')

// Time-based greeting
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

// Goal-based messaging
const goalEmoji = computed(() => {
  const emojis = {
    'first_100': '🎯',
    '1k_mrr': '💰',
    '10k_mrr': '🚀',
    'audience': '👥',
    'validate': '✅'
  }
  return emojis[mainGoal.value] || '🎯'
})

const goalHeadline = computed(() => {
  const headlines = {
    'first_100': 'Your goal: Make your first $100',
    '1k_mrr': 'Your goal: Reach $1K MRR',
    '10k_mrr': 'Your goal: Scale to $10K MRR',
    'audience': 'Your goal: Build your audience',
    'validate': 'Your goal: Validate your idea'
  }
  return headlines[mainGoal.value] || "Let's grow your product!"
})

const timelineMessage = computed(() => {
  const messages = {
    '1_month': "You're aiming to hit this in 1 month — let's move fast!",
    '3_months': "3 months is a solid timeline. Consistency is key.",
    '6_months': "6 months gives you room to experiment and iterate.",
    'no_timeline': "No rush — focus on doing things right."
  }
  return messages[timeline.value] || ''
})

const dismiss = () => {
  if (dontShowAgain.value) {
    localStorage.setItem(STORAGE_KEY, 'true')
  }
  dismissed.value = true
}

onMounted(() => {
  dismissed.value = localStorage.getItem(STORAGE_KEY) === 'true'
})
</script>
