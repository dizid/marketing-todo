<template>
  <div class="paid-ads-launch-mini-app">
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
      <!-- AI Wizard Tab -->
      <div v-if="activeTab === 'wizard'" class="wizard-tab">
        <div class="wizard-header">
          <h3>🎯 AI-Powered Ad Launch Wizard</h3>
          <p>Answer 4 quick questions and get a personalized advertising plan with ready-to-use ad copy, targeting specs, and budget allocation.</p>
        </div>

        <!-- Wizard Form -->
        <div v-if="!generatedPlan" class="wizard-form">
          <div v-for="field in taskConfig.budgetWizardForm" :key="field.id" class="form-field">
            <label :for="field.id" class="form-label">
              {{ field.label }}
              <span v-if="field.required" class="required">*</span>
            </label>
            <p v-if="field.description" class="field-description">{{ field.description }}</p>

            <div v-if="field.type === 'number'" class="input-wrapper">
              <span class="input-prefix">$</span>
              <input
                :id="field.id"
                v-model.number="wizardData[field.id]"
                type="number"
                :placeholder="field.placeholder"
                :min="field.min"
                class="form-input"
              />
              <span v-if="field.suffix" class="input-suffix">{{ field.suffix }}</span>
            </div>

            <select
              v-else-if="field.type === 'select'"
              :id="field.id"
              v-model="wizardData[field.id]"
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
          </div>

          <button
            @click="generateLaunchPlan"
            :disabled="!isFormValid || isGenerating"
            class="btn-primary btn-generate"
          >
            <span v-if="isGenerating">🔄 Generating Your Plan...</span>
            <span v-else>✨ Generate My Launch Plan</span>
          </button>
        </div>

        <!-- Generated Plan -->
        <div v-if="generatedPlan" class="generated-plan">
          <div class="plan-header">
            <h3>🎉 Your Personalized Ad Launch Plan</h3>
            <button @click="resetWizard" class="btn-secondary btn-sm">↺ Start Over</button>
          </div>

          <!-- Platform Recommendations -->
          <div class="plan-section">
            <h4>📊 Recommended Platform Mix</h4>
            <p class="section-intro">Based on your ${{ wizardData.monthly_budget }}/month budget and {{ goalLabels[wizardData.primary_goal] }} goal:</p>

            <div class="platform-recommendations">
              <div
                v-for="rec in generatedPlan.platformRecommendations"
                :key="rec.platform"
                class="platform-rec-card"
              >
                <div class="platform-rec-header">
                  <span class="platform-icon">{{ rec.icon }}</span>
                  <div class="platform-rec-info">
                    <h5>{{ rec.platform }}</h5>
                    <div class="budget-allocation">
                      <span class="budget-amount">${{ rec.budget }}</span>
                      <span class="budget-percentage">{{ rec.percentage }}%</span>
                    </div>
                  </div>
                </div>
                <p class="platform-reason">{{ rec.reason }}</p>
                <div class="platform-rec-meta">
                  <span class="meta-item">{{ rec.adType }}</span>
                  <span class="meta-item">Est. {{ rec.expectedResults }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Ad Copy Variations -->
          <div class="plan-section">
            <h4>📝 Ready-to-Use Ad Copy (5 Variations)</h4>
            <p class="section-intro">Test these different angles to see what resonates with your audience:</p>

            <div class="ad-copy-variations">
              <div
                v-for="(copy, index) in generatedPlan.adCopyVariations"
                :key="index"
                class="ad-copy-card"
              >
                <div class="ad-copy-header">
                  <span class="copy-label">Variation {{ index + 1 }}: {{ copy.angle }}</span>
                  <button @click="copyToClipboard(copy)" class="btn-copy" title="Copy to clipboard">
                    📋 Copy
                  </button>
                </div>
                <div class="ad-copy-content">
                  <p class="ad-headline"><strong>Headline:</strong> {{ copy.headline }}</p>
                  <p class="ad-body"><strong>Body:</strong> {{ copy.body }}</p>
                  <p class="ad-cta"><strong>CTA:</strong> {{ copy.cta }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Targeting Specifications -->
          <div class="plan-section">
            <h4>🎯 Targeting Specifications</h4>
            <p class="section-intro">Use these targeting parameters for each platform:</p>

            <div class="targeting-specs">
              <div
                v-for="spec in generatedPlan.targetingSpecs"
                :key="spec.platform"
                class="targeting-card"
              >
                <h5>{{ spec.platform }}</h5>
                <div class="targeting-details">
                  <div v-if="spec.keywords" class="targeting-row">
                    <span class="targeting-label">Keywords:</span>
                    <span class="targeting-value">{{ spec.keywords }}</span>
                  </div>
                  <div v-if="spec.audience" class="targeting-row">
                    <span class="targeting-label">Audience:</span>
                    <span class="targeting-value">{{ spec.audience }}</span>
                  </div>
                  <div v-if="spec.demographics" class="targeting-row">
                    <span class="targeting-label">Demographics:</span>
                    <span class="targeting-value">{{ spec.demographics }}</span>
                  </div>
                  <div v-if="spec.locations" class="targeting-row">
                    <span class="targeting-label">Locations:</span>
                    <span class="targeting-value">{{ spec.locations }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Weekly Checklist -->
          <div class="plan-section">
            <h4>📅 Week-by-Week Action Checklist</h4>
            <p class="section-intro">Follow this 4-week launch plan:</p>

            <div class="weekly-checklist">
              <div
                v-for="week in generatedPlan.weeklyChecklist"
                :key="week.week"
                class="week-card"
              >
                <h5>Week {{ week.week }}: {{ week.focus }}</h5>
                <ul class="checklist">
                  <li v-for="(task, idx) in week.tasks" :key="idx">
                    <input type="checkbox" :id="`task-${week.week}-${idx}`" />
                    <label :for="`task-${week.week}-${idx}`">{{ task }}</label>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Success Signals -->
          <div class="plan-section">
            <h4>🚦 Success Signals: What to Watch For</h4>

            <div class="signals-grid">
              <div class="signal-card signal-good">
                <h5>✅ Good Signs (Keep Going!)</h5>
                <ul>
                  <li v-for="(signal, idx) in generatedPlan.successSignals.good" :key="idx">
                    {{ signal }}
                  </li>
                </ul>
              </div>

              <div class="signal-card signal-bad">
                <h5>⚠️ Red Flags (Take Action)</h5>
                <ul>
                  <li v-for="(signal, idx) in generatedPlan.successSignals.bad" :key="idx">
                    {{ signal }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="signal-action">
              <p><strong>Action Plan:</strong> {{ generatedPlan.successSignals.action }}</p>
            </div>
          </div>

          <!-- Save Actions -->
          <div class="plan-actions">
            <button @click="savePlan" class="btn-primary">
              💾 Save This Plan
            </button>
            <button @click="resetWizard" class="btn-secondary">
              ↺ Generate New Plan
            </button>
          </div>
        </div>
      </div>

      <!-- Platform Guides Tab -->
      <div v-if="activeTab === 'guides'" class="guides-tab">
        <div class="guides-header">
          <h3>📚 Platform-by-Platform Setup Guides</h3>
          <p>Comprehensive guides for launching ads on 6 major platforms. Click any platform to expand.</p>
        </div>

        <div class="platforms-accordion">
          <div
            v-for="platform in taskConfig.adPlatforms"
            :key="platform.id"
            class="platform-accordion-item"
          >
            <button
              @click="togglePlatform(platform.id)"
              :class="['platform-accordion-header', { expanded: expandedPlatforms[platform.id] }]"
            >
              <div class="platform-header-left">
                <span class="platform-icon-lg">{{ platform.icon }}</span>
                <div class="platform-title">
                  <h4>{{ platform.name }}</h4>
                  <div class="platform-meta">
                    <span class="platform-badge badge-difficulty">{{ platform.difficulty }}</span>
                    <span class="platform-badge">Min: ${{ platform.minBudget }}/mo</span>
                    <span class="platform-badge">{{ platform.types.join(', ') }}</span>
                  </div>
                </div>
              </div>
              <span class="expand-icon">{{ expandedPlatforms[platform.id] ? '▼' : '▶' }}</span>
            </button>

            <div v-if="expandedPlatforms[platform.id]" class="platform-accordion-content">
              <!-- Overview -->
              <div class="platform-section">
                <h5>📊 Overview</h5>
                <p>{{ platform.overview.description }}</p>
                <div class="platform-stats">
                  <div class="stat-item">
                    <span class="stat-label">Avg CPC:</span>
                    <span class="stat-value">{{ platform.overview.avgCPC }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Avg Conversion:</span>
                    <span class="stat-value">{{ platform.overview.avgConversion }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Time to Results:</span>
                    <span class="stat-value">{{ platform.overview.timeToResults }}</span>
                  </div>
                </div>
                <div class="best-for">
                  <strong>Best for:</strong> {{ platform.bestFor.join(', ') }}
                </div>
              </div>

              <!-- Setup Steps -->
              <div class="platform-section">
                <h5>🚀 Setup Steps</h5>
                <ol class="setup-steps">
                  <li v-for="(step, idx) in platform.setupGuide.steps" :key="idx">
                    <strong>{{ step.title }}</strong>
                    <p>{{ step.description }}</p>
                    <ul v-if="step.tips" class="step-tips">
                      <li v-for="(tip, tipIdx) in step.tips" :key="tipIdx">{{ tip }}</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <!-- Targeting Options -->
              <div class="platform-section">
                <h5>🎯 Targeting Options</h5>
                <div class="targeting-options">
                  <div v-for="(value, key) in platform.setupGuide.targeting" :key="key" class="targeting-option">
                    <strong>{{ formatKey(key) }}:</strong>
                    <span v-if="Array.isArray(value)">{{ value.join(', ') }}</span>
                    <span v-else>{{ value }}</span>
                  </div>
                </div>
              </div>

              <!-- Creative Guidelines -->
              <div class="platform-section">
                <h5>🎨 Creative Guidelines</h5>
                <div class="creative-guidelines">
                  <div v-for="(value, key) in platform.setupGuide.creativeGuidelines" :key="key" class="creative-item">
                    <strong>{{ formatKey(key) }}:</strong>
                    <p v-if="typeof value === 'string'">{{ value }}</p>
                    <ul v-else-if="Array.isArray(value)">
                      <li v-for="(item, idx) in value" :key="idx">{{ item }}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Budget Guidance -->
              <div class="platform-section">
                <h5>💰 Budget Guidance by Tier</h5>
                <div class="budget-tiers">
                  <div
                    v-for="tier in platform.setupGuide.budgetGuidance"
                    :key="tier.budget"
                    class="budget-tier-card"
                  >
                    <div class="tier-header">
                      <h6>${{ tier.budget }}/month</h6>
                    </div>
                    <div class="tier-content">
                      <p><strong>Allocation:</strong> {{ tier.allocation }}</p>
                      <p><strong>Expected Results:</strong> {{ tier.expectedResults }}</p>
                      <p><strong>Timeline:</strong> {{ tier.timeline }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Common Mistakes -->
              <div class="platform-section">
                <h5>⚠️ Common Mistakes to Avoid</h5>
                <ul class="mistakes-list">
                  <li v-for="(mistake, idx) in platform.setupGuide.commonMistakes" :key="idx">
                    {{ mistake }}
                  </li>
                </ul>
              </div>

              <!-- Success Metrics -->
              <div class="platform-section">
                <h5>📈 Success Metrics</h5>
                <div class="metrics-grid">
                  <div class="metric-card metric-good">
                    <strong>Good Performance:</strong>
                    <p>{{ platform.setupGuide.successMetrics.good }}</p>
                  </div>
                  <div class="metric-card metric-bad">
                    <strong>Poor Performance:</strong>
                    <p>{{ platform.setupGuide.successMetrics.bad }}</p>
                  </div>
                </div>
                <div class="metric-action">
                  <p><strong>Action:</strong> {{ platform.setupGuide.successMetrics.action }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resources Tab -->
      <div v-if="activeTab === 'resources'" class="resources-tab">
        <div class="resources-header">
          <h3>🛠️ Essential Resources & Tools</h3>
          <p>Tools, templates, and learning materials to accelerate your advertising success.</p>
        </div>

        <!-- Creative Tools -->
        <div class="resource-section">
          <h4>🎨 Creative & Design Tools</h4>
          <div class="tools-grid">
            <div class="tool-card">
              <span class="tool-icon">🎨</span>
              <h5>Canva</h5>
              <p>Free ad templates for all platforms. Easy drag-and-drop design.</p>
              <a href="https://canva.com" target="_blank" class="tool-link">canva.com →</a>
            </div>
            <div class="tool-card">
              <span class="tool-icon">📐</span>
              <h5>AdCreative.ai</h5>
              <p>AI-powered ad creative generator. Creates dozens of variations.</p>
              <a href="https://adcreative.ai" target="_blank" class="tool-link">adcreative.ai →</a>
            </div>
            <div class="tool-card">
              <span class="tool-icon">🎬</span>
              <h5>Clipchamp</h5>
              <p>Free video editor built into Windows. Perfect for video ads.</p>
              <a href="https://clipchamp.com" target="_blank" class="tool-link">clipchamp.com →</a>
            </div>
            <div class="tool-card">
              <span class="tool-icon">📸</span>
              <h5>Unsplash</h5>
              <p>Free high-quality stock photos. Commercial use allowed.</p>
              <a href="https://unsplash.com" target="_blank" class="tool-link">unsplash.com →</a>
            </div>
          </div>
        </div>

        <!-- Ad Copy Tools -->
        <div class="resource-section">
          <h4>✍️ Ad Copy & Copywriting</h4>
          <div class="tools-grid">
            <div class="tool-card">
              <span class="tool-icon">🤖</span>
              <h5>ChatGPT</h5>
              <p>Generate ad copy variations, headlines, and CTAs instantly.</p>
              <a href="https://chat.openai.com" target="_blank" class="tool-link">chat.openai.com →</a>
            </div>
            <div class="tool-card">
              <span class="tool-icon">📝</span>
              <h5>Copy.ai</h5>
              <p>AI copywriter specifically trained on high-converting ad copy.</p>
              <a href="https://copy.ai" target="_blank" class="tool-link">copy.ai →</a>
            </div>
            <div class="tool-card">
              <span class="tool-icon">📊</span>
              <h5>Headline Analyzer</h5>
              <p>CoSchedule's free tool scores your headlines for engagement.</p>
              <a href="https://coschedule.com/headline-analyzer" target="_blank" class="tool-link">Analyze Headlines →</a>
            </div>
          </div>
        </div>

        <!-- Tracking & Analytics -->
        <div class="resource-section">
          <h4>📊 Tracking & Analytics</h4>
          <div class="tools-grid">
            <div class="tool-card">
              <span class="tool-icon">📈</span>
              <h5>Google Analytics</h5>
              <p>Free website analytics. Track conversions and user behavior.</p>
              <a href="https://analytics.google.com" target="_blank" class="tool-link">analytics.google.com →</a>
            </div>
            <div class="tool-card">
              <span class="tool-icon">🔍</span>
              <h5>Meta Pixel</h5>
              <p>Facebook's tracking pixel for conversion tracking and retargeting.</p>
              <a href="https://business.facebook.com/events_manager" target="_blank" class="tool-link">Setup Pixel →</a>
            </div>
            <div class="tool-card">
              <span class="tool-icon">🎯</span>
              <h5>Google Tag Manager</h5>
              <p>Manage all tracking pixels and tags in one place. Free forever.</p>
              <a href="https://tagmanager.google.com" target="_blank" class="tool-link">tagmanager.google.com →</a>
            </div>
          </div>
        </div>

        <!-- Learning Resources -->
        <div class="resource-section">
          <h4>📚 Learning & Courses</h4>
          <div class="learning-list">
            <div class="learning-item">
              <span class="learning-icon">🎓</span>
              <div class="learning-content">
                <h5>Google Skillshop</h5>
                <p>Free official Google Ads courses with certification. Covers Search, Display, Video, Shopping ads.</p>
                <a href="https://skillshop.exceedlms.com/student/catalog/list?category_ids=53-google-ads" target="_blank" class="tool-link">Start Learning →</a>
              </div>
            </div>
            <div class="learning-item">
              <span class="learning-icon">📘</span>
              <div class="learning-content">
                <h5>Meta Blueprint</h5>
                <p>Facebook's official advertising courses. Free certification available.</p>
                <a href="https://www.facebook.com/business/learn" target="_blank" class="tool-link">Meta Blueprint →</a>
              </div>
            </div>
            <div class="learning-item">
              <span class="learning-icon">💼</span>
              <div class="learning-content">
                <h5>LinkedIn Marketing Labs</h5>
                <p>Learn B2B advertising on LinkedIn. Free courses and certification.</p>
                <a href="https://business.linkedin.com/marketing-solutions/marketing-labs" target="_blank" class="tool-link">Marketing Labs →</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Pro Tips -->
        <div class="resource-section">
          <h4>💡 Pro Tips from the Trenches</h4>
          <div class="pro-tips">
            <div class="tip-card">
              <span class="tip-number">1</span>
              <div class="tip-content">
                <h5>Start Small, Scale What Works</h5>
                <p>Run 3-5 ad variations at $10-20/day each for 5-7 days. Kill losers, double down on winners.</p>
              </div>
            </div>
            <div class="tip-card">
              <span class="tip-number">2</span>
              <div class="tip-content">
                <h5>Test One Variable at a Time</h5>
                <p>Change headline OR image OR audience - never all at once. Otherwise you won't know what worked.</p>
              </div>
            </div>
            <div class="tip-card">
              <span class="tip-number">3</span>
              <div class="tip-content">
                <h5>Mobile-First Creative</h5>
                <p>80%+ of social ads are viewed on mobile. Design for small screens, vertical video works best.</p>
              </div>
            </div>
            <div class="tip-card">
              <span class="tip-number">4</span>
              <div class="tip-content">
                <h5>Hook in 3 Seconds</h5>
                <p>Users decide to scroll or stop in 3 seconds. Lead with your biggest benefit, not your logo.</p>
              </div>
            </div>
            <div class="tip-card">
              <span class="tip-number">5</span>
              <div class="tip-content">
                <h5>Retargeting = Gold</h5>
                <p>People who already visited your site convert 2-3x better. Set up retargeting pixels FIRST.</p>
              </div>
            </div>
            <div class="tip-card">
              <span class="tip-number">6</span>
              <div class="tip-content">
                <h5>Check Ads Daily for First Week</h5>
                <p>Platforms need 3-7 days to learn. Monitor daily, but don't make changes until day 5-7.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { paidAdsTask } from '@/configs/paidAds.config'

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
  { id: 'wizard', label: 'AI Wizard', icon: '🎯' },
  { id: 'guides', label: 'Platform Guides', icon: '📚' },
  { id: 'resources', label: 'Resources', icon: '🛠️' }
]
const activeTab = ref('wizard')

// Wizard data
const wizardData = ref({
  monthly_budget: null,
  primary_goal: '',
  timeline: '',
  experience_level: ''
})

const generatedPlan = ref(null)
const isGenerating = ref(false)

// Platform accordion
const expandedPlatforms = ref({})

// Interval tracking
let generationInterval = null

// Computed
const isFormValid = computed(() => {
  return wizardData.value.monthly_budget >= 300 &&
         wizardData.value.primary_goal &&
         wizardData.value.timeline &&
         wizardData.value.experience_level
})

const goalLabels = {
  awareness: 'Brand Awareness',
  traffic: 'Website Traffic',
  leads: 'Lead Generation',
  sales: 'Direct Sales'
}

// Methods
const generateLaunchPlan = async () => {
  isGenerating.value = true

  // Emit event for parent to handle AI generation
  emit('generate-ai', {
    taskId: props.taskConfig.id,
    wizardData: wizardData.value,
    contextData: {
      // This would pull from projectStore in real implementation
    }
  })

  // Generate mock plan for now
  generationInterval = setTimeout(() => {
    generatedPlan.value = generateMockPlan()
    isGenerating.value = false
  }, 1500)
}

const generateMockPlan = () => {
  const budget = wizardData.value.monthly_budget
  const goal = wizardData.value.primary_goal
  const experience = wizardData.value.experience_level

  // Platform recommendations based on budget and goal
  let platformRecommendations = []

  if (budget >= 500 && budget < 1500) {
    if (goal === 'sales' || goal === 'traffic') {
      platformRecommendations = [
        {
          platform: 'Google Ads',
          icon: '🔍',
          budget: Math.round(budget * 0.7),
          percentage: 70,
          reason: 'High-intent search traffic perfect for direct response. Users actively searching for solutions.',
          adType: 'Search + Shopping',
          expectedResults: '50-150 clicks, 2-8 conversions'
        },
        {
          platform: 'Meta Ads',
          icon: '📘',
          budget: Math.round(budget * 0.3),
          percentage: 30,
          reason: 'Retargeting website visitors to close the sale. 3x higher conversion rate than cold traffic.',
          adType: 'Retargeting + Lookalike',
          expectedResults: '30-100 clicks, 1-5 conversions'
        }
      ]
    } else {
      platformRecommendations = [
        {
          platform: 'Meta Ads',
          icon: '📘',
          budget: Math.round(budget * 0.6),
          percentage: 60,
          reason: 'Best for awareness and cold audience reach. 2.9B users, powerful interest targeting.',
          adType: 'Feed + Stories',
          expectedResults: '1000-3000 impressions, 30-100 clicks'
        },
        {
          platform: 'Google Ads',
          icon: '🔍',
          budget: Math.round(budget * 0.4),
          percentage: 40,
          reason: 'Capture branded searches and related keywords to build awareness.',
          adType: 'Search + Display',
          expectedResults: '500-1500 impressions, 20-60 clicks'
        }
      ]
    }
  } else if (budget >= 1500 && budget < 3000) {
    platformRecommendations = [
      {
        platform: 'Google Ads',
        icon: '🔍',
        budget: Math.round(budget * 0.5),
        percentage: 50,
        reason: 'Primary driver for high-intent traffic. Scale winning keywords.',
        adType: 'Search + Shopping + Display',
        expectedResults: '150-400 clicks, 8-25 conversions'
      },
      {
        platform: 'Meta Ads',
        icon: '📘',
        budget: Math.round(budget * 0.3),
        percentage: 30,
        reason: 'Retargeting + lookalike audiences. Feed the funnel.',
        adType: 'All placements',
        expectedResults: '100-300 clicks, 5-15 conversions'
      },
      {
        platform: 'LinkedIn Ads',
        icon: '💼',
        budget: Math.round(budget * 0.2),
        percentage: 20,
        reason: 'If B2B: decision-makers and professionals. Higher quality leads.',
        adType: 'Sponsored Content',
        expectedResults: '30-80 clicks, 2-8 conversions'
      }
    ]
  } else if (budget >= 3000) {
    platformRecommendations = [
      {
        platform: 'Google Ads',
        icon: '🔍',
        budget: Math.round(budget * 0.45),
        percentage: 45,
        reason: 'Core revenue driver. Expand to Display Network and YouTube.',
        adType: 'Search + Display + Video',
        expectedResults: '400-1000 clicks, 25-60 conversions'
      },
      {
        platform: 'Meta Ads',
        icon: '📘',
        budget: Math.round(budget * 0.30),
        percentage: 30,
        reason: 'Full-funnel campaigns: cold prospecting + retargeting + engagement.',
        adType: 'Feed + Stories + Reels',
        expectedResults: '300-800 clicks, 15-40 conversions'
      },
      {
        platform: 'LinkedIn Ads',
        icon: '💼',
        budget: Math.round(budget * 0.15),
        percentage: 15,
        reason: 'B2B demand generation. Target by job title, company, industry.',
        adType: 'Sponsored Content + InMail',
        expectedResults: '80-200 clicks, 8-20 conversions'
      },
      {
        platform: 'TikTok Ads',
        icon: '🎵',
        budget: Math.round(budget * 0.10),
        percentage: 10,
        reason: 'Test creative viral content. Younger audience, lower CPM.',
        adType: 'In-Feed Video',
        expectedResults: '200-500 clicks, 5-15 conversions'
      }
    ]
  }

  // Ad copy variations
  const adCopyVariations = [
    {
      angle: 'Problem-Solution',
      headline: 'Struggling with [Problem]? We Fixed It.',
      body: 'Join 1,000+ customers who solved [problem] in 30 days. No complicated setup, no hidden fees. Just results.',
      cta: 'Get Started Free'
    },
    {
      angle: 'Social Proof',
      headline: '1,000+ Customers Trust Us. Here\'s Why.',
      body: '★★★★★ 4.8/5 stars. "This is the solution I\'ve been searching for!" - Real customer review.',
      cta: 'See What Others Are Saying'
    },
    {
      angle: 'Urgency/Scarcity',
      headline: 'Limited Time: 30% Off Ends Sunday',
      body: 'Don\'t miss out! Over 500 people signed up this week. Lock in your discount before it\'s gone.',
      cta: 'Claim My 30% Off'
    },
    {
      angle: 'Value Proposition',
      headline: 'Get [Benefit] in [Time] or Money Back',
      body: 'We guarantee results. Try risk-free for 30 days. If you don\'t see [specific outcome], we\'ll refund every penny.',
      cta: 'Start Risk-Free Trial'
    },
    {
      angle: 'Curiosity/Intrigue',
      headline: 'The [Tool/Method] Everyone\'s Talking About',
      body: 'See why 1,000+ businesses switched to us this month. Discover the faster, easier way to [outcome].',
      cta: 'Watch 2-Min Demo'
    }
  ]

  // Targeting specs
  const targetingSpecs = platformRecommendations.map(rec => {
    if (rec.platform === 'Google Ads') {
      return {
        platform: 'Google Ads',
        keywords: 'Start with 10-20 exact match keywords related to your product/service',
        audience: 'In-market audiences for your category, custom intent audiences',
        demographics: 'Age 25-54, all genders, household income top 50%',
        locations: 'Target your service area or shipping regions only'
      }
    } else if (rec.platform === 'Meta Ads') {
      return {
        platform: 'Meta Ads (Facebook/Instagram)',
        audience: 'Retargeting: website visitors last 30 days. Cold: interests related to your niche + lookalike 1%',
        demographics: 'Age 25-45, optimize for conversions (let Meta find your audience)',
        locations: 'Target countries where you ship/serve',
        placements: 'Automatic placements (let algorithm optimize)'
      }
    } else if (rec.platform === 'LinkedIn Ads') {
      return {
        platform: 'LinkedIn Ads',
        audience: 'Job titles: [your target roles], Company size: 50-1000 employees',
        demographics: 'Industries: [your target industries], Seniority: Manager and above',
        locations: 'Major metro areas in your target countries'
      }
    } else if (rec.platform === 'TikTok Ads') {
      return {
        platform: 'TikTok Ads',
        audience: 'Interest targeting: [related interests], engagement audiences',
        demographics: 'Age 18-34, optimize for app installs or conversions',
        locations: 'US, UK, CA, AU (English-speaking markets first)'
      }
    }
  })

  // Weekly checklist
  const weeklyChecklist = [
    {
      week: 1,
      focus: 'Setup & Launch',
      tasks: [
        'Install tracking pixels on website (Meta Pixel, Google Tag)',
        'Setup conversion tracking for key actions (purchases, signups)',
        'Create ad accounts for each platform',
        'Design 5 ad creatives (images/videos) using Canva or AdCreative.ai',
        'Write 5 ad copy variations (use templates above)',
        'Launch 3-5 ad sets at recommended budgets',
        'Set up daily budget alerts'
      ]
    },
    {
      week: 2,
      focus: 'Monitor & Learn',
      tasks: [
        'Check ad performance daily (but don\'t make changes yet)',
        'Review which ad creatives get highest CTR',
        'Monitor cost per click and cost per conversion',
        'Ensure tracking is working correctly (test conversions)',
        'Build retargeting audiences (website visitors, video viewers)',
        'Document what you\'re learning in a spreadsheet'
      ]
    },
    {
      week: 3,
      focus: 'Optimize & Scale',
      tasks: [
        'Pause ads with CTR < 1% or CPC > 2x target',
        'Increase budget 20% on best-performing ads',
        'Launch 3 new ad variations based on top performers',
        'Add negative keywords (Google) or exclude poorly performing audiences',
        'Launch retargeting campaigns to warm audiences',
        'A/B test: new headline vs. winning headline'
      ]
    },
    {
      week: 4,
      focus: 'Scale & Expand',
      tasks: [
        'Increase budget 50% on winners (slowly, 20% every 3 days)',
        'Expand to new platforms if primary platform is profitable',
        'Create lookalike audiences from converters',
        'Test new ad formats (carousel, video, collection)',
        'Calculate actual ROI: Revenue ÷ Ad Spend',
        'Plan month 2 budget based on performance data'
      ]
    }
  ]

  // Success signals
  const successSignals = {
    good: [
      'CTR (Click-Through Rate) above 2% for search, 1%+ for social',
      'Cost Per Click decreasing week-over-week',
      'Conversion rate above 2% (varies by industry)',
      'Quality Score 7+ on Google Ads',
      'ROAS (Return on Ad Spend) above 3:1 by week 3-4',
      'Steady increase in conversions as algorithm learns'
    ],
    bad: [
      'CTR below 0.5% after 7 days (ad creative not resonating)',
      'High clicks but zero conversions (landing page issue)',
      'CPC increasing daily (audience too broad or saturated)',
      'Ad disapprovals or policy violations',
      'Bounce rate above 70% from ad traffic',
      'No improvement after 14 days of running'
    ],
    action: 'Check daily for first 7 days, then every 2-3 days. Wait 5-7 days before major changes - algorithms need time to learn. If no conversions after 14 days and 100+ clicks, fix your landing page first.'
  }

  return {
    platformRecommendations,
    adCopyVariations,
    targetingSpecs,
    weeklyChecklist,
    successSignals
  }
}

const savePlan = () => {
  const dataToSave = {
    wizardData: wizardData.value,
    generatedPlan: generatedPlan.value,
    timestamp: new Date().toISOString()
  }

  emit('save', {
    taskId: props.taskConfig.id,
    data: dataToSave
  })
}

const resetWizard = () => {
  generatedPlan.value = null
  wizardData.value = {
    monthly_budget: null,
    primary_goal: '',
    timeline: '',
    experience_level: ''
  }
}

const togglePlatform = (platformId) => {
  expandedPlatforms.value[platformId] = !expandedPlatforms.value[platformId]
}

const formatKey = (key) => {
  return key.split(/(?=[A-Z])/).join(' ').replace(/^./, str => str.toUpperCase())
}

const copyToClipboard = async (copy) => {
  const text = `Headline: ${copy.headline}\n\nBody: ${copy.body}\n\nCTA: ${copy.cta}`

  try {
    await navigator.clipboard.writeText(text)
    alert('Ad copy copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Cleanup interval on unmount
onBeforeUnmount(() => {
  if (generationInterval) clearTimeout(generationInterval)
})
</script>

<style scoped>
.paid-ads-launch-mini-app {
  width: 100%;
}

/* Tabs Navigation */
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

/* Tab Content */
.tab-content {
  padding: 20px 0;
}

/* Wizard Tab */
.wizard-header {
  margin-bottom: 32px;
}

.wizard-header h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #111827;
}

.wizard-header p {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.6;
}

/* Form */
.wizard-form {
  max-width: 600px;
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
.form-select {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.btn-generate {
  width: 100%;
  margin-top: 32px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
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

/* Generated Plan */
.generated-plan {
  max-width: 900px;
  margin: 0 auto;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.plan-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.plan-section {
  margin-bottom: 48px;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.plan-section h4 {
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

/* Platform Recommendations */
.platform-recommendations {
  display: grid;
  gap: 16px;
}

.platform-rec-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
}

.platform-rec-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.platform-icon {
  font-size: 32px;
}

.platform-rec-info {
  flex: 1;
}

.platform-rec-info h5 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #111827;
}

.budget-allocation {
  display: flex;
  align-items: center;
  gap: 12px;
}

.budget-amount {
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
}

.budget-percentage {
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  background: #eff6ff;
  padding: 4px 12px;
  border-radius: 20px;
}

.platform-reason {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 12px;
}

.platform-rec-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 13px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 6px;
}

/* Ad Copy Variations */
.ad-copy-variations {
  display: grid;
  gap: 16px;
}

.ad-copy-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
}

.ad-copy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.copy-label {
  font-weight: 700;
  color: #374151;
  font-size: 15px;
}

.btn-copy {
  background: #eff6ff;
  color: #3b82f6;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-copy:hover {
  background: #dbeafe;
}

.ad-copy-content p {
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: #4b5563;
}

.ad-headline {
  color: #111827;
}

/* Targeting Specs */
.targeting-specs {
  display: grid;
  gap: 16px;
}

.targeting-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
}

.targeting-card h5 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #111827;
}

.targeting-details {
  display: grid;
  gap: 12px;
}

.targeting-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 12px;
  font-size: 14px;
}

.targeting-label {
  font-weight: 600;
  color: #6b7280;
}

.targeting-value {
  color: #374151;
  line-height: 1.5;
}

/* Weekly Checklist */
.weekly-checklist {
  display: grid;
  gap: 16px;
}

.week-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
}

.week-card h5 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #111827;
}

.checklist {
  list-style: none;
  padding: 0;
  margin: 0;
}

.checklist li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
}

.checklist input[type="checkbox"] {
  margin-top: 4px;
  cursor: pointer;
}

/* Success Signals */
.signals-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.signal-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
}

.signal-card h5 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
}

.signal-good {
  border-color: #10b981;
  background: #f0fdf4;
}

.signal-good h5 {
  color: #059669;
}

.signal-bad {
  border-color: #f59e0b;
  background: #fffbeb;
}

.signal-bad h5 {
  color: #d97706;
}

.signal-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.signal-card li {
  font-size: 14px;
  padding: 6px 0;
  color: #374151;
  line-height: 1.5;
}

.signal-card li:before {
  content: "• ";
  font-weight: 700;
  margin-right: 8px;
}

.signal-action {
  background: white;
  padding: 16px;
  border-radius: 10px;
  border: 2px solid #3b82f6;
}

.signal-action p {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

/* Plan Actions */
.plan-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 32px;
}

/* Platform Guides Tab */
.guides-header {
  margin-bottom: 32px;
}

.guides-header h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #111827;
}

.guides-header p {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.6;
}

/* Accordion */
.platforms-accordion {
  display: grid;
  gap: 16px;
}

.platform-accordion-item {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

.platform-accordion-header {
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

.platform-accordion-header:hover {
  background: #f3f4f6;
}

.platform-accordion-header.expanded {
  background: #eff6ff;
  border-bottom: 2px solid #e5e7eb;
}

.platform-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.platform-icon-lg {
  font-size: 40px;
}

.platform-title h4 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #111827;
  text-align: left;
}

.platform-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.platform-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  background: #f3f4f6;
  color: #6b7280;
}

.badge-difficulty {
  background: #dbeafe;
  color: #3b82f6;
}

.expand-icon {
  font-size: 20px;
  color: #9ca3af;
}

.platform-accordion-content {
  padding: 24px;
}

.platform-section {
  margin-bottom: 32px;
}

.platform-section:last-child {
  margin-bottom: 0;
}

.platform-section h5 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #111827;
}

.platform-section p {
  font-size: 15px;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 16px;
}

.platform-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 16px 0;
}

