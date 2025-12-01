<template>
  <div class="next-task-card animate-fade-in">
    <div class="card-header">
      <div class="card-header-left">
        <div class="icon">🎯</div>
        <h3>Next Step in Your Journey</h3>
      </div>
      <button @click="closeCard" class="close-btn" title="Dismiss">✕</button>
    </div>

    <div v-if="recommendation && recommendation.nextTask" class="card-content">
      <!-- Task Name -->
      <div class="task-section">
        <h2 class="task-name">{{ recommendation.nextTask.name }}</h2>
        <p class="task-phase">Phase {{ recommendation.nextTask.phase }} of 4</p>
      </div>

      <!-- Reasoning -->
      <div v-if="reasoning" class="reasoning-section">
        <p class="reasoning-text">{{ reasoning }}</p>
      </div>

      <!-- Progress Bar -->
      <div v-if="recommendation.phaseProgress" class="progress-section">
        <div class="progress-label">
          <span class="label">Phase Progress</span>
          <span class="percentage">{{ recommendation.phaseProgress.percentage }}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: recommendation.phaseProgress.percentage + '%' }"></div>
        </div>
        <div class="progress-text">
          {{ recommendation.phaseProgress.completed }} of {{ recommendation.phaseProgress.total }} tasks
        </div>
      </div>

      <!-- Overall Progress -->
      <div v-if="recommendation.overallProgress" class="overall-progress">
        <span class="progress-label">Overall Progress</span>
        <span class="progress-value">{{ recommendation.overallProgress.completed }}/{{ recommendation.overallProgress.total }} tasks</span>
      </div>

      <!-- Action Buttons -->
      <div class="button-group">
        <button @click="startTask" class="btn btn-primary">
          <span class="btn-icon">▶</span>
          Start Task
        </button>
        <button @click="showAlternatives" class="btn btn-secondary">
          <span class="btn-icon">≡</span>
          Other Options
        </button>
        <button @click="showRoadmap" class="btn btn-secondary">
          <span class="btn-icon">📍</span>
          View Roadmap
        </button>
      </div>
    </div>

    <div v-else-if="recommendation && recommendation.isComplete" class="complete-message">
      <div class="icon-large">🎉</div>
      <h3>Journey Complete!</h3>
      <p>{{ recommendation.message }}</p>
      <button @click="viewAllTasks" class="btn btn-primary">
        View All Tasks
      </button>
    </div>

    <div v-else class="loading">
      <p>Getting your next task...</p>
    </div>

    <!-- Alternatives Dropdown -->
    <div v-if="showAlternativesDropdown && recommendation.alternatives" class="alternatives-section">
      <h4>Other Options in This Phase</h4>
      <div class="alternatives-list">
        <button
          v-for="alt in recommendation.alternatives"
          :key="alt.id"
          @click="selectAlternative(alt.id)"
          class="alternative-item"
        >
          <span class="alt-name">{{ alt.name }}</span>
          <span class="alt-arrow">→</span>
        </button>
      </div>
      <button @click="showAlternativesDropdown = false" class="btn btn-secondary btn-small">
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  recommendation: {
    type: Object,
    required: false,
    default: null
  },
  onStartTask: {
    type: Function,
    required: false,
    default: () => {}
  },
  onViewRoadmap: {
    type: Function,
    required: false,
    default: () => {}
  },
  onSelectAlternative: {
    type: Function,
    required: false,
    default: () => {}
  }
})

const emit = defineEmits(['start-task', 'view-roadmap', 'select-alternative', 'close'])

const showAlternativesDropdown = ref(false)

