<template>
  <div class="ab-test-results-dashboard">
    <div v-if="!selectedTest" class="no-test-selected">
      <div class="empty-state">
        <div class="icon">📊</div>
        <h3>No A/B Test Selected</h3>
        <p>Select an A/B test from your active tests to view detailed results</p>
      </div>
    </div>

    <div v-else class="test-results">
      <!-- Header -->
      <div class="results-header">
        <div class="header-left">
          <h2>{{ selectedTest.name }}</h2>
          <p class="test-description">{{ selectedTest.description }}</p>
          <div class="test-meta">
            <span class="badge" :class="statusClass">{{ selectedTest.status }}</span>
            <span class="duration">{{ daysRunning }} days running</span>
            <span class="total-visitors">{{ selectedTest.traffic.totalVisitors.toLocaleString() }} visitors</span>
          </div>
        </div>
        <div class="header-right">
          <button
            v-if="selectedTest.status === 'running'"
            @click="pauseTest"
            class="btn-secondary"
          >
            Pause Test
          </button>
          <button
            v-if="selectedTest.status === 'paused'"
            @click="resumeTest"
            class="btn-secondary"
          >
            Resume Test
          </button>
          <button
            v-if="selectedTest.results.statisticallySignificant && selectedTest.status !== 'winner_selected'"
            @click="applyWinner"
            class="btn-primary"
          >
            Apply Winner
          </button>
        </div>
      </div>

      <!-- Statistical Significance Alert -->
      <div v-if="selectedTest.results.statisticallySignificant" class="significance-alert alert-success">
        <span class="icon">✓</span>
        <div class="content">
          <strong>Statistically Significant Winner Found!</strong>
          <p>{{ selectedTest.results.winner === 'control' ? 'Control' : getVariantName(selectedTest.results.winner) }}
          wins with {{ (selectedTest.results.winnerConfidence * 100).toFixed(1) }}% conversion rate
          (p = {{ selectedTest.results.pValue }})</p>
        </div>
      </div>

      <div v-else-if="selectedTest.traffic.totalVisitors < selectedTest.minSampleSize" class="significance-alert alert-info">
        <span class="icon">ℹ</span>
        <div class="content">
          <strong>Not Enough Data Yet</strong>
          <p>Need {{ selectedTest.minSampleSize - selectedTest.traffic.totalVisitors }} more visitors
          for statistical significance (currently {{ selectedTest.traffic.totalVisitors }}/{{ selectedTest.minSampleSize }})</p>
        </div>
      </div>

      <div v-else class="significance-alert alert-warning">
        <span class="icon">!</span>
        <div class="content">
          <strong>Test Still Running</strong>
          <p>With current results (p = {{ selectedTest.results.pValue }}), we don't have a clear winner yet.
          Continue running to gather more data.</p>
        </div>
      </div>

      <!-- Performance Comparison -->
      <div class="performance-comparison">
        <h3>Performance Metrics</h3>

        <div class="variants-comparison">
          <!-- Control -->
          <div class="variant-card control">
            <div class="variant-header">
              <h4>{{ selectedTest.control.name }} (Control)</h4>
              <span v-if="selectedTest.results.winner === 'control'" class="winner-badge">🏆 Winner</span>
            </div>

            <div class="variant-stats">
              <div class="stat">
                <span class="label">Visitors</span>
                <span class="value">{{ selectedTest.control.visitors.toLocaleString() }}</span>
              </div>
              <div class="stat">
                <span class="label">Conversions</span>
                <span class="value">{{ selectedTest.control.conversions }}</span>
              </div>
              <div class="stat">
                <span class="label">Conversion Rate</span>
                <span class="value">{{ selectedTest.control.conversionRate }}%</span>
              </div>
            </div>

            <div class="confidence-interval">
              <div class="label">95% Confidence Interval</div>
              <div class="range">{{ controlCI.lower }}% - {{ controlCI.upper }}%</div>
            </div>

            <div class="progress-bar">
              <div
                class="fill"
                :style="{ width: selectedTest.control.conversionRate + '%' }"
              ></div>
            </div>
          </div>

          <!-- Variants -->
          <div
            v-for="(variant, idx) in selectedTest.variants"
            :key="variant.id"
            class="variant-card"
            :class="{ winner: selectedTest.results.winner === variant.id, paused: variant.status === 'paused' }"
          >
            <div class="variant-header">
              <h4>{{ variant.name }} (Variant {{ idx + 1 }})</h4>
              <span v-if="selectedTest.results.winner === variant.id" class="winner-badge">🏆 Winner</span>
              <span v-if="variant.status === 'paused'" class="paused-badge">⏸ Paused</span>
            </div>

            <div class="variant-stats">
              <div class="stat">
                <span class="label">Visitors</span>
                <span class="value">{{ variant.visitors.toLocaleString() }}</span>
              </div>
              <div class="stat">
                <span class="label">Conversions</span>
                <span class="value">{{ variant.conversions }}</span>
              </div>
              <div class="stat">
                <span class="label">Conversion Rate</span>
                <span class="value">{{ variant.conversionRate }}%</span>
              </div>
            </div>

            <!-- Performance Difference -->
            <div class="performance-delta">
              <span class="label">vs Control</span>
              <span class="delta" :class="variant.conversionRate >= selectedTest.control.conversionRate ? 'positive' : 'negative'">
                {{ variant.conversionRate >= selectedTest.control.conversionRate ? '+' : '' }}{{ (variant.conversionRate - selectedTest.control.conversionRate).toFixed(2) }}%
              </span>
            </div>

            <div class="confidence-interval">
              <div class="label">95% Confidence Interval</div>
              <div class="range">{{ getVariantCI(variant).lower }}% - {{ getVariantCI(variant).upper }}%</div>
            </div>

            <div class="progress-bar">
              <div
                class="fill"
                :style="{ width: variant.conversionRate + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistical Details -->
      <div class="statistical-details">
        <h3>Statistical Analysis</h3>

        <div class="details-grid">
          <div class="detail-item">
            <span class="label">Test Method</span>
            <span class="value">Chi-Square Goodness of Fit</span>
          </div>
          <div class="detail-item">
            <span class="label">Confidence Level</span>
            <span class="value">{{ (selectedTest.confidenceLevel * 100).toFixed(0) }}%</span>
          </div>
          <div class="detail-item">
            <span class="label">Chi-Square Value</span>
            <span class="value">{{ selectedTest.results.chisquareValue }}</span>
          </div>
          <div class="detail-item">
            <span class="label">P-Value</span>
            <span class="value">{{ selectedTest.results.pValue }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Significance Threshold</span>
            <span class="value">p &lt; {{ (1 - selectedTest.confidenceLevel).toFixed(3) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Statistically Significant</span>
            <span class="value">
              <span v-if="selectedTest.results.statisticallySignificant" class="badge badge-success">Yes ✓</span>
              <span v-else class="badge badge-warning">No ✗</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="recommendations">
        <h3>Recommendations</h3>

        <div v-if="selectedTest.results.statisticallySignificant" class="rec-card rec-success">
          <span class="icon">✓</span>
          <div class="content">
            <strong>Apply Winning Variant</strong>
            <p>{{ selectedTest.results.winner === 'control' ? 'Keep the control' : 'Switch to ' + getVariantName(selectedTest.results.winner) }}
            version. It has a {{ (selectedTest.results.winnerConfidence * 100).toFixed(1) }}% conversion rate,
            outperforming alternatives.</p>
          </div>
        </div>

        <div v-else-if="selectedTest.status === 'running'" class="rec-card rec-info">
          <span class="icon">ℹ</span>
          <div class="content">
            <strong>Continue Test</strong>
            <p>Keep the test running to reach {{ selectedTest.minSampleSize }} visitors for reliable results.
            You're at {{ selectedTest.traffic.totalVisitors }} ({{ ((selectedTest.traffic.totalVisitors / selectedTest.minSampleSize) * 100).toFixed(0) }}% complete).</p>
          </div>
        </div>

        <div v-if="selectedTest.variants.some(v => v.status === 'paused')" class="rec-card rec-warning">
          <span class="icon">⏸</span>
          <div class="content">
            <strong>Underperforming Variants Paused</strong>
            <p>Some variants have been automatically paused due to poor performance.
            This saves budget and accelerates the test.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useABTestManager } from '../../services/aBTestManager.js'

const props = defineProps({
  testId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['winner-applied', 'test-paused', 'test-resumed'])

const { getTest, pauseTest: pauseTestAPI, resumeTest: resumeTestAPI, selectWinner, calculateConfidenceInterval } = useABTestManager()

const selectedTest = ref(null)
let refreshInterval = null

const loadTest = () => {
  if (props.testId) {
    selectedTest.value = getTest(props.testId)
  }
}

const daysRunning = computed(() => {
  if (!selectedTest.value) return 0
  return Math.floor((new Date() - new Date(selectedTest.value.startDate)) / (1000 * 60 * 60 * 24))
})

const statusClass = computed(() => {
  if (!selectedTest.value) return ''
  const status = selectedTest.value.status
  if (status === 'running') return 'badge-primary'
  if (status === 'paused') return 'badge-warning'
  if (status === 'winner_selected') return 'badge-success'
  return 'badge-secondary'
})

const controlCI = computed(() => {
  if (!selectedTest.value) return { lower: 0, upper: 0 }
  return calculateConfidenceInterval(selectedTest.value.control.conversions, selectedTest.value.control.visitors)
})

const getVariantCI = (variant) => {
  return calculateConfidenceInterval(variant.conversions, variant.visitors)
}

const getVariantName = (variantId) => {
  if (!selectedTest.value) return ''
  const variant = selectedTest.value.variants.find(v => v.id === variantId)
  return variant ? variant.name : ''
}

const pauseTest = () => {
  if (selectedTest.value) {
    pauseTestAPI(selectedTest.value.id)
    loadTest()
    emit('test-paused', selectedTest.value.id)
  }
}

const resumeTest = () => {
  if (selectedTest.value) {
    resumeTestAPI(selectedTest.value.id)
    loadTest()
    emit('test-resumed', selectedTest.value.id)
  }
}

const applyWinner = () => {
  if (selectedTest.value && selectedTest.value.results.statisticallySignificant) {
    selectWinner(selectedTest.value.id, selectedTest.value.results.winner)
    loadTest()
    emit('winner-applied', {
      testId: selectedTest.value.id,
      winnerId: selectedTest.value.results.winner
    })
  }
}

onMounted(() => {
  loadTest()
  // Refresh test data every 5 seconds to check for updates
  refreshInterval = setInterval(() => {
    loadTest()
  }, 5000)
})

onBeforeUnmount(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

watch(() => props.testId, () => {
  loadTest()
})
</script>

<style scoped>
.ab-test-results-dashboard {
  width: 100%;
}

.no-test-selected {
  padding: 60px 20px;
  text-align: center;
}

.empty-state {
  max-width: 400px;
  margin: 0 auto;
}

.empty-state .icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #111827;
}

.empty-state p {
  font-size: 15px;
  color: #6b7280;
}

.test-results {
  space: 24px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.header-left h2 {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.test-description {
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 12px 0;
}

.test-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 13px;
  color: #6b7280;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
}

.badge-primary {
  background: #dbeafe;
  color: #1e40af;
}

.badge-warning {
  background: #fef3c7;
  color: #92400e;
}

.badge-success {
  background: #d1fae5;
  color: #065f46;
}

.header-right {
  display: flex;
  gap: 12px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 2px solid #d1d5db;
}

.btn-secondary:hover {
  border-color: #9ca3af;
  background: #f9fafb;
}

/* Alerts */
.significance-alert {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  border-left: 4px solid;
}

.alert-success {
  background: #f0fdf4;
  border-color: #10b981;
}

.alert-success .icon {
  color: #10b981;
  font-size: 20px;
  flex-shrink: 0;
}

.alert-success strong {
  color: #065f46;
}

.alert-success p {
  color: #047857;
  font-size: 14px;
  margin: 4px 0 0 0;
}

.alert-info {
  background: #eff6ff;
  border-color: #3b82f6;
}

.alert-info .icon {
  color: #3b82f6;
}

.alert-info strong {
  color: #1e40af;
}

.alert-info p {
  color: #1e40af;
  font-size: 14px;
  margin: 4px 0 0 0;
}

.alert-warning {
  background: #fffbeb;
  border-color: #f59e0b;
}

.alert-warning .icon {
  color: #f59e0b;
}

.alert-warning strong {
  color: #92400e;
}

.alert-warning p {
  color: #b45309;
  font-size: 14px;
  margin: 4px 0 0 0;
}

/* Performance Comparison */
.performance-comparison {
  margin-bottom: 32px;
}

.performance-comparison h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #111827;
}

.variants-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.variant-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;
}

.variant-card.control {
  border-color: #3b82f6;
  background: #eff6ff;
}

.variant-card.winner {
  border-color: #10b981;
  background: #f0fdf4;
}

.variant-card.paused {
  opacity: 0.6;
  border-color: #fbbf24;
}

.variant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.variant-header h4 {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.winner-badge,
.paused-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.winner-badge {
  background: #d1fae5;
  color: #065f46;
}

.paused-badge {
  background: #fef3c7;
  color: #92400e;
}

.variant-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat .label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 4px;
}

.stat .value {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.performance-delta {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 14px;
}

.performance-delta .label {
  color: #6b7280;
  font-weight: 500;
}

.performance-delta .delta {
  font-weight: 700;
}

.delta.positive {
  color: #10b981;
}

.delta.negative {
  color: #ef4444;
}

.confidence-interval {
  margin-bottom: 12px;
}

.confidence-interval .label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 4px;
}

.confidence-interval .range {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar .fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s;
}

.variant-card.winner .progress-bar .fill {
  background: #10b981;
}

/* Statistical Details */
.statistical-details {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
}

.statistical-details h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #111827;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.detail-item .label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 4px;
}

.detail-item .value {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

/* Recommendations */
.recommendations {
  margin-bottom: 32px;
}

.recommendations h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #111827;
}

.rec-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  border-left: 4px solid;
}

