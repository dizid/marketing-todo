<template>
  <div class="progress-container">
    <div class="progress-content">
      <!-- Animated Icon -->
      <div class="progress-icon">
        <div class="spinner"></div>
        <span class="icon-text">🎨</span>
      </div>

      <!-- Progress Message -->
      <h2 class="progress-title">{{ progress.message || 'Generating your designs...' }}</h2>

      <!-- Progress Bar -->
      <div class="progress-bar-wrapper">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <p class="progress-text">
          Step {{ progress.currentStep }}/{{ progress.totalSteps }}
        </p>
      </div>

      <!-- Loading Skeleton Cards -->
      <div class="skeleton-grid">
        <div v-for="i in 4" :key="i" class="skeleton-card">
          <div class="skeleton-image"></div>
        </div>
      </div>

      <!-- Estimated Time -->
      <p class="estimated-time">
        This usually takes 10-15 seconds...
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress: {
    type: Object,
    default: () => ({
      isGenerating: false,
      currentStep: 0,
      totalSteps: 4,
      message: ''
    })
  }
})

const progressPercentage = computed(() => {
  const percent = Math.round((props.progress.currentStep / props.progress.totalSteps) * 100)
  return Math.min(percent, 95) // Cap at 95% until complete
})
</script>

<style scoped>
.progress-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.progress-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 500px;
  text-align: center;
}

.progress-icon {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.icon-text {
  font-size: 2.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.progress-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.progress-bar-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
}

.skeleton-card {
  aspect-ratio: 1;
}

.skeleton-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #f3f4f6 25%,
    #e5e7eb 50%,
    #f3f4f6 75%
  );
  background-size: 200% 100%;
  border-radius: 0.5rem;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.estimated-time {
  font-size: 0.9rem;
  color: #9ca3af;
  margin: 0;
  font-style: italic;
}
</style>
