<template>
  <div class="paid-ads-optimize-mini-app">
    <!-- Tab Navigation -->
    <div class="tabs-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Campaign Audit Wizard Tab -->
      <div v-if="activeTab === 'audit'" class="audit-tab">
        <div class="audit-header">
          <h3>🔍 Campaign Performance Audit</h3>
          <p>Input your current campaign metrics and get AI-powered optimization recommendations</p>
        </div>

        <!-- Audit Form -->
        <div v-if="!auditResults" class="audit-form">
          <div v-for="field in taskConfig.auditWizardForm" :key="field.id" class="form-field">
            <label :for="field.id" class="form-label">
              {{ field.label }}
              <span v-if="field.required" class="required">*</span>
            </label>
            <p v-if="field.description" class="field-description">{{ field.description }}</p>

            <div v-if="field.type === 'checkboxes'" class="checkboxes-group">
              <label
                v-for="option in field.options"
                :key="option.value"
                class="checkbox-label"
              >
                <input
                  type="checkbox"
                  :value="option.value"
                  v-model="auditData[field.id]"
                />
                <span>{{ option.label }}</span>
              </label>
            </div>

            <div v-else-if="field.type === 'number'" class="input-wrapper">
              <span v-if="field.prefix" class="input-prefix">{{ field.prefix }}</span>
              <input
                :id="field.id"
                v-model.number="auditData[field.id]"
                type="number"
                :placeholder="field.placeholder"
                :min="field.min"
                :step="field.step"
                class="form-input"
              />
              <span v-if="field.suffix" class="input-suffix">{{ field.suffix }}</span>
            </div>

            <select
              v-else-if="field.type === 'select'"
              :id="field.id"
              v-model="auditData[field.id]"
              class="form-select"
            >
              <option value="">Select...</option>
              <option
                v-for="option in field.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>

            <textarea
              v-else-if="field.type === 'textarea'"
              :id="field.id"
              v-model="auditData[field.id]"
              :placeholder="field.placeholder"
              :rows="field.rows || 3"
              class="form-textarea"
            ></textarea>
          </div>

          <button
            @click="runAudit"
            :disabled="!isFormValid || isAnalyzing"
            class="btn-primary btn-analyze"
          >
            <span v-if="isAnalyzing">🔄 Analyzing Your Campaigns...</span>
            <span v-else>📊 Analyze My Campaigns</span>
          </button>
        </div>

        <!-- Audit Results -->
        <div v-if="auditResults" class="audit-results">
          <div class="results-header">
            <h3>📋 Your Campaign Analysis</h3>
            <button @click="resetAudit" class="btn-secondary btn-sm">↺ Run New Audit</button>
          </div>

          <!-- Performance Diagnosis -->
          <div class="results-section diagnosis-section">
            <h4>🔍 Performance Diagnosis</h4>
            <div class="diagnosis-items">
              <div
                v-for="(item, idx) in auditResults.diagnosis"
                :key="idx"
                :class="['diagnosis-item', `severity-${item.severity}`]"
              >
                <span class="diagnosis-icon">{{ item.icon }}</span>
                <div class="diagnosis-content">
                  <strong>{{ item.issue }}</strong>
                  <p>{{ item.detail }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 30-Day Action Plan -->
          <div class="results-section action-plan-section">
            <h4>📅 Your 30-Day Optimization Roadmap</h4>
            <p class="section-intro">Prioritized by impact - start with Week 1</p>

            <div class="action-weeks">
              <div
                v-for="week in auditResults.actionPlan"
                :key="week.week"
                class="week-plan"
              >
                <div class="week-header">
                  <h5>Week {{ week.week }}: {{ week.focus }}</h5>
                  <span class="impact-badge">{{ week.expectedImpact }}</span>
                </div>
                <ul class="action-checklist">
                  <li v-for="(action, idx) in week.actions" :key="idx">
                    <input type="checkbox" :id="`action-${week.week}-${idx}`" />
                    <label :for="`action-${week.week}-${idx}`">{{ action }}</label>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Quick Wins -->
          <div class="results-section quick-wins-section">
            <h4>⚡ Quick Wins (Do These Today)</h4>
            <p class="section-intro">Implement these now for immediate improvements</p>

            <div class="quick-wins-grid">
              <div
                v-for="(win, idx) in auditResults.quickWins"
                :key="idx"
                class="quick-win-card"
              >
                <div class="quick-win-header">
                  <span class="quick-win-number">{{ idx + 1 }}</span>
                  <h5>{{ win.title }}</h5>
                </div>
                <p class="quick-win-description">{{ win.description }}</p>
                <div class="quick-win-action">
                  <strong>Action:</strong> {{ win.action }}
                </div>
                <div class="quick-win-impact">
                  <span class="impact-label">Expected Impact:</span>
                  <span class="impact-value">{{ win.expectedImpact }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Budget Reallocation -->
          <div class="results-section budget-section">
            <h4>💰 Budget Reallocation Recommendation</h4>

            <div class="budget-comparison">
              <div class="budget-column">
                <h5>Current Allocation</h5>
                <div class="budget-breakdown">
                  <div
                    v-for="item in auditResults.budgetRecommendation.current"
                    :key="item.platform"
                    class="budget-item current"
                  >
                    <span class="platform-name">{{ item.platform }}</span>
                    <span class="budget-amount">${{ item.amount }}</span>
                    <span class="budget-percentage">{{ item.percentage }}%</span>
                  </div>
                </div>
              </div>

              <div class="budget-arrow">→</div>

              <div class="budget-column">
                <h5>Recommended Allocation</h5>
                <div class="budget-breakdown">
                  <div
                    v-for="item in auditResults.budgetRecommendation.recommended"
                    :key="item.platform"
                    class="budget-item recommended"
                  >
                    <span class="platform-name">{{ item.platform }}</span>
                    <span class="budget-amount">${{ item.amount }}</span>
                    <span class="budget-percentage">{{ item.percentage }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="budget-rationale">
              <p><strong>Why:</strong> {{ auditResults.budgetRecommendation.rationale }}</p>
            </div>
          </div>

          <!-- Save Actions -->
          <div class="results-actions">
            <button @click="saveAudit" class="btn-primary">
              💾 Save This Analysis
            </button>
            <button @click="resetAudit" class="btn-secondary">
              ↺ Run New Audit
            </button>
          </div>
        </div>
      </div>

      <!-- Optimization Playbooks Tab -->
      <div v-if="activeTab === 'playbooks'" class="playbooks-tab">
        <div class="playbooks-header">
          <h3>📚 Optimization Playbooks</h3>
          <p>Platform-specific and goal-based tactics to improve performance</p>
        </div>

        <!-- Goal-Based Playbooks -->
        <div class="playbooks-section">
          <h4>🎯 By Goal</h4>

          <div class="playbooks-grid">
            <div
              v-for="playbook in taskConfig.goalPlaybooks"
              :key="playbook.id"
              class="playbook-card"
              @click="openPlaybook('goal', playbook.id)"
            >
              <div class="playbook-icon">{{ playbook.icon }}</div>
              <h5>{{ playbook.title }}</h5>
              <div class="playbook-meta">
                <span class="meta-tag">{{ playbook.difficulty }}</span>
                <span class="meta-tag">{{ playbook.timeToImplement }}</span>
              </div>
              <p class="playbook-result">{{ playbook.expectedResults }}</p>
            </div>
          </div>
        </div>

        <!-- Platform Optimizations -->
        <div class="playbooks-section">
          <h4>🔧 By Platform</h4>

          <div class="platforms-list">
            <div
              v-for="platform in taskConfig.platformOptimizations"
              :key="platform.id"
              class="platform-playbook"
            >
              <button
                @click="togglePlatformOptimization(platform.id)"
                :class="['platform-header', { expanded: expandedOptimizations[platform.id] }]"
              >
                <div class="platform-info">
                  <span class="platform-icon-lg">{{ platform.icon }}</span>
                  <div class="platform-details">
                    <h5>{{ platform.platform }}</h5>
                    <span class="section-count">{{ platform.sections.length }} optimization areas</span>
                  </div>
                </div>
                <span class="expand-icon">{{ expandedOptimizations[platform.id] ? '▼' : '▶' }}</span>
              </button>

              <div v-if="expandedOptimizations[platform.id]" class="platform-content">
                <div
                  v-for="section in platform.sections"
                  :key="section.title"
                  class="optimization-section"
                >
                  <div class="section-header">
                    <h6>{{ section.title }}</h6>
                    <div class="section-badges">
                      <span class="badge badge-impact">{{ section.expectedImpact }}</span>
                      <span class="badge badge-time">{{ section.timeToImplement }}</span>
                      <span class="badge badge-difficulty">{{ section.difficulty }}</span>
                    </div>
                  </div>

                  <div
                    v-for="(tactic, idx) in section.tactics"
                    :key="idx"
                    class="tactic-item"
                  >
                    <div class="tactic-header">
                      <strong>{{ tactic.name }}</strong>
                    </div>
                    <p class="tactic-description">{{ tactic.description }}</p>

                    <div class="tactic-steps">
                      <p class="steps-label">Steps:</p>
                      <ol class="steps-list">
                        <li v-for="(step, stepIdx) in tactic.steps" :key="stepIdx">
                          {{ step }}
                        </li>
                      </ol>
                    </div>

                    <div class="tactic-why">
                      <strong>Why:</strong> {{ tactic.why }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Advanced Strategies Tab -->
      <div v-if="activeTab === 'advanced'" class="advanced-tab">
        <div class="advanced-header">
          <h3>🚀 Advanced Optimization Strategies</h3>
          <p>Pro-level tactics for experienced advertisers</p>
        </div>

        <!-- A/B Testing Framework -->
        <div class="strategy-section">
          <div class="strategy-header">
            <span class="strategy-icon">{{ taskConfig.advancedStrategies.abTesting.icon }}</span>
            <h4>{{ taskConfig.advancedStrategies.abTesting.title }}</h4>
          </div>

          <div
            v-for="section in taskConfig.advancedStrategies.abTesting.sections"
            :key="section.title"
            class="strategy-content-block"
          >
            <h5>{{ section.title }}</h5>
            <div class="strategy-content" v-html="formatContent(section.content)"></div>
          </div>
        </div>

        <!-- Creative Fatigue -->
        <div class="strategy-section">
          <div class="strategy-header">
            <span class="strategy-icon">{{ taskConfig.advancedStrategies.creativeFatigue.icon }}</span>
            <h4>{{ taskConfig.advancedStrategies.creativeFatigue.title }}</h4>
          </div>

          <div
            v-for="section in taskConfig.advancedStrategies.creativeFatigue.sections"
            :key="section.title"
            class="strategy-content-block"
          >
            <h5>{{ section.title }}</h5>
            <div class="strategy-content" v-html="formatContent(section.content)"></div>
          </div>
        </div>

        <!-- Audience Segmentation -->
        <div class="strategy-section">
          <div class="strategy-header">
            <span class="strategy-icon">{{ taskConfig.advancedStrategies.audienceSegmentation.icon }}</span>
            <h4>{{ taskConfig.advancedStrategies.audienceSegmentation.title }}</h4>
          </div>

          <div
            v-for="section in taskConfig.advancedStrategies.audienceSegmentation.sections"
            :key="section.title"
            class="strategy-content-block"
          >
            <h5>{{ section.title }}</h5>
            <div class="strategy-content" v-html="formatContent(section.content)"></div>
          </div>
        </div>

        <!-- Scaling Playbook -->
        <div class="strategy-section">
          <div class="strategy-header">
            <span class="strategy-icon">{{ taskConfig.advancedStrategies.scaling.icon }}</span>
            <h4>{{ taskConfig.advancedStrategies.scaling.title }}</h4>
          </div>

          <div
            v-for="section in taskConfig.advancedStrategies.scaling.sections"
            :key="section.title"
            class="strategy-content-block"
          >
            <h5>{{ section.title }}</h5>
            <div class="strategy-content" v-html="formatContent(section.content)"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Playbook Modal -->
    <div v-if="selectedPlaybook" class="playbook-modal-overlay" @click="closePlaybook">
      <div class="playbook-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedPlaybook.icon }} {{ selectedPlaybook.title }}</h3>
          <button @click="closePlaybook" class="btn-close">✕</button>
        </div>

        <div class="modal-meta">
          <span class="meta-badge">{{ selectedPlaybook.difficulty }}</span>
          <span class="meta-badge">⏱️ {{ selectedPlaybook.timeToImplement }}</span>
          <span class="meta-badge success">🎯 {{ selectedPlaybook.expectedResults }}</span>
        </div>

        <div class="modal-content">
          <div
            v-for="(tactic, idx) in selectedPlaybook.tactics"
            :key="idx"
            class="playbook-tactic"
          >
            <div class="tactic-priority">
              <span :class="['priority-badge', `priority-${tactic.priority.toLowerCase()}`]">
                {{ tactic.priority }} Priority
              </span>
            </div>

            <h4>{{ tactic.title }}</h4>
            <p class="tactic-desc">{{ tactic.description }}</p>

            <div class="tactic-checklist">
              <h5>Implementation Checklist:</h5>
              <ul>
                <li v-for="(item, checkIdx) in tactic.checklist" :key="checkIdx">
                  <input type="checkbox" :id="`check-${idx}-${checkIdx}`" />
                  <label :for="`check-${idx}-${checkIdx}`">{{ item }}</label>
                </li>
              </ul>
            </div>

            <div class="tactic-footer">
              <div class="tactic-why">
                <strong>Why this works:</strong> {{ tactic.why }}
              </div>
              <div v-if="tactic.expectedImpact" class="tactic-impact">
                <strong>Expected Impact:</strong> {{ tactic.expectedImpact }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { paidAdsOptimizeTask } from '@/configs/paidAdsOptimize.config'

const props = defineProps({
  taskConfig: {
    type: Object,
    required: true
  },
  taskData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['save', 'generate-ai'])

// Tab management
const tabs = [
  { id: 'audit', label: 'Campaign Audit', icon: '🔍' },
  { id: 'playbooks', label: 'Playbooks', icon: '📚' },
  { id: 'advanced', label: 'Advanced', icon: '🚀' }
]
const activeTab = ref('audit')

// Audit data
const auditData = ref({
  platforms: [],
  campaign_duration: '',
  total_spend: null,
  total_clicks: null,
  total_conversions: null,
  primary_goal: '',
  biggest_challenge: '',
  avg_ctr: null
})

const auditResults = ref(null)
const isAnalyzing = ref(false)

// Playbooks
const expandedOptimizations = ref({})
const selectedPlaybook = ref(null)

// Computed
const isFormValid = computed(() => {
  return auditData.value.platforms.length > 0 &&
         auditData.value.campaign_duration &&
         auditData.value.total_spend >= 100 &&
         auditData.value.total_clicks >= 10 &&
         auditData.value.total_conversions >= 0 &&
         auditData.value.primary_goal
})

// Methods
const runAudit = async () => {
  isAnalyzing.value = true

  // Emit event for parent to handle AI generation
  emit('generate-ai', {
    taskId: props.taskConfig.id,
    auditData: auditData.value
  })

  // Generate mock analysis
  setTimeout(() => {
    auditResults.value = generateAuditResults()
    isAnalyzing.value = false
  }, 2000)
}

const generateAuditResults = () => {
  const spend = auditData.value.total_spend
  const clicks = auditData.value.total_clicks
  const conversions = auditData.value.total_conversions

  // Calculate metrics
  const ctr = (clicks / (spend * 10)) // Rough estimate for CTR
  const cpc = spend / clicks
  const cpa = conversions > 0 ? spend / conversions : 0
  const conversionRate = (conversions / clicks) * 100

  // Industry benchmarks
  const benchmarks = {
    ctr: 2.0,
    cpc: 2.5,
    cpa: 50,
    conversionRate: 3.0
  }

  // Diagnosis
  const diagnosis = []

  if (ctr < benchmarks.ctr * 0.8) {
    diagnosis.push({
      severity: 'high',
      icon: '⚠️',
      issue: 'Low Click-Through Rate',
      detail: `Your estimated CTR is ${ctr.toFixed(2)}% vs industry average ${benchmarks.ctr}%. Your ads aren't compelling enough - need better creative and copy.`
    })
  }

  if (cpc > benchmarks.cpc * 1.3) {
    diagnosis.push({
      severity: 'medium',
      icon: '💰',
      issue: 'High Cost Per Click',
      detail: `Your CPC is $${cpc.toFixed(2)} vs average $${benchmarks.cpc}. Improve Quality Score (Google) or relevance score (Meta) to lower costs.`
    })
  }

  if (conversions > 0 && cpa > benchmarks.cpa * 1.5) {
    diagnosis.push({
      severity: 'critical',
      icon: '🚨',
      issue: 'High Cost Per Acquisition',
      detail: `Your CPA is $${cpa.toFixed(2)} vs target $${benchmarks.cpa}. Landing page or targeting needs optimization immediately.`
    })
  }

  if (conversionRate < benchmarks.conversionRate * 0.7) {
    diagnosis.push({
      severity: 'high',
      icon: '📉',
      issue: 'Low Conversion Rate',
      detail: `Your conversion rate is ${conversionRate.toFixed(2)}% vs average ${benchmarks.conversionRate}%. Landing page experience is likely the culprit.`
    })
  }

  if (diagnosis.length === 0) {
    diagnosis.push({
      severity: 'success',
      icon: '✅',
      issue: 'Campaigns Performing Well',
      detail: 'Your key metrics are within healthy ranges. Focus on scaling tactics and incremental optimizations.'
    })
  }

  // Action Plan
  const actionPlan = []

  if (ctr < benchmarks.ctr * 0.8) {
    actionPlan.push({
      week: 1,
      focus: 'Creative Refresh',
      expectedImpact: '2-3x CTR increase',
      actions: [
        'Launch 5 new ad variations with different hooks/angles',
        'Test video ads vs static images',
        'Add power words to headlines: "Proven", "Fast", "Guaranteed"',
        'Use before/after images if applicable',
        'Kill ads with CTR <0.5% after 100 impressions'
      ]
    })
  }

  if (conversions > 0 && cpa > benchmarks.cpa * 1.5) {
    actionPlan.push({
      week: 2,
      focus: 'Landing Page Optimization',
      expectedImpact: '50% CPA reduction',
      actions: [
        'Ensure headline matches ad copy exactly',
        'Reduce form fields to 3-5 maximum',
        'Add social proof: testimonials, trust badges, customer count',
        'Test page load speed - aim for <2 seconds',
        'Remove navigation menu to prevent exits'
      ]
    })
  }

  if (conversionRate < benchmarks.conversionRate) {
    actionPlan.push({
      week: 3,
      focus: 'Audience Targeting Refinement',
      expectedImpact: '30% better conversion rate',
      actions: [
        'Analyze which audiences are converting vs not converting',
        'Pause audiences with 0 conversions after $100 spend',
        'Add negative keywords/audiences to exclude low-intent traffic',
        'Test narrow vs broad targeting (narrow often converts better)',
        'Build retargeting campaigns for website visitors'
      ]
    })
  }

  actionPlan.push({
    week: 4,
    focus: 'Scale What\'s Working',
    expectedImpact: '2x results',
    actions: [
      'Identify top 3 best-performing campaigns by ROAS',
      'Increase budgets on winners by 20% (not more)',
      'Duplicate winning campaigns with new audiences',
      'Set up automated rules to pause underperformers',
      'Test 2-3% lookalike audiences based on converters'
    ]
  })

  // Quick Wins
  const quickWins = [
    {
      title: 'Add Negative Keywords',
      description: 'Exclude irrelevant searches to stop wasting money immediately',
      action: 'Go to Search Terms report, add terms with 0 conversions as negative keywords. Focus on: "free", "cheap", "diy", "jobs"',
      expectedImpact: '15-25% budget savings today'
    },
    {
      title: 'Pause Worst Performers',
      description: 'Stop ads that are clearly not working',
      action: `Pause any ads with >$${(cpa * 2).toFixed(0)} CPA or <0.5% CTR. Reallocate that budget to top performers.`,
      expectedImpact: 'Immediate improvement in average CPA'
    },
    {
      title: 'Fix Conversion Tracking',
      description: 'Verify your tracking is working correctly',
      action: 'Complete a test purchase/signup yourself. Check if it shows up in ads manager within 24 hours. If not, fix tracking before optimizing further.',
      expectedImpact: 'Better data = better decisions'
    }
  ]

  // Budget Recommendation
  const currentBudget = spend
  const platformCount = auditData.value.platforms.length

  const budgetRecommendation = {
    current: auditData.value.platforms.map((p, idx) => ({
      platform: getPlatformName(p),
      amount: Math.round(currentBudget / platformCount),
      percentage: Math.round(100 / platformCount)
    })),
    recommended: [],
    rationale: ''
  }

  if (cpa > benchmarks.cpa * 1.5) {
    // High CPA: focus on retargeting
    budgetRecommendation.recommended = [
      { platform: 'Retargeting (all platforms)', amount: Math.round(currentBudget * 0.6), percentage: 60 },
      { platform: 'Cold Acquisition', amount: Math.round(currentBudget * 0.4), percentage: 40 }
    ]
    budgetRecommendation.rationale = 'Your CPA is high on cold traffic. Shift 60% to retargeting website visitors - they convert 3-5x better.'
  } else if (auditData.value.platforms.includes('google') && auditData.value.platforms.includes('meta')) {
    // Multi-platform: optimize mix
    budgetRecommendation.recommended = [
      { platform: 'Google Ads', amount: Math.round(currentBudget * 0.5), percentage: 50 },
      { platform: 'Meta Ads', amount: Math.round(currentBudget * 0.3), percentage: 30 },
      { platform: 'Other Platforms', amount: Math.round(currentBudget * 0.2), percentage: 20 }
    ]
    budgetRecommendation.rationale = 'Google typically drives higher-intent traffic. Allocate 50% there, 30% to Meta for reach, 20% to test other platforms.'
  } else {
    budgetRecommendation.recommended = budgetRecommendation.current
    budgetRecommendation.rationale = 'Continue current allocation. Focus on creative and landing page optimization before shifting budgets.'
  }

  return {
    diagnosis,
    actionPlan,
    quickWins,
    budgetRecommendation
  }
}

const getPlatformName = (platformId) => {
  const names = {
    google: 'Google Ads',
    meta: 'Meta Ads',
    linkedin: 'LinkedIn Ads',
    tiktok: 'TikTok Ads',
    twitter: 'Twitter/X Ads',
    pinterest: 'Pinterest Ads'
  }
  return names[platformId] || platformId
}

const saveAudit = () => {
  const dataToSave = {
    auditData: auditData.value,
    auditResults: auditResults.value,
    timestamp: new Date().toISOString()
  }

  emit('save', {
    taskId: props.taskConfig.id,
    data: dataToSave
  })
}

const resetAudit = () => {
  auditResults.value = null
  auditData.value = {
    platforms: [],
    campaign_duration: '',
    total_spend: null,
    total_clicks: null,
    total_conversions: null,
    primary_goal: '',
    biggest_challenge: '',
    avg_ctr: null
  }
}

const togglePlatformOptimization = (platformId) => {
  expandedOptimizations.value[platformId] = !expandedOptimizations.value[platformId]
}

const openPlaybook = (type, id) => {
  if (type === 'goal') {
    selectedPlaybook.value = props.taskConfig.goalPlaybooks.find(p => p.id === id)
  }
}

const closePlaybook = () => {
  selectedPlaybook.value = null
}

const formatContent = (content) => {
  // Convert markdown-style formatting to HTML
  let formatted = content
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.+)$/gm, '<h6>$1</h6>')
    .replace(/^## (.+)$/gm, '<h5>$1</h5>')
    .replace(/^# (.+)$/gm, '<h4>$1</h4>')
    .replace(/\n/g, '<br>')

  // Convert bullet lists
  formatted = formatted.replace(/^- (.+)$/gm, '<li>$1</li>')
  formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

  return formatted
}
</script>

<style scoped>
.paid-ads-optimize-mini-app {
  width: 100%;
}

/* Tabs */
.tabs-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: #3b82f6;
  background: #eff6ff;
}

.tab-btn.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  background: #eff6ff;
}

.tab-icon {
  font-size: 18px;
}

/* Audit Tab */
.audit-header {
  margin-bottom: 32px;
}

.audit-header h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #111827;
}

.audit-header p {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.6;
}

/* Form */
.audit-form {
  max-width: 700px;
  margin: 0 auto;
}

.form-field {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
  font-size: 14px;
}

.required {
  color: #ef4444;
}

.field-description {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
  line-height: 1.5;
}

.checkboxes-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.checkbox-label:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-prefix,
.input-suffix {
  font-weight: 600;
  color: #6b7280;
  font-size: 15px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.btn-analyze {
  width: 100%;
  margin-top: 32px;
  padding: 14px;
  font-size: 16px;
}

/* Buttons */
.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 2px solid #d1d5db;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: #9ca3af;
  background: #f9fafb;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
}

/* Audit Results */
.audit-results {
  max-width: 1000px;
  margin: 0 auto;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.results-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.results-section {
  margin-bottom: 48px;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.results-section h4 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #111827;
}

.section-intro {
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 20px;
  line-height: 1.6;
}

/* Diagnosis */
.diagnosis-items {
  display: grid;
  gap: 16px;
}

.diagnosis-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 10px;
  border-left: 4px solid #d1d5db;
}

.diagnosis-item.severity-critical {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.diagnosis-item.severity-high {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.diagnosis-item.severity-medium {
  border-left-color: #3b82f6;
  background: #eff6ff;
}

.diagnosis-item.severity-success {
  border-left-color: #10b981;
  background: #f0fdf4;
}

.diagnosis-icon {
  font-size: 24px;
}

.diagnosis-content strong {
  display: block;
  font-size: 16px;
  margin-bottom: 4px;
  color: #111827;
}

.diagnosis-content p {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
  margin: 0;
}

/* Action Plan */
.action-weeks {
  display: grid;
  gap: 20px;
}

.week-plan {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
}

.week-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.week-header h5 {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.impact-badge {
  font-size: 13px;
  font-weight: 600;
  padding: 4px 12px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 20px;
}

.action-checklist {
  list-style: none;
  padding: 0;
  margin: 0;
}

.action-checklist li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
}

.action-checklist input[type="checkbox"] {
  margin-top: 4px;
  cursor: pointer;
}

/* Quick Wins */
.quick-wins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.quick-win-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
}

.quick-win-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.quick-win-number {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
}

.quick-win-header h5 {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.quick-win-description,
.quick-win-action {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 12px;
}

.quick-win-impact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.impact-label {
  font-size: 13px;
  color: #6b7280;
}

.impact-value {
  font-size: 13px;
  font-weight: 700;
  color: #10b981;
}

/* Budget Reallocation */
.budget-comparison {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 24px;
  align-items: center;
  margin-bottom: 20px;
}

.budget-column h5 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #111827;
}

.budget-breakdown {
  display: grid;
  gap: 12px;
}

.budget-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  align-items: center;
}

.budget-item.recommended {
  border-color: #10b981;
  background: #f0fdf4;
}

.platform-name {
  font-weight: 600;
  color: #111827;
  font-size: 14px;
}

.budget-amount {
  font-weight: 700;
  color: #3b82f6;
  font-size: 16px;
}

.budget-percentage {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 6px;
}

.budget-arrow {
  font-size: 32px;
  color: #3b82f6;
  font-weight: 700;
}

.budget-rationale {
  background: #eff6ff;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid #3b82f6;
}

.budget-rationale p {
  font-size: 14px;
  color: #1e40af;
  line-height: 1.6;
  margin: 0;
}

/* Results Actions */
.results-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 32px;
}

/* Playbooks Tab */
.playbooks-header {
  margin-bottom: 32px;
}

.playbooks-header h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #111827;
}

.playbooks-header p {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.6;
}

.playbooks-section {
  margin-bottom: 48px;
}

.playbooks-section h4 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #111827;
}