// Hardcoded reasoning logic (simplified for v1)
const reasoningMap = {
  'growth-5': {
    default: "Let's start by defining your market position and messaging strategy.",
    'discovery-to-conversion': "You've defined your positioning. Now let's capture leads with a compelling lead magnet."
  },
  'growth-1': {
    default: "Create lead magnets that attract your ideal customers.",
    'conversion-complete': "You've converted traffic to customers. Now let's execute your content strategy."
  },
  'growth-2': {
    default: "Plan A/B tests to find what messaging resonates best.",
    'execution-start': "You've created content. Let's test different approaches to optimize results."
  }
}

const reasoning = computed(() => {
  if (!props.recommendation || !props.recommendation.nextTask) return ''

  const taskId = props.recommendation.nextTask.id
  const phase = props.recommendation.nextTask.phase
  const currentPhase = props.recommendation.currentPhase

  // Try to get specific reasoning based on context
  if (reasoningMap[taskId]) {
    const taskReasons = reasoningMap[taskId]
    if (taskReasons[`phase-${phase}`]) {
      return taskReasons[`phase-${phase}`]
    }
  }

  // Fallback generic reasoning
  const phaseNames = {
    1: 'Discovery',
    2: 'Conversion',
    3: 'Execution',
    4: 'Optimization'
  }

  const phaseName = phaseNames[phase] || 'Next'
  return `Let's move to the ${phaseName} phase to grow your business.`
})

const startTask = () => {
  emit('start-task', props.recommendation.nextTask)
  if (props.onStartTask) {
    props.onStartTask(props.recommendation.nextTask)
  }
}

const showRoadmap = () => {
  emit('view-roadmap')
  if (props.onViewRoadmap) {
    props.onViewRoadmap()
  }
}

const showAlternatives = () => {
  showAlternativesDropdown.value = !showAlternativesDropdown.value
}

const selectAlternative = (altId) => {
  emit('select-alternative', altId)
  if (props.onSelectAlternative) {
    props.onSelectAlternative(altId)
  }
  showAlternativesDropdown.value = false
}

const viewAllTasks = () => {
  emit('view-roadmap')
  if (props.onViewRoadmap) {
    props.onViewRoadmap()
  }
}

const closeCard = () => {
  emit('close')
}
</script>

<style scoped>
.next-task-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.icon {
  font-size: 28px;
  line-height: 1;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  opacity: 0.95;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 20px;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-section {
  margin-bottom: 8px;
}

.task-name {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.task-phase {
  font-size: 13px;
  margin: 0;
  opacity: 0.85;
}

.reasoning-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  border-left: 3px solid rgba(255, 255, 255, 0.3);
}

.reasoning-text {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.progress-section {
  margin-top: 8px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 6px;
}

.label {
  font-weight: 500;
}

.percentage {
  opacity: 0.9;
}

.progress-bar-container {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
  margin-bottom: 6px;
}

.progress-bar {
  background: rgba(255, 255, 255, 0.9);
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  opacity: 0.85;
}

.overall-progress {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 8px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.progress-value {
  font-weight: 600;
}

.button-group {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.btn-primary {
  background: white;
  color: #667eea;
  flex-grow: 1;
  justify-content: center;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.btn-small {
  padding: 8px 12px;
  font-size: 12px;
}

.btn-icon {
  display: inline-block;
  font-size: 16px;
}

.alternatives-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  margin-top: 16px;
}

.alternatives-section h4 {
  font-size: 13px;
  font-weight: 500;
  margin: 0 0 12px 0;
  opacity: 0.9;
}

.alternatives-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.alternative-item {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.alternative-item:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
}

.alt-name {
  flex-grow: 1;
}

.alt-arrow {
  opacity: 0.7;
}

.complete-message {
  text-align: center;
  padding: 20px 0;
}

.icon-large {
  font-size: 48px;
  margin-bottom: 12px;
}

.complete-message h3 {
  font-size: 20px;
  margin: 0 0 8px 0;
}

.complete-message p {
  font-size: 14px;
  margin: 0 0 16px 0;
  opacity: 0.9;
}

.loading {
  text-align: center;
  padding: 24px 0;
  opacity: 0.9;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>
