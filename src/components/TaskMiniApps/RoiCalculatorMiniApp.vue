<template>
  <div class="roi-calculator">
    <!-- Header -->
    <div class="header">
      <h2>ROI Calculator</h2>
      <p class="subtitle">Enter your channel data below to calculate real-time ROI metrics</p>
    </div>

    <!-- Global Metrics from Form -->
    <div class="global-inputs" v-if="formData">
      <div class="input-row">
        <div class="input-group">
          <label>Avg Revenue/Customer</label>
          <span class="value">${{ formData.avg_revenue_per_customer || 0 }}</span>
        </div>
        <div class="input-group">
          <label>Customer Lifetime</label>
          <span class="value">{{ formData.avg_customer_lifetime_months || 12 }} months</span>
        </div>
        <div class="input-group">
          <label>Gross Margin</label>
          <span class="value">{{ formData.gross_margin_percent || 70 }}%</span>
        </div>
        <div class="input-group">
          <label>Calculated LTV</label>
          <span class="value highlight">${{ calculatedLTV.toFixed(0) }}</span>
        </div>
      </div>
    </div>

    <!-- Channel Data Input -->
    <div class="channels-section">
      <div class="section-header">
        <h3>Channel Performance</h3>
        <button @click="addChannel" class="btn-add">+ Add Channel</button>
      </div>

      <div class="channels-table">
        <div class="table-header">
          <span class="col-channel">Channel</span>
          <span class="col-spend">Monthly Spend</span>
          <span class="col-customers">Customers</span>
          <span class="col-cac">CAC</span>
          <span class="col-ltv-cac">LTV:CAC</span>
          <span class="col-payback">Payback</span>
          <span class="col-status">Status</span>
          <span class="col-actions"></span>
        </div>

        <div
          v-for="(channel, index) in channels"
          :key="index"
          class="channel-row"
          :class="getStatusClass(channel)"
        >
          <div class="col-channel">
            <select v-model="channel.name" class="channel-select">
              <option value="">Select channel...</option>
              <option v-for="opt in availableChannels" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div class="col-spend">
            <span class="prefix">$</span>
            <input
              type="number"
              v-model.number="channel.spend"
              placeholder="0"
              min="0"
              @input="recalculate"
            />
          </div>
          <div class="col-customers">
            <input
              type="number"
              v-model.number="channel.customers"
              placeholder="0"
              min="0"
              @input="recalculate"
            />
          </div>
          <div class="col-cac">
            <span class="calculated">${{ getCAC(channel) }}</span>
          </div>
          <div class="col-ltv-cac">
            <span class="calculated" :class="getLtvCacClass(channel)">
              {{ getLtvCac(channel) }}:1
            </span>
          </div>
          <div class="col-payback">
            <span class="calculated">{{ getPayback(channel) }} mo</span>
          </div>
          <div class="col-status">
            <span class="status-badge" :class="getStatusClass(channel)">
              {{ getStatus(channel) }}
            </span>
          </div>
          <div class="col-actions">
            <button @click="removeChannel(index)" class="btn-remove" title="Remove channel">
              &times;
            </button>
          </div>
        </div>

        <div v-if="channels.length === 0" class="empty-state">
          <p>No channels added yet. Click "Add Channel" to start tracking your marketing ROI.</p>
        </div>
      </div>
    </div>

    <!-- Summary Metrics -->
    <div class="metrics-grid" v-if="channels.length > 0">
      <div class="metric-card">
        <span class="metric-label">Total Spend</span>
        <span class="metric-value">${{ totalSpend.toLocaleString() }}</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Total Customers</span>
        <span class="metric-value">{{ totalCustomers }}</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Blended CAC</span>
        <span class="metric-value">${{ blendedCAC.toFixed(0) }}</span>
      </div>
      <div class="metric-card" :class="overallHealthClass">
        <span class="metric-label">Overall LTV:CAC</span>
        <span class="metric-value">{{ overallLtvCac.toFixed(1) }}:1</span>
        <span class="metric-status">{{ overallHealthStatus }}</span>
      </div>
    </div>

    <!-- Channel Comparison Chart -->
    <div class="comparison-section" v-if="sortedChannels.length > 0">
      <h3>Channel Comparison (by LTV:CAC)</h3>
      <div class="comparison-chart">
        <div
          v-for="channel in sortedChannels"
          :key="channel.name"
          class="chart-bar-container"
        >
          <span class="bar-label">{{ getChannelLabel(channel.name) }}</span>
          <div class="bar-wrapper">
            <div
              class="bar"
              :class="getStatusClass(channel)"
              :style="{ width: getBarWidth(channel) + '%' }"
            >
              <span class="bar-value">{{ getLtvCac(channel) }}:1</span>
            </div>
          </div>
        </div>
        <div class="chart-benchmark">
          <div class="benchmark-line" style="left: 30%">
            <span class="benchmark-label">3:1 (Healthy)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Best/Worst Summary -->
    <div class="insights-section" v-if="sortedChannels.length >= 2">
      <div class="insight winner">
        <span class="insight-icon">&#x2191;</span>
        <div class="insight-content">
          <strong>Best Channel:</strong> {{ getChannelLabel(sortedChannels[0].name) }}
          <span class="insight-detail">
            {{ getLtvCac(sortedChannels[0]) }}:1 LTV:CAC, ${{ getCAC(sortedChannels[0]) }} CAC
          </span>
        </div>
      </div>
      <div class="insight loser">
        <span class="insight-icon">&#x2193;</span>
        <div class="insight-content">
          <strong>Worst Channel:</strong> {{ getChannelLabel(sortedChannels[sortedChannels.length - 1].name) }}
          <span class="insight-detail">
            {{ getLtvCac(sortedChannels[sortedChannels.length - 1]) }}:1 LTV:CAC, ${{ getCAC(sortedChannels[sortedChannels.length - 1]) }} CAC
          </span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="actions">
      <button @click="saveData" class="btn-primary">
        Save Channel Data
      </button>
      <button @click="exportData" class="btn-secondary">
        Export Summary
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  taskConfig: Object,
  taskData: Object,
  formData: Object
})