.playbooks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.playbook-card {
  background: white;
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.playbook-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.playbook-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.playbook-card h5 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #111827;
}

.playbook-meta {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.meta-tag {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 6px;
}

.playbook-result {
  font-size: 14px;
  color: #10b981;
  font-weight: 600;
  margin: 0;
}

/* Platform Optimizations */
.platforms-list {
  display: grid;
  gap: 16px;
}

.platform-playbook {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

.platform-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f9fafb;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.platform-header:hover {
  background: #f3f4f6;
}

.platform-header.expanded {
  background: #eff6ff;
  border-bottom: 2px solid #e5e7eb;
}

.platform-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.platform-icon-lg {
  font-size: 40px;
}

.platform-details h5 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #111827;
  text-align: left;
}

.section-count {
  font-size: 13px;
  color: #6b7280;
}

.expand-icon {
  font-size: 20px;
  color: #9ca3af;
}

.platform-content {
  padding: 24px;
}

.optimization-section {
  margin-bottom: 32px;
}

.optimization-section:last-child {
  margin-bottom: 0;
}

.section-header {
  margin-bottom: 16px;
}

.section-header h6 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #111827;
}

.section-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
}

.badge-impact {
  background: #dcfce7;
  color: #166534;
}

.badge-time {
  background: #dbeafe;
  color: #1e40af;
}

