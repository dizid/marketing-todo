<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="handleDismiss"
      >
        <div class="bg-gray-900 rounded-xl border border-gray-700 max-w-lg w-full p-6 shadow-2xl animate-scale-in">
          <!-- Header with celebration -->
          <div class="text-center mb-6">
            <div class="text-5xl mb-3">🚀</div>
            <h2 class="text-2xl font-bold text-white mb-2">
              Welcome to Intermediate Mode!
            </h2>
            <p class="text-gray-400">
              You've unlocked {{ unlockedTaskCount }} additional marketing tasks
            </p>
          </div>

          <!-- Newly unlocked tasks by category -->
          <div class="mb-6 max-h-64 overflow-y-auto">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Newly Unlocked Tasks
            </h3>
            <div class="space-y-3">
              <div
                v-for="category in groupedUnlockedTasks"
                :key="category.name"
                class="bg-gray-800/50 rounded-lg p-3"
              >
                <div class="text-sm font-medium text-indigo-400 mb-2">
                  {{ category.name }}
                </div>
                <ul class="space-y-1">
                  <li
                    v-for="task in category.tasks"
                    :key="task.id"
                    class="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <span class="text-green-500">✓</span>
                    {{ task.name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Phase 4 explanation -->
          <div class="bg-indigo-900/30 border border-indigo-700/50 rounded-lg p-4 mb-6">
            <div class="flex items-start gap-3">
              <span class="text-2xl">📊</span>
              <div>
                <h4 class="font-medium text-indigo-300 mb-1">
                  Phase 4: Optimization Unlocked
                </h4>
                <p class="text-sm text-gray-400">
                  You now have access to analytics, A/B testing, and ROI tracking tools.
                  These help you measure what's working and double down on winning strategies.
                </p>
              </div>
            </div>
          </div>

          <!-- Dismiss button -->
          <button
            @click="handleDismiss"
            class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
          >
            Got it, let's go! 🎉
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
/**
 * LevelUpNotification Component
 *
 * Shows a celebration modal when user upgrades from beginner to intermediate.
 * Displays newly unlocked tasks and explains Phase 4.
 */

import { computed } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  unlockedTasks: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['dismiss'])

// Group unlocked tasks by category
const groupedUnlockedTasks = computed(() => {
  const groups = {}

  props.unlockedTasks.forEach(task => {
    const categoryName = task.category || 'Other'
    if (!groups[categoryName]) {
      groups[categoryName] = {
        name: categoryName,
        tasks: []
      }
    }
    groups[categoryName].tasks.push(task)
  })

  return Object.values(groups)
})

const unlockedTaskCount = computed(() => props.unlockedTasks.length)

const handleDismiss = () => {
  emit('dismiss')
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
