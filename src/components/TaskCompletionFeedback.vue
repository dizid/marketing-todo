<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="handleSkip"
      >
        <div class="bg-gray-900 rounded-xl border border-gray-700 max-w-md w-full p-6 shadow-2xl animate-scale-in">
          <!-- Header -->
          <div class="text-center mb-6">
            <h2 class="text-xl font-bold text-white mb-2">
              How useful was this output?
            </h2>
            <p class="text-sm text-gray-400">
              Your feedback helps us improve
            </p>
          </div>

          <!-- Rating -->
          <div class="flex justify-center gap-2 mb-6">
            <button
              v-for="(emoji, index) in ratingEmojis"
              :key="index"
              @click="rating = index + 1"
              :class="[
                'text-3xl p-2 rounded-lg transition-all',
                rating === index + 1
                  ? 'bg-indigo-600/30 scale-110'
                  : 'hover:bg-gray-800 hover:scale-105'
              ]"
            >
              {{ emoji }}
            </button>
          </div>

          <!-- Feedback text (optional) -->
          <div class="mb-4">
            <label class="block text-sm text-gray-400 mb-2">
              Tell us more (optional)
            </label>
            <textarea
              v-model="feedbackText"
              rows="3"
              placeholder="What did you like? What could be better?"
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none resize-none"
            ></textarea>
          </div>

          <!-- Testimonial consent -->
          <div class="mb-6">
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="canUseAsTestimonial"
                class="mt-1 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="text-sm text-gray-400">
                I'm happy for Launchpilot to use this as a testimonial
                <span class="text-gray-500">(we'll ask before publishing)</span>
              </span>
            </label>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              @click="handleSkip"
              class="flex-1 py-2.5 px-4 text-gray-400 hover:text-white transition-colors"
            >
              Skip
            </button>
            <button
              @click="handleSubmit"
              :disabled="!rating || isSubmitting"
              :class="[
                'flex-1 py-2.5 px-4 font-medium rounded-lg transition-colors',
                rating
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              ]"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit Feedback' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
/**
 * TaskCompletionFeedback Component
 *
 * Collects user feedback after task completion.
 * Stores ratings and optional testimonials.
 */

import { ref } from 'vue'
import { submitFeedback } from '@/services/feedbackService'
import { useProjectStore } from '@/stores/projectStore'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  taskId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'submitted'])

const projectStore = useProjectStore()
const authStore = useAuthStore()

const ratingEmojis = ['😞', '😐', '🙂', '😊', '🤩']

const rating = ref(null)
const feedbackText = ref('')
const canUseAsTestimonial = ref(false)
const isSubmitting = ref(false)

const handleSkip = () => {
  resetForm()
  emit('close')
}

const handleSubmit = async () => {
  if (!rating.value) return

  isSubmitting.value = true

  try {
    const user = authStore.user

    if (user) {
      await submitFeedback({
        userId: user.id,
        projectId: projectStore.currentProject?.id || null,
        taskId: props.taskId,
        rating: rating.value,
        feedbackText: feedbackText.value || null,
        canUseAsTestimonial: canUseAsTestimonial.value
      })
    }

    emit('submitted', {
      rating: rating.value,
      feedbackText: feedbackText.value,
      canUseAsTestimonial: canUseAsTestimonial.value
    })
  } catch (error) {
    console.error('Failed to submit feedback:', error)
    // Still close and emit - feedback is not critical
    emit('submitted', null)
  } finally {
    isSubmitting.value = false
    resetForm()
    emit('close')
  }
}

const resetForm = () => {
  rating.value = null
  feedbackText.value = ''
  canUseAsTestimonial.value = false
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
