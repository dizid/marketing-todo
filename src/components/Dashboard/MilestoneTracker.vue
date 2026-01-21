<template>
  <div class="mb-6">
    <!-- Milestone Progress Card -->
    <div class="card p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-white flex items-center gap-2">
          <span class="text-xl">🏆</span>
          Your Journey to First 10 Customers
        </h3>
        <span class="text-sm text-gray-400">
          {{ milestoneStore.milestoneProgress.achieved }}/{{ milestoneStore.milestoneProgress.total }} milestones
        </span>
      </div>

      <!-- Progress Bar -->
      <div class="h-3 bg-gray-800 rounded-full overflow-hidden mb-4">
        <div
          class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
          :style="{ width: `${milestoneStore.milestoneProgress.percentage}%` }"
        ></div>
      </div>

      <!-- Milestone Icons Row -->
      <div class="flex items-center justify-between">
        <div
          v-for="milestone in milestoneStore.milestonesWithStatus"
          :key="milestone.id"
          class="flex flex-col items-center group cursor-pointer"
          @click="handleMilestoneClick(milestone)"
        >
          <!-- Icon Circle -->
          <div
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all',
              milestone.achieved
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 scale-110'
                : 'bg-gray-800 border-2 border-gray-700 opacity-60 hover:opacity-100'
            ]"
          >
            <span>{{ milestone.icon }}</span>
          </div>

          <!-- Label -->
          <span
            :class="[
              'text-xs mt-2 text-center max-w-[70px] leading-tight',
              milestone.achieved ? 'text-indigo-300 font-medium' : 'text-gray-500'
            ]"
          >
            {{ milestone.name }}
          </span>

          <!-- Achieved checkmark -->
          <div v-if="milestone.achieved" class="mt-1">
            <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Next Milestone CTA -->
      <div v-if="milestoneStore.nextMilestone" class="mt-5 pt-4 border-t border-gray-700/50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ milestoneStore.nextMilestone.icon }}</span>
            <div>
              <p class="text-sm text-gray-400">Next milestone:</p>
              <p class="font-medium text-white">{{ milestoneStore.nextMilestone.name }}</p>
            </div>
          </div>

          <!-- Manual milestone buttons for user-triggered milestones -->
          <div v-if="canManuallyAchieve(milestoneStore.nextMilestone.id)" class="flex gap-2">
            <button
              @click="triggerManualMilestone(milestoneStore.nextMilestone.id)"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition"
            >
              I did it! 🎉
            </button>
          </div>
        </div>
      </div>

      <!-- All milestones completed -->
      <div v-else class="mt-5 pt-4 border-t border-gray-700/50 text-center">
        <p class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
          🏆 All milestones achieved! You're a champion!
        </p>
      </div>
    </div>

    <!-- Celebration Modal -->
    <Teleport to="body">
      <div
        v-if="milestoneStore.showCelebration"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/80 backdrop-blur-sm"
          @click="milestoneStore.dismissCelebration"
        ></div>

        <!-- Modal -->
        <div class="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-bounce-in border border-indigo-500/30">
          <!-- Confetti effect (CSS-based) -->
          <div class="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div class="confetti-container">
              <div v-for="i in 50" :key="i" class="confetti" :style="confettiStyle(i)"></div>
            </div>
          </div>

          <!-- Content -->
          <div class="relative text-center">
            <!-- Big icon -->
            <div class="text-6xl mb-4 animate-pulse">
              {{ milestoneStore.currentCelebration?.icon }}
            </div>

            <!-- Title -->
            <h2 class="text-2xl font-bold text-white mb-2">
              {{ milestoneStore.currentCelebration?.celebrationTitle }}
            </h2>

            <!-- Message -->
            <p class="text-gray-300 mb-6">
              {{ milestoneStore.currentCelebration?.celebrationMessage }}
            </p>

            <!-- Share / Dismiss -->
            <div class="flex flex-col gap-3">
              <button
                @click="shareAchievement"
                class="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition"
              >
                Share this win! 🚀
              </button>
              <button
                @click="milestoneStore.dismissCelebration"
                class="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-xl transition"
              >
                Keep going →
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMilestoneStore } from '@/stores/milestoneStore'

const milestoneStore = useMilestoneStore()

// Load milestones on mount
onMounted(() => {
  milestoneStore.loadMilestones()
})

// Check if milestone can be manually triggered
const canManuallyAchieve = (milestoneId) => {
  return ['first-lead', 'first-customer', 'first-100'].includes(milestoneId)
}

// Trigger manual milestone
const triggerManualMilestone = (milestoneId) => {
  switch (milestoneId) {
    case 'first-lead':
      milestoneStore.logLead()
      break
    case 'first-customer':
      milestoneStore.logFirstCustomer()
      break
    case 'first-100':
      milestoneStore.logFirst100()
      break
  }
}

// Handle clicking on a milestone (show details or trigger)
const handleMilestoneClick = (milestone) => {
  if (!milestone.achieved && canManuallyAchieve(milestone.id)) {
    // Could show a confirmation modal here
  }
}

// Generate random confetti style
const confettiStyle = (i) => {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
  return {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    backgroundColor: colors[i % colors.length]
  }
}

// Share achievement
const shareAchievement = () => {
  const milestone = milestoneStore.currentCelebration
  if (!milestone) return

  const text = `🎉 Just hit a milestone: ${milestone.celebrationTitle}\n\nBuilding in public with @launchpilot_app`

  // Try Web Share API first
  if (navigator.share) {
    navigator.share({
      title: milestone.celebrationTitle,
      text: text
    }).catch(() => {
      // Fallback to Twitter
      openTwitterShare(text)
    })
  } else {
    openTwitterShare(text)
  }
}

const openTwitterShare = (text) => {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'width=600,height=400')
}
</script>

<style scoped>
/* Bounce in animation for modal */
@keyframes bounce-in {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out;
}

/* Confetti animation */
.confetti-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  opacity: 0;
  animation: confetti-fall 3s ease-in-out infinite;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(400px) rotate(720deg);
    opacity: 0;
  }
}

/* Card styling */
.card {
  background: linear-gradient(135deg, rgba(30, 30, 46, 0.9), rgba(20, 20, 35, 0.95));
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 1rem;
}
</style>