.stat-item {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.best-for {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  background: #eff6ff;
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
}

.setup-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: step-counter;
}

.setup-steps > li {
  counter-increment: step-counter;
  margin-bottom: 24px;
  padding-left: 40px;
  position: relative;
}

.setup-steps > li:before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0;
  background: #3b82f6;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.setup-steps strong {
  display: block;
  font-size: 16px;
  color: #111827;
  margin-bottom: 8px;
}

.setup-steps p {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 8px;
}

.step-tips {
  list-style: disc;
  padding-left: 20px;
  margin-top: 8px;
}

.step-tips li {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 4px;
}

.targeting-options,
.creative-guidelines {
  display: grid;
  gap: 12px;
}

.targeting-option,
.creative-item {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
}

.targeting-option strong,
.creative-item strong {
  display: block;
  font-size: 14px;
  color: #374151;
  margin-bottom: 6px;
}

.targeting-option span,
.creative-item p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.creative-item ul {
  list-style: disc;
  padding-left: 20px;
  margin: 8px 0 0 0;
}

.creative-item li {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 4px;
}

.budget-tiers {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.budget-tier-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.tier-header {
  background: #3b82f6;
  color: white;
  padding: 12px;
  text-align: center;
}

.tier-header h6 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.tier-content {
  padding: 16px;
}

.tier-content p {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 10px;
}

.tier-content p:last-child {
  margin-bottom: 0;
}

.mistakes-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mistakes-list li {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  padding: 10px 12px;
  margin-bottom: 8px;
  background: #fef2f2;
  border-left: 4px solid #ef4444;
  border-radius: 6px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.metric-card {
  padding: 16px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
}

.metric-card strong {
  display: block;
  font-size: 15px;
  margin-bottom: 8px;
}

.metric-card p {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.metric-good {
  background: #f0fdf4;
  border-color: #10b981;
}

.metric-good strong {
  color: #059669;
}

.metric-good p {
  color: #065f46;
}

.metric-bad {
  background: #fef2f2;
  border-color: #ef4444;
}

.metric-bad strong {
  color: #dc2626;
}

.metric-bad p {
  color: #991b1b;
}

.metric-action {
  background: #eff6ff;
  padding: 16px;
  border-radius: 10px;
  border: 2px solid #3b82f6;
}

.metric-action p {
  font-size: 14px;
  color: #1e40af;
  line-height: 1.6;
  margin: 0;
}

/* Resources Tab */
.resources-header {
  margin-bottom: 32px;
}

.resources-header h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #111827;
}

.resources-header p {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.6;
}

.resource-section {
  margin-bottom: 48px;
}

.resource-section h4 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #111827;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.tool-card {
  background: white;
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  transition: all 0.2s;
}

.tool-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.tool-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 12px;
}

.tool-card h5 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #111827;
}

.tool-card p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 12px;
}

.tool-link {
  color: #3b82f6;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}

.tool-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.learning-list {
  display: grid;
  gap: 16px;
}

.learning-item {
  display: flex;
  gap: 16px;
  background: white;
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  transition: all 0.2s;
}

.learning-item:hover {
  border-color: #3b82f6;
}

.learning-icon {
  font-size: 40px;
}

.learning-content {
  flex: 1;
}

.learning-content h5 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #111827;
}

.learning-content p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 10px;
}

.pro-tips {
  display: grid;
  gap: 16px;
}

.tip-card {
  display: flex;
  gap: 16px;
  background: white;
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  border-left: 4px solid #3b82f6;
}

.tip-number {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
}

.tip-content h5 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #111827;
}

.tip-content p {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .tabs-nav {
    flex-direction: column;
  }

  .tab-btn {
    justify-content: center;
  }

  .platform-stats,
  .signals-grid,
  .metrics-grid,
  .budget-tiers {
    grid-template-columns: 1fr;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }

  .platform-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .plan-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .targeting-row {
    grid-template-columns: 1fr;
  }
}
</style>
