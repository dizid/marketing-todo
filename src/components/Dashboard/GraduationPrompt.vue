<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="handleStayBeginner"
      >
        <div class="bg-gray-900 rounded-xl border border-gray-700 max-w-lg w-full p-6 shadow-2xl animate-scale-in">
          <!-- Celebration header -->
          <div class="text-center mb-6">
            <div class="text-5xl mb-3">🎓</div>
            <h2 class="text-2xl font-bold text-white mb-2">
              You've Mastered the Fundamentals!
            </h2>
            <p class="text-gray-400">
              All {{ completedCount }} beginner tasks completed
            </p>
          </div>

          <!-- Completed tasks summary -->
          <div class="mb-6 bg-gray-800/50 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              What You've Accomplished
            </h3>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="task in completedTasks"
                :key="task.id"
                class="flex items-center gap-2 text-sm"
              >
                <span class="text-green-500">✓</span>
                <span class="text-gray-300 truncate">{{ task.name }}</span>
              </div>
            </div>
          </div>

          <!-- What's next section -->
          <div class="bg-indigo-900/30 border border-indigo-700/50 rounded-lg p-4 mb-6">
            <div class="flex items-start gap-3">
              <span class="text-2xl">🚀</span>
              <div>
                <h4 class="font-medium text-indigo-300 mb-1">
                  Ready for the Next Level?
                </h4>
                <p class="text-sm text-gray-400">
                  Intermediate mode unlocks analytics, A/B testing, paid ads optimization,
                  and advanced sales tools. Take your marketing to the next level.
                </p>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex gap-3">
            <button
              @click="handleStayBeginner"
              class="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Stay on Beginner
            </button>
            <button
              @click="handleUpgrade"
              class="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
            >
              Upgrade to Intermediate 🚀
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
/**
 * GraduationPrompt Component
 *
 * Shows when user completes all beginner tasks.
 * Prompts them to upgrade to intermediate mode.
 */

import { computed } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  completedTasks: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['stay-beginner', 'upgrade'])

const completedCount = computed(() => props.completedTasks.length)

const handleStayBeginner = () => {
  emit('stay-beginner')
}

const handleUpgrade = () => {
  emit('upgrade')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