const emit = defineEmits(['save', 'update:channelData'])

// Channel options matching config
const availableChannels = [
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'meta_ads', label: 'Meta Ads' },
  { value: 'tiktok_ads', label: 'TikTok Ads' },
  { value: 'linkedin_ads', label: 'LinkedIn Ads' },
  { value: 'content_seo', label: 'Content/SEO' },
  { value: 'email', label: 'Email Marketing' },
  { value: 'affiliate', label: 'Affiliate/Referral' },
  { value: 'organic_social', label: 'Organic Social' },
  { value: 'influencer', label: 'Influencer' },
  { value: 'events', label: 'Events/Webinars' },
  { value: 'cold_outreach', label: 'Cold Outreach' },
  { value: 'partnerships', label: 'Partnerships' }
]

// Reactive channel data
const channels = ref(props.taskData?.channels || [])

// Calculated LTV from form data
const calculatedLTV = computed(() => {
  const revenue = props.formData?.avg_revenue_per_customer || 0
  const lifetime = props.formData?.avg_customer_lifetime_months || 12
  const margin = (props.formData?.gross_margin_percent || 70) / 100
  return revenue * lifetime * margin
})

// Summary metrics
const totalSpend = computed(() => {
  return channels.value.reduce((sum, ch) => sum + (ch.spend || 0), 0)
})

const totalCustomers = computed(() => {
  return channels.value.reduce((sum, ch) => sum + (ch.customers || 0), 0)
})

const blendedCAC = computed(() => {
  if (totalCustomers.value === 0) return 0
  return totalSpend.value / totalCustomers.value
})

const overallLtvCac = computed(() => {
  if (blendedCAC.value === 0) return 0
  return calculatedLTV.value / blendedCAC.value
})

const overallHealthStatus = computed(() => {
  const ratio = overallLtvCac.value
  if (ratio >= 3) return 'Healthy'
  if (ratio >= 2) return 'Acceptable'
  if (ratio >= 1) return 'At Risk'
  return 'Unprofitable'
})

const overallHealthClass = computed(() => {
  const ratio = overallLtvCac.value
  if (ratio >= 3) return 'status-healthy'
  if (ratio >= 2) return 'status-acceptable'
  if (ratio >= 1) return 'status-at-risk'
  return 'status-unprofitable'
})

// Sorted channels by LTV:CAC ratio (best first)
const sortedChannels = computed(() => {
  return [...channels.value]
    .filter(ch => ch.name && ch.spend > 0 && ch.customers > 0)
    .sort((a, b) => {
      const ratioA = calculatedLTV.value / (a.spend / a.customers)
      const ratioB = calculatedLTV.value / (b.spend / b.customers)
      return ratioB - ratioA
    })
})

// Helper functions
function getChannelLabel(value) {
  const found = availableChannels.find(ch => ch.value === value)
  return found ? found.label : value
}

function getCAC(channel) {
  if (!channel.customers || channel.customers === 0) return '0'
  return (channel.spend / channel.customers).toFixed(0)
}

