<template>
  <div class="context-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <h2 class="dashboard-title">Business Context Dashboard</h2>
      <p class="dashboard-subtitle">Your unified business profile - used to improve all AI-generated content</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <p>Loading your business context...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p class="error-message">Error loading context: {{ error }}</p>
      <button @click="loadContext" class="retry-btn">Retry</button>
    </div>

    <!-- Main Content -->
    <div v-else class="dashboard-content">
      <!-- Overall Score Card -->
      <div class="score-card">
        <div class="score-display">
          <div class="score-number">{{ completionScore }}</div>
          <div class="score-label">Overall Completion</div>
        </div>
        <div class="score-bar">
          <div class="score-fill" :style="{ width: completionScore + '%' }"></div>
        </div>
        <p class="score-help">
          {{ getCompletionMessage(completionScore) }}
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="quick-stats">
        <div class="stat-item">
          <div class="stat-label">Tiers Complete</div>
          <div class="stat-value">{{ getTiersComplete() }}/7</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Content Generated</div>
          <div class="stat-value">{{ contentCount }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Avg Content Rating</div>
          <div class="stat-value">{{ averageRating }}/5.0</div>
        </div>
      </div>

      <!-- Tiers Grid -->
      <div class="tiers-section">
        <h3 class="section-title">Business Context Tiers</h3>
        <div class="tiers-grid">
          <div
            v-for="(tier, tierName) in tierData"
            :key="tierName"
            class="tier-card"
            :class="{ [getTierStatus(tier.score)]: true }"
          >
            <div class="tier-header">
              <h4 class="tier-name">{{ tier.label }}</h4>
              <span class="tier-number">{{ tierIndex(tierName) + 1 }}</span>
            </div>

            <div class="tier-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: tier.score + '%' }"></div>
              </div>
              <span class="progress-text">{{ tier.score }}%</span>
            </div>

            <p class="tier-description">{{ tier.description }}</p>

            <div class="tier-estimate">
              <span class="estimate-label">Time to complete:</span>
              <span class="estimate-time">{{ tier.estimatedTime }}</span>
            </div>

            <button class="tier-action-btn" @click="selectTier(tierName)">
              {{ tier.score === 100 ? 'View' : 'Complete' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div v-if="recommendations.length > 0" class="recommendations-section">
        <h3 class="section-title">Recommendations</h3>
        <div class="recommendations-list">
          <div
            v-for="(rec, idx) in recommendations"
            :key="idx"
            class="recommendation-item"
            :class="{ [rec.priority]: true }"
          >
            <div class="rec-priority">{{ rec.priority }}</div>
            <div class="rec-content">
              <p class="rec-text">{{ rec.action }}</p>
            </div>
            <button v-if="rec.tier" @click="selectTier(rec.tier)" class="rec-action">Start</button>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="dashboard-actions">
        <button @click="exportProfile" class="action-btn export-btn">
          Export Profile
        </button>
        <button @click="viewHistory" class="action-btn history-btn">
          View History
        </button>
        <button @click="refresh" class="action-btn refresh-btn">
          Refresh
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBusinessContext } from '@/composables/useBusinessContext'
import { validateContext, getTierDescription, getCompletionEstimate, getSuggestions } from '@/services/contextValidation'
import { getTaskRatingStats } from '@/services/feedbackCollector'

// Composables
const { context, loading, error, getContext, getCompletionScore, getTierScores } = useBusinessContext()

// State
const completionScore = ref(0)
const tierScores = ref({})
const contentCount = ref(0)
const averageRating = ref(0)
const recommendations = ref([])

// Computed
const tierData = computed(() => {
  const tiers = [
    {
      key: 'tier1_business',
      label: 'Business & Product',
      description: 'Company info, product details, fundamentals',
      estimatedTime: '5-10 minutes'
    },
    {
      key: 'tier2_market',
      label: 'Market & Audience',
      description: 'Positioning, competitors, target audience',
      estimatedTime: '10-15 minutes'
    },
    {
      key: 'tier3_brand',
      label: 'Brand Identity',
      description: 'Voice, messaging, keywords, visual style',
      estimatedTime: '8-12 minutes'
    },
    {
      key: 'tier4_goals',
      label: 'Goals & Metrics',
      description: 'Business strategy, success metrics, KPIs',
      estimatedTime: '5-8 minutes'
    },
    {
      key: 'tier5_marketing',
      label: 'Marketing Channels',
      description: 'Email, social, campaigns, analytics',
      estimatedTime: '5-10 minutes'
    },
    {
      key: 'tier6_content',
      label: 'Content Library',
      description: 'Generated content, assets, templates',
      estimatedTime: 'Builds over time'
    },
    {
      key: 'tier7_integrations',
      label: 'Integrations',
      description: 'Connected accounts, APIs, services',
      estimatedTime: '5-15 minutes'
    }
  ]

  return tiers.map((tier) => ({
    ...tier,
    score: tierScores.value[tier.key.replace('tier', 'tier')] || 0
  }))
})

// Methods
const loadContext = async () => {
  try {
    await getContext()

    if (context.value) {
      // Calculate metrics
      completionScore.value = getCompletionScore()
      tierScores.value = getTierScores()

      // Count content
      contentCount.value = context.value.tier6_content?.generatedContent?.length || 0

      // Calculate average rating
      if (contentCount.value > 0) {
        const ratings = context.value.tier6_content.generatedContent
          .filter((c) => c.userRating)
          .map((c) => c.userRating)
        averageRating.value =
          ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0
      }

      // Get recommendations
      const validation = validateContext(context.value)
      recommendations.value = getSuggestions(validation).slice(0, 5)
    }
  } catch (err) {
    console.error('Error loading context:', err)
  }
}

const selectTier = (tierName) => {
  // Emit event to parent to navigate to Define Business task
  emit('select-tier', tierName)
}

const exportProfile = () => {
  if (!context.value) return

  const dataStr = JSON.stringify(context.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `business-profile-${new Date().toISOString().split('T')[0]}.json`
  link.click()
}

const viewHistory = () => {
  const history = context.value?.metadata?.enrichmentHistory || []
  console.log('Context enrichment history:', history)
  // Could show modal with detailed history
}

const refresh = async () => {
  await loadContext()
}

const getTiersComplete = () => {
  return Object.values(tierScores.value).filter((score) => score >= 70).length
}

const getTierStatus = (score) => {
  if (score >= 70) return 'complete'
  if (score >= 30) return 'in-progress'
  return 'not-started'
}

const getCompletionMessage = (score) => {
  if (score >= 80) {
    return 'Excellent! Your business context is comprehensive. Your AI content should be highly personalized.'
  } else if (score >= 60) {
    return 'Good progress! Complete a few more tiers to unlock better AI content quality.'
  } else if (score >= 30) {
    return 'Getting started! Complete your most critical business details first.'
  } else {
    return 'Start by defining your business basics in Tier 1.'
  }
}

const tierIndex = (tierName) => {
  return parseInt(tierName.replace('tier', ''))
}

// Emits
const emit = defineEmits(['select-tier'])

// Lifecycle
onMounted(() => {
  loadContext()
})
</script>

<style scoped>
.context-dashboard {
  width: 100%;
  padding: 2rem;
  background: linear-gradient(135deg, #f0f4f8 0%, #f8fafc 100%);
  min-height: 100vh;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.dashboard-subtitle {
  color: #64748b;
  margin: 0;
  font-size: 0.95rem;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;
}

.error-message {
  color: #dc2626;
  margin-bottom: 1rem;
}

.retry-btn {
  padding: 0.5rem 1.5rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Score Card */
.score-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.score-display {
  text-align: center;
  margin-bottom: 1.5rem;
}

.score-number {
  font-size: 3rem;
  font-weight: 700;
  color: #4f46e5;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.score-label {
  color: #64748b;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.score-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d9ff 0%, #4f46e5 100%);
  transition: width 0.3s ease;
}

.score-help {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

.stat-label {
  color: #64748b;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
}

/* Tiers Section */
.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
}

.tiers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.tier-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  position: relative;
}

.tier-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.tier-card.complete {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #f3fdf8 100%);
}

.tier-card.in-progress {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbf0 0%, #fef9f3 100%);
}

.tier-card.not-started {
  border-color: #cbd5e1;
}

.tier-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.tier-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.tier-number {
  width: 32px;
  height: 32px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #4f46e5;
  font-size: 0.9rem;
}

.tier-progress {
  margin-bottom: 1rem;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d9ff 0%, #4f46e5 100%);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4f46e5;
}

.tier-description {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.tier-estimate {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

.estimate-label {
  font-weight: 500;
}

.estimate-time {
  font-style: italic;
}

.tier-action-btn {
  width: 100%;
  padding: 0.75rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.tier-action-btn:hover {
  background: #4338ca;
}

.tier-card.complete .tier-action-btn {
  background: #10b981;
}

.tier-card.complete .tier-action-btn:hover {
  background: #059669;
}

/* Recommendations */
.recommendations-section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recommendation-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-left: 4px solid #cbd5e1;
  border-radius: 4px;
}

.recommendation-item.high {
  border-left-color: #dc2626;
  background: #fef2f2;
}

.recommendation-item.medium {
  border-left-color: #f59e0b;
  background: #fffbf0;
}

.recommendation-item.low {
  border-left-color: #10b981;
  background: #f0fdf4;
}

.rec-priority {
  padding: 0.25rem 0.75rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #64748b;
}

.rec-content {
  flex: 1;
}

.rec-text {
  margin: 0;
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.4;
}

.rec-action {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  color: #4f46e5;
  transition: all 0.2s ease;
}

.rec-action:hover {
  background: #f8fafc;
  border-color: #4f46e5;
}

/* Actions */
.dashboard-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #cbd5e1;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.export-btn {
  color: #10b981;
  border-color: #10b981;
}

.export-btn:hover {
  background: #f0fdf4;
}

.history-btn {
  color: #f59e0b;
  border-color: #f59e0b;
}

.history-btn:hover {
  background: #fffbf0;
}

.refresh-btn {
  color: #4f46e5;
  border-color: #4f46e5;
}

.refresh-btn:hover {
  background: #eef2ff;
}

/* Responsive */
@media (max-width: 768px) {
  .context-dashboard {
    padding: 1rem;
  }

  .dashboard-title {
    font-size: 1.5rem;
  }

  .score-number {
    font-size: 2.5rem;
  }

  .tiers-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