.rec-success {
  background: #f0fdf4;
  border-color: #10b981;
}

.rec-success .icon {
  color: #10b981;
  font-weight: 700;
  font-size: 20px;
}

.rec-success strong {
  color: #065f46;
}

.rec-success p {
  color: #047857;
  font-size: 14px;
  margin: 4px 0 0 0;
}

.rec-info {
  background: #eff6ff;
  border-color: #3b82f6;
}

.rec-info .icon {
  color: #3b82f6;
  font-weight: 700;
  font-size: 20px;
}

.rec-info strong {
  color: #1e40af;
}

.rec-info p {
  color: #1e40af;
  font-size: 14px;
  margin: 4px 0 0 0;
}

.rec-warning {
  background: #fffbeb;
  border-color: #f59e0b;
}

.rec-warning .icon {
  color: #f59e0b;
  font-weight: 700;
  font-size: 20px;
}

.rec-warning strong {
  color: #92400e;
}

.rec-warning p {
  color: #b45309;
  font-size: 14px;
  margin: 4px 0 0 0;
}

@media (max-width: 768px) {
  .results-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-right {
    width: 100%;
    flex-direction: column;
  }

  .header-right button {
    width: 100%;
  }

  .variants-comparison {
    grid-template-columns: 1fr;
  }

  .variant-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