function getLtvCac(channel) {
  const cac = parseFloat(getCAC(channel))
  if (cac === 0) return '0'
  return (calculatedLTV.value / cac).toFixed(1)
}

function getLtvCacClass(channel) {
  const ratio = parseFloat(getLtvCac(channel))
  if (ratio >= 3) return 'good'
  if (ratio >= 2) return 'acceptable'
  if (ratio >= 1) return 'warning'
  return 'danger'
}

function getPayback(channel) {
  const cac = parseFloat(getCAC(channel))
  const monthlyRevenue = (props.formData?.avg_revenue_per_customer || 0) * ((props.formData?.gross_margin_percent || 70) / 100)
  if (monthlyRevenue === 0) return '0'
  return (cac / monthlyRevenue).toFixed(1)
}

function getStatus(channel) {
  const ratio = parseFloat(getLtvCac(channel))
  if (ratio >= 5) return 'Scale'
  if (ratio >= 3) return 'Healthy'
  if (ratio >= 2) return 'Optimize'
  if (ratio >= 1) return 'At Risk'
  return 'Cut'
}

function getStatusClass(channel) {
  const ratio = parseFloat(getLtvCac(channel))
  if (ratio >= 3) return 'status-healthy'
  if (ratio >= 2) return 'status-acceptable'
  if (ratio >= 1) return 'status-at-risk'
  return 'status-unprofitable'
}

function getBarWidth(channel) {
  const ratio = parseFloat(getLtvCac(channel))
  // Scale to max 10:1 = 100%
  return Math.min(ratio * 10, 100)
}

function addChannel() {
  channels.value.push({
    name: '',
    spend: 0,
    customers: 0
  })
}

function removeChannel(index) {
  channels.value.splice(index, 1)
  recalculate()
}

function recalculate() {
  // Trigger reactivity and emit update
  emitChannelData()
}

function emitChannelData() {
  // Format channel data as text for AI prompt
  const channelDataText = channels.value
    .filter(ch => ch.name && ch.spend > 0)
    .map(ch => `${getChannelLabel(ch.name)}: $${ch.spend} spend, ${ch.customers} customers`)
    .join('. ')

  emit('update:channelData', channelDataText)
}

function saveData() {
  emit('save', {
    channels: channels.value,
    summary: {
      totalSpend: totalSpend.value,
      totalCustomers: totalCustomers.value,
      blendedCAC: blendedCAC.value,
      overallLtvCac: overallLtvCac.value,
      calculatedLTV: calculatedLTV.value
    }
  })
}

function exportData() {
  const data = {
    calculatedLTV: calculatedLTV.value,
    channels: channels.value.map(ch => ({
      name: getChannelLabel(ch.name),
      spend: ch.spend,
      customers: ch.customers,
      cac: getCAC(ch),
      ltvCac: getLtvCac(ch),
      payback: getPayback(ch),
      status: getStatus(ch)
    })),
    summary: {
      totalSpend: totalSpend.value,
      totalCustomers: totalCustomers.value,
      blendedCAC: blendedCAC.value.toFixed(0),
      overallLtvCac: overallLtvCac.value.toFixed(1),
      healthStatus: overallHealthStatus.value
    }
  }

  const text = `ROI ANALYSIS SUMMARY
===================

LTV: $${data.calculatedLTV.toFixed(0)}
Total Spend: $${data.summary.totalSpend.toLocaleString()}
Total Customers: ${data.summary.totalCustomers}
Blended CAC: $${data.summary.blendedCAC}
Overall LTV:CAC: ${data.summary.overallLtvCac}:1
Status: ${data.summary.healthStatus}

CHANNEL BREAKDOWN
-----------------
${data.channels.map(ch =>
  `${ch.name}: $${ch.spend} spend, ${ch.customers} customers, $${ch.cac} CAC, ${ch.ltvCac}:1 LTV:CAC, ${ch.payback} mo payback - ${ch.status}`
).join('\n')}
`

  navigator.clipboard.writeText(text)
  alert('Summary copied to clipboard!')
}

// Watch for form data changes
watch(() => props.formData, () => {
  emitChannelData()
}, { deep: true })

// Initialize from saved data
onMounted(() => {
  if (props.taskData?.channels) {
    channels.value = props.taskData.channels
  }
  // If channels from form's marketing_channels, pre-populate
  if (props.formData?.marketing_channels?.length && channels.value.length === 0) {
    const selected = props.formData.marketing_channels
    if (Array.isArray(selected)) {
      selected.forEach(ch => {
        channels.value.push({ name: ch, spend: 0, customers: 0 })
      })
    }
  }
})
</script>

<style scoped>
.roi-calculator {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.header {
  margin-bottom: 24px;
}

.header h2 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  color: #1a1a2e;
}

