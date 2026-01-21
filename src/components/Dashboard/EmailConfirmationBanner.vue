<template>
  <div v-if="showBanner" class="mb-6 animate-fade-in">
    <div class="p-4 bg-amber-900/30 border border-amber-500/40 rounded-xl">
      <div class="flex items-start gap-3">
        <!-- Icon -->
        <div class="flex-shrink-0 w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-amber-200">Confirm your email to unlock all features</h3>
          <p class="mt-1 text-sm text-amber-300/80">
            Check your inbox for a confirmation link. Once confirmed, you'll have full access to AI generation and saving your work.
          </p>

          <!-- Actions -->
          <div class="mt-3 flex flex-wrap items-center gap-3">
            <button
              @click="resendConfirmation"
              :disabled="isResending || cooldownActive"
              class="px-3 py-1.5 text-sm font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isResending">Sending...</span>
              <span v-else-if="cooldownActive">Resend in {{ cooldownSeconds }}s</span>
              <span v-else>Resend confirmation email</span>
            </button>

            <span v-if="resendSuccess" class="text-sm text-green-400">
              ✓ Email sent! Check your inbox.
            </span>

            <span v-if="resendError" class="text-sm text-red-400">
              {{ resendError }}
            </span>
          </div>
        </div>

        <!-- Dismiss (temporary) -->
        <button
          @click="dismissTemporarily"
          class="flex-shrink-0 p-1 text-amber-400/60 hover:text-amber-300 transition"
          title="Dismiss for now"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/utils/supabase'

const authStore = useAuthStore()

// State
const dismissed = ref(false)
const isResending = ref(false)
const resendSuccess = ref(false)
const resendError = ref('')
const cooldownSeconds = ref(0)
let cooldownInterval = null

// Show banner only if user is not email-confirmed
const showBanner = computed(() => {
  if (dismissed.value) return false

  // Check if user exists and email is not confirmed
  const user = authStore.user
  if (!user) return false

  // Supabase stores email confirmation status in user metadata
  // email_confirmed_at is null if not confirmed
  return !user.email_confirmed_at
})

const cooldownActive = computed(() => cooldownSeconds.value > 0)

// Resend confirmation email
const resendConfirmation = async () => {
  if (isResending.value || cooldownActive.value) return

  isResending.value = true
  resendSuccess.value = false
  resendError.value = ''

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: authStore.user?.email
    })

    if (error) throw error

    resendSuccess.value = true

    // Start cooldown (60 seconds)
    cooldownSeconds.value = 60
    cooldownInterval = setInterval(() => {
      cooldownSeconds.value--
      if (cooldownSeconds.value <= 0) {
        clearInterval(cooldownInterval)
      }
    }, 1000)

    // Clear success message after 5 seconds
    setTimeout(() => {
      resendSuccess.value = false
    }, 5000)

  } catch (err) {
    resendError.value = err.message || 'Failed to send confirmation email'
    setTimeout(() => {
      resendError.value = ''
    }, 5000)
  } finally {
    isResending.value = false
  }
}

// Dismiss temporarily (will show again on page refresh)
const dismissTemporarily = () => {
  dismissed.value = true
}

onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
})
</script>