.badge-difficulty {
  background: #fef3c7;
  color: #92400e;
}

.tactic-item {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
}

.tactic-header strong {
  font-size: 15px;
  color: #111827;
}

.tactic-description {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin: 8px 0 12px 0;
}

.tactic-steps {
  margin: 16px 0;
}

.steps-label {
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  margin-bottom: 8px;
}

.steps-list {
  padding-left: 20px;
  margin: 0;
}

.steps-list li {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 8px;
}

.tactic-why {
  margin-top: 12px;
  padding: 12px;
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
  border-radius: 6px;
  font-size: 14px;
  color: #1e40af;
  line-height: 1.6;
}

/* Advanced Strategies */
.advanced-header {
  margin-bottom: 32px;
}

.advanced-header h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #111827;
}

.advanced-header p {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.6;
}

.strategy-section {
  margin-bottom: 48px;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.strategy-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.strategy-icon {
  font-size: 32px;
}

.strategy-header h4 {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.strategy-content-block {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
}

.strategy-content-block h5 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #111827;
}

.strategy-content {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.8;
}

.strategy-content :deep(strong) {
  color: #111827;
  font-weight: 600;
}

.strategy-content :deep(h4),
.strategy-content :deep(h5),
.strategy-content :deep(h6) {
  margin-top: 20px;
  margin-bottom: 12px;
  color: #111827;
}

.strategy-content :deep(ul) {
  margin: 12px 0;
  padding-left: 20px;
}

.strategy-content :deep(li) {
  margin-bottom: 8px;
}

/* Playbook Modal */
.playbook-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.playbook-modal {
  background: white;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  border-radius: 12px;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 2px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.modal-header h3 {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f3f4f6;
  color: #111827;
}

.modal-meta {
  padding: 16px 24px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.meta-badge {
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 6px;
}

.meta-badge.success {
  background: #dcfce7;
  color: #166534;
}

.modal-content {
  padding: 24px;
}

.playbook-tactic {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 2px solid #e5e7eb;
}

.playbook-tactic:last-child {
  border-bottom: none;
}

.tactic-priority {
  margin-bottom: 12px;
}

.priority-badge {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.priority-critical {
  background: #fee2e2;
  color: #991b1b;
}

.priority-high {
  background: #fef3c7;
  color: #92400e;
}

.priority-medium {
  background: #dbeafe;
  color: #1e40af;
}

.playbook-tactic h4 {
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #111827;
}

.tactic-desc {
  font-size: 15px;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 16px;
}

.tactic-checklist {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
}

.tactic-checklist h5 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #111827;
}

.tactic-checklist ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tactic-checklist li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
}

.tactic-checklist input[type="checkbox"] {
  margin-top: 4px;
  cursor: pointer;
}

.tactic-footer {
  margin-top: 16px;
}

.tactic-why,
.tactic-impact {
  font-size: 14px;
  line-height: 1.6;
  margin-top: 12px;
}

.tactic-why {
  padding: 12px;
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
  border-radius: 6px;
  color: #1e40af;
}

.tactic-impact {
  padding: 12px;
  background: #f0fdf4;
  border-left: 4px solid #10b981;
  border-radius: 6px;
  color: #166534;
}

/* Responsive */
@media (max-width: 768px) {
  .tabs-nav {
    flex-direction: column;
  }

  .tab-btn {
    justify-content: center;
  }

  .checkboxes-group {
    grid-template-columns: 1fr;
  }

  .quick-wins-grid {
    grid-template-columns: 1fr;
  }

  .budget-comparison {
    grid-template-columns: 1fr;
  }

  .budget-arrow {
    text-align: center;
    transform: rotate(90deg);
  }

  .playbooks-grid {
    grid-template-columns: 1fr;
  }

  .section-badges {
    flex-direction: column;
  }
}
</style>