.subtitle {
  color: #666;
  margin: 0;
}

/* Global inputs display */
.global-inputs {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border: 1px solid #e0e7ff;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
}

.input-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.input-group {
  flex: 1;
  min-width: 120px;
}

.input-group label {
  display: block;
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-group .value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a2e;
}

.input-group .value.highlight {
  color: #6366f1;
}

/* Channels section */
.channels-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.btn-add {
  background: #6366f1;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
}

.btn-add:hover {
  background: #5558e3;
}

/* Table styles */
.channels-table {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 40px;
  gap: 8px;
  padding: 12px 16px;
  background: #f8f9fa;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #666;
  border-bottom: 1px solid #e0e0e0;
}

.channel-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 40px;
  gap: 8px;
  padding: 12px 16px;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.channel-row:hover {
  background: #fafafa;
}

.channel-row:last-child {
  border-bottom: none;
}

.channel-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.875rem;
}

.col-spend {
  display: flex;
  align-items: center;
  gap: 4px;
}

.col-spend .prefix {
  color: #666;
}

.col-spend input,
.col-customers input {
  width: 80px;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.875rem;
}

.calculated {
  font-weight: 500;
}

.calculated.good { color: #10b981; }
.calculated.acceptable { color: #f59e0b; }
.calculated.warning { color: #f97316; }
.calculated.danger { color: #ef4444; }

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-healthy { background: #d1fae5; color: #059669; }
.status-acceptable { background: #fef3c7; color: #d97706; }
.status-at-risk { background: #fed7aa; color: #ea580c; }
.status-unprofitable { background: #fee2e2; color: #dc2626; }

.btn-remove {
  background: none;
  border: none;
  color: #999;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.btn-remove:hover {
  color: #ef4444;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #666;
}

/* Metrics grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.metric-label {
  display: block;
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.metric-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
}

.metric-status {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 4px;
}

.metric-card.status-healthy .metric-status { color: #059669; }
.metric-card.status-acceptable .metric-status { color: #d97706; }
.metric-card.status-at-risk .metric-status { color: #ea580c; }
.metric-card.status-unprofitable .metric-status { color: #dc2626; }

/* Comparison chart */
.comparison-section {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.comparison-section h3 {
  margin: 0 0 16px 0;
  font-size: 1rem;
}

.comparison-chart {
  position: relative;
}

.chart-bar-container {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.bar-label {
  width: 120px;
  font-size: 0.875rem;
  font-weight: 500;
  flex-shrink: 0;
}

.bar-wrapper {
  flex: 1;
  background: #f0f0f0;
  border-radius: 4px;
  height: 28px;
  overflow: hidden;
}

.bar {
  height: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  min-width: 40px;
  transition: width 0.3s ease;
}

.bar.status-healthy { background: linear-gradient(90deg, #10b981, #34d399); }
.bar.status-acceptable { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.bar.status-at-risk { background: linear-gradient(90deg, #f97316, #fb923c); }
.bar.status-unprofitable { background: linear-gradient(90deg, #ef4444, #f87171); }

.bar-value {
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
}

.chart-benchmark {
  position: absolute;
  top: 0;
  left: 120px;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.benchmark-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #6366f1;
  opacity: 0.5;
}

.benchmark-label {
  position: absolute;
  top: -20px;
  left: -30px;
  font-size: 0.65rem;
  color: #6366f1;
  white-space: nowrap;
}

/* Insights */
.insights-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.insight {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
}

.insight.winner {
  background: #d1fae5;
  border: 1px solid #a7f3d0;
}

.insight.loser {
  background: #fee2e2;
  border: 1px solid #fecaca;
}

.insight-icon {
  font-size: 1.25rem;
  font-weight: bold;
}

.insight.winner .insight-icon { color: #059669; }
.insight.loser .insight-icon { color: #dc2626; }

.insight-content {
  flex: 1;
}

.insight-content strong {
  display: block;
  margin-bottom: 4px;
}

.insight-detail {
  display: block;
  font-size: 0.875rem;
  color: #666;
}

/* Actions */
.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-primary {
  background: #6366f1;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
}

.btn-primary:hover {
  background: #5558e3;
}

.btn-secondary {
  background: white;
  color: #6366f1;
  border: 2px solid #6366f1;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
}

.btn-secondary:hover {
  background: #f0f4ff;
}

/* Responsive */
@media (max-width: 768px) {
  .table-header,
  .channel-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .table-header {
    display: none;
  }

  .channel-row {
    padding: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 8px;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .insights-section {
    grid-template-columns: 1fr;
  }

  .input-row {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
