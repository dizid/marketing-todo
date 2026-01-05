<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Tier Performance Analysis</h2>
      <p class="text-gray-600 mt-1">How profile completion across tiers correlates with content performance</p>
    </div>

    <!-- Task Selection -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">Select Task to Analyze</label>
      <select
        v-model="selectedTaskId"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Choose a task...</option>
        <option v-for="task in tasks" :key="task.id" :value="task.id">
          {{ task.name }}
        </option>
      </select>
    </div>

    <!-- No Selection State -->
    <div v-if="!selectedTaskId" class="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
      <svg class="w-12 h-12 text-blue-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-blue-800 font-medium">Select a task to view tier performance analysis</p>
    </div>

    <!-- Analysis Content -->
    <div v-else class="space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div class="text-sm text-blue-700 font-medium">Task Readiness</div>
          <div class="text-3xl font-bold text-blue-900 mt-2">{{ taskData.readinessScore }}%</div>
          <div class="text-xs text-blue-600 mt-1">Overall completion</div>
        </div>

        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div class="text-sm text-green-700 font-medium">Performance Impact</div>
          <div class="text-3xl font-bold text-green-900 mt-2">{{ taskData.performanceImpact }}%</div>
          <div class="text-xs text-green-600 mt-1">Estimated improvement potential</div>
        </div>

        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div class="text-sm text-purple-700 font-medium">Tier Score</div>
          <div class="text-3xl font-bold text-purple-900 mt-2">{{ taskData.tierScore }}/100</div>
          <div class="text-xs text-purple-600 mt-1">Composite tier value</div>
        </div>
      </div>

      <!-- Tier Breakdown -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-gray-900">Tier-by-Tier Breakdown</h3>

        <div
          v-for="(tier, idx) in tierBreakdown"
          :key="tier.name"
          class="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Tier Header -->
          <div
            @click="toggleTier(idx)"
            :class="[
              'p-4 cursor-pointer flex items-center justify-between',
              tier.isRequired ? 'bg-blue-50 border-b border-blue-200' : 'bg-gray-50 border-b border-gray-200'
            ]"
          >
            <div class="flex items-center space-x-3">
              <!-- Tier Icon -->
              <div
                :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white',
                  getTierColor(tier.name)
                ]"
              >
                {{ tier.number }}
              </div>

              <!-- Tier Info -->
              <div>
                <h4 class="font-semibold text-gray-900">{{ tier.name }}</h4>
                <p class="text-sm text-gray-600">{{ tier.description }}</p>
              </div>
            </div>

            <!-- Completion Status -->
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-lg font-bold text-gray-900">{{ tier.completionPercentage }}%</div>
                <div class="text-xs text-gray-600">{{ tier.completedFields }}/{{ tier.totalFields }} fields</div>
              </div>

              <!-- Chevron -->
              <svg
                :class="['w-5 h-5 text-gray-400 transition-transform', expandedTier === idx ? 'transform rotate-180' : '']"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="px-4 py-2 bg-white">
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                :style="{ width: tier.completionPercentage + '%' }"
                :class="[
                  'h-full transition-all duration-300',
                  getProgressColor(tier.completionPercentage)
                ]"
              />
            </div>
          </div>

          <!-- Expanded Details -->
          <Transition name="expand">
            <div v-if="expandedTier === idx" class="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
              <!-- Field Completion List -->
              <div>
                <h5 class="font-semibold text-gray-900 mb-3">Field Completion</h5>
                <div class="space-y-2">
                  <div
                    v-for="field in tier.fields"
                    :key="field.name"
                    class="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                  >
                    <div class="flex items-center space-x-2">
                      <div
                        :class="[
                          'w-5 h-5 rounded border-2 flex items-center justify-center',
                          field.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300'
                        ]"
                      >
                        <svg v-if="field.completed" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <span :class="['text-sm', field.completed ? 'text-gray-700 font-medium' : 'text-gray-600']">
                        {{ field.name }}
                      </span>
                    </div>
                    <span v-if="field.impactScore" class="text-xs font-medium text-blue-600">
                      +{{ field.impactScore }}% impact
                    </span>
                  </div>
                </div>
              </div>

              <!-- Performance Insight -->
              <div class="bg-blue-50 border border-blue-200 rounded p-3">
                <h5 class="font-semibold text-blue-900 text-sm mb-1">Impact on Performance</h5>
                <p class="text-sm text-blue-800">
                  Completing this tier could improve content performance by approximately <strong>{{ tier.potentialGain }}%</strong>.
                </p>
              </div>

              <!-- Recommendations -->
              <div>
                <h5 class="font-semibold text-gray-900 mb-2 text-sm">Next Steps</h5>
                <ul class="space-y-1 text-sm text-gray-700">
                  <li v-for="rec in tier.recommendations" :key="rec" class="flex items-start space-x-2">
                    <span class="text-blue-600 font-bold mt-0.5">→</span>
                    <span>{{ rec }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Correlation Analysis -->
      <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Tier Completion Impact Analysis</h3>

        <div class="space-y-4">
          <div v-for="analysis in correlationAnalysis" :key="analysis.tier" class="space-y-2">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-gray-900">{{ analysis.tier }} Complete</div>
                <div class="text-sm text-gray-600">{{ analysis.description }}</div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-purple-600">{{ analysis.performanceGain }}%</div>
                <div class="text-xs text-gray-600">performance lift</div>
              </div>
            </div>

            <!-- Impact Bar -->
            <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                :style="{ width: (analysis.performanceGain * 1.5) + '%' }"
                class="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Insight -->
        <div class="mt-4 pt-4 border-t border-purple-200">
          <p class="text-sm text-gray-700">
            <strong>Key Insight:</strong> Completing all required tiers (1-3) typically results in a
            <strong class="text-purple-600">{{ totalPotentialGain }}% improvement</strong> in content performance metrics.
            Focus on quick wins in Tier 1 and 2 first.
          </p>
        </div>
      </div>

      <!-- Recommendations Summary -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Recommended Action Plan</h3>

        <div class="space-y-3">
          <div v-for="(action, idx) in actionPlan" :key="idx" class="flex items-start space-x-3">
            <div class="w-8 h-8 rounded-full bg-green-600 text-white font-bold flex items-center justify-center flex-shrink-0">
              {{ idx + 1 }}
            </div>
            <div>
              <div class="font-semibold text-gray-900">{{ action.title }}</div>
              <p class="text-sm text-gray-700 mt-1">{{ action.description }}</p>
              <div class="text-xs text-green-700 font-medium mt-1">
                ⏱️ {{ action.timeframe }} • 💪 {{ action.impact }}% impact
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

const props = defineProps({
  tasks: {
    type: Array,
    default: () => [
      { id: 'email-segment', name: 'Email Segmentation Campaign', readiness: 65 },
      { id: 'social-content', name: 'Social Media Content Series', readiness: 45 },
      { id: 'landing-page', name: 'Landing Page Optimization', readiness: 80 }
    ]
  }
})

const selectedTaskId = ref('')
const expandedTier = ref(null)

/**
 * Sample tier breakdown data
 */
const getTierData = (taskId) => {
  const data = {
    'email-segment': {
      readinessScore: 65,
      performanceImpact: 35,
      tierScore: 72,
      tierBreakdown: [
        {
          number: 1,
          name: 'Basic Information',
          description: 'Essential audience and messaging details',
          isRequired: true,
          completionPercentage: 100,
          completedFields: 6,
          totalFields: 6,
          potentialGain: 15,
          fields: [
            { name: 'Target Audience Defined', completed: true, impactScore: 3 },
            { name: 'Primary Goal Set', completed: true, impactScore: 4 },
            { name: 'Campaign Name', completed: true, impactScore: 1 },
            { name: 'Launch Date', completed: true, impactScore: 2 },
            { name: 'Budget Allocated', completed: true, impactScore: 3 },
            { name: 'Success Metrics', completed: true, impactScore: 2 }
          ],
          recommendations: [
            'Monitor early campaign performance',
            'Start A/B testing subject lines',
            'Prepare segmentation logic'
          ]
        },
        {
          number: 2,
          name: 'Content & Creative',
          description: 'Email copy, design, and messaging variations',
          isRequired: true,
          completionPercentage: 80,
          completedFields: 4,
          totalFields: 5,
          potentialGain: 12,
          fields: [
            { name: 'Email Subject Line', completed: true, impactScore: 5 },
            { name: 'Email Body Copy', completed: true, impactScore: 4 },
            { name: 'CTA Button Text', completed: true, impactScore: 3 },
            { name: 'Visual Assets', completed: true, impactScore: 2 },
            { name: 'Preview Text', completed: false, impactScore: 2 }
          ],
          recommendations: [
            'Complete preview text optimization',
            'Design mobile-friendly email template',
            'Create 3-5 subject line variations'
          ]
        },
        {
          number: 3,
          name: 'Segmentation & Targeting',
          description: 'Audience segments and delivery optimization',
          isRequired: true,
          completionPercentage: 40,
          completedFields: 2,
          totalFields: 5,
          potentialGain: 10,
          fields: [
            { name: 'Segment Rules Defined', completed: true, impactScore: 3 },
            { name: 'Exclusion Lists Set', completed: true, impactScore: 2 },
            { name: 'Send Time Optimization', completed: false, impactScore: 4 },
            { name: 'Frequency Capping', completed: false, impactScore: 2 },
            { name: 'Dynamic Content Rules', completed: false, impactScore: 3 }
          ],
          recommendations: [
            'Implement send time optimization',
            'Set up frequency caps',
            'Create dynamic content blocks'
          ]
        },
        {
          number: 4,
          name: 'Advanced Optimization',
          description: 'Additional personalization and automation',
          isRequired: false,
          completionPercentage: 0,
          completedFields: 0,
          totalFields: 4,
          potentialGain: 8,
          fields: [
            { name: 'Personalization Tokens', completed: false, impactScore: 2 },
            { name: 'Behavioral Triggers', completed: false, impactScore: 3 },
            { name: 'Win-back Sequences', completed: false, impactScore: 2 },
            { name: 'Analytics Integration', completed: false, impactScore: 1 }
          ],
          recommendations: [
            'Add dynamic first-name personalization',
            'Set up behavioral email triggers',
            'Connect analytics for real-time tracking'
          ]
        }
      ]
    },
    'social-content': {
      readinessScore: 45,
      performanceImpact: 55,
      tierScore: 48,
      tierBreakdown: [
        {
          number: 1,
          name: 'Basic Information',
          description: 'Platform and audience setup',
          isRequired: true,
          completionPercentage: 100,
          completedFields: 5,
          totalFields: 5,
          potentialGain: 12,
          fields: [
            { name: 'Platform Selected', completed: true, impactScore: 2 },
            { name: 'Posting Schedule', completed: true, impactScore: 3 },
            { name: 'Target Audience', completed: true, impactScore: 4 },
            { name: 'Brand Voice Guide', completed: true, impactScore: 2 },
            { name: 'Success Metrics', completed: true, impactScore: 1 }
          ],
          recommendations: [
            'Lock in posting schedule',
            'Review audience demographics'
          ]
        },
        {
          number: 2,
          name: 'Content Creation',
          description: 'Post copy, images, and hashtags',
          isRequired: true,
          completionPercentage: 20,
          completedFields: 1,
          totalFields: 5,
          potentialGain: 20,
          fields: [
            { name: 'Post Copy Templates', completed: true, impactScore: 5 },
            { name: 'Visual Style Guide', completed: false, impactScore: 4 },
            { name: 'Image Library', completed: false, impactScore: 4 },
            { name: 'Hashtag Strategy', completed: false, impactScore: 3 },
            { name: 'Hook Formulas', completed: false, impactScore: 4 }
          ],
          recommendations: [
            'Create visual style guide with brand colors',
            'Build library of 20+ high-quality images',
            'Define 5-10 core hashtags per post'
          ]
        },
        {
          number: 3,
          name: 'Engagement Strategy',
          description: 'Community management and interaction',
          isRequired: true,
          completionPercentage: 0,
          completedFields: 0,
          totalFields: 4,
          potentialGain: 15,
          fields: [
            { name: 'Response Templates', completed: false, impactScore: 2 },
            { name: 'Engagement Schedule', completed: false, impactScore: 3 },
            { name: 'Community Guidelines', completed: false, impactScore: 2 },
            { name: 'Crisis Response Plan', completed: false, impactScore: 1 }
          ],
          recommendations: [
            'Create DM response templates',
            'Set daily engagement time blocks',
            'Define moderation guidelines'
          ]
        }
      ]
    },
    'landing-page': {
      readinessScore: 80,
      performanceImpact: 20,
      tierScore: 78,
      tierBreakdown: [
        {
          number: 1,
          name: 'Core Elements',
          description: 'Headline, hero image, and main CTA',
          isRequired: true,
          completionPercentage: 100,
          completedFields: 4,
          totalFields: 4,
          potentialGain: 8,
          fields: [
            { name: 'Headline Tested', completed: true, impactScore: 3 },
            { name: 'Hero Image', completed: true, impactScore: 2 },
            { name: 'Primary CTA', completed: true, impactScore: 3 },
            { name: 'Value Proposition Clear', completed: true, impactScore: 2 }
          ],
          recommendations: [
            'Monitor CTA click rates'
          ]
        },
        {
          number: 2,
          name: 'Social Proof & Trust',
          description: 'Testimonials, reviews, and credentials',
          isRequired: true,
          completionPercentage: 100,
          completedFields: 4,
          totalFields: 4,
          potentialGain: 7,
          fields: [
            { name: 'Customer Testimonials', completed: true, impactScore: 3 },
            { name: 'Social Proof Stats', completed: true, impactScore: 2 },
            { name: 'Trust Badges', completed: true, impactScore: 1 },
            { name: 'Case Studies', completed: true, impactScore: 3 }
          ],
          recommendations: [
            'Update with recent customer results'
          ]
        },
        {
          number: 3,
          name: 'Conversion Optimization',
          description: 'Form optimization and secondary CTAs',
          isRequired: false,
          completionPercentage: 50,
          completedFields: 2,
          totalFields: 4,
          potentialGain: 6,
          fields: [
            { name: 'Form Fields Optimized', completed: true, impactScore: 2 },
            { name: 'Scarcity Elements', completed: true, impactScore: 2 },
            { name: 'Payment Options', completed: false, impactScore: 2 },
            { name: 'Exit Intent Offer', completed: false, impactScore: 1 }
          ],
          recommendations: [
            'Add multiple payment options',
            'Set up exit-intent popup'
          ]
        }
      ]
    }
  }

  return data[taskId] || data['email-segment']
}

const taskData = computed(() => {
  if (!selectedTaskId.value) return {}
  return getTierData(selectedTaskId.value)
})

const tierBreakdown = computed(() => {
  return taskData.value.tierBreakdown || []
})

/**
 * Calculate correlation analysis data
 */
const correlationAnalysis = computed(() => {
  return [
    {
      tier: 'Tier 1 Only',
      description: 'Basic information complete',
      performanceGain: 12
    },
    {
      tier: 'Tiers 1-2 Complete',
      description: 'Basic + content/creative',
      performanceGain: 24
    },
    {
      tier: 'Tiers 1-3 Complete',
      description: 'All required tiers',
      performanceGain: 34
    },
    {
      tier: 'All Tiers Complete',
      description: 'Including optional tier 4',
      performanceGain: 42
    }
  ]
})

const totalPotentialGain = computed(() => {
  return tierBreakdown.value
    .filter(t => t.isRequired)
    .reduce((sum, t) => sum + t.potentialGain, 0)
})

/**
 * Action plan recommendations
 */
const actionPlan = computed(() => {
  return [
    {
      title: 'Complete Missing Tier 2 Fields',
      description: 'Finish content creative elements (preview text, CTA variations)',
      timeframe: '2-3 hours',
      impact: 12
    },
    {
      title: 'Implement Tier 3 Segmentation',
      description: 'Set up send-time optimization and frequency capping rules',
      timeframe: '1-2 days',
      impact: 10
    },
    {
      title: 'A/B Test Critical Elements',
      description: 'Run tests on subject lines, email copy, and CTA buttons',
      timeframe: '7 days',
      impact: 8
    },
    {
      title: 'Explore Advanced Options',
      description: 'Add personalization and behavioral automation',
      timeframe: '3-5 days',
      impact: 8
    }
  ]
})

/**
 * Toggle tier expansion
 */
const toggleTier = (idx) => {
  expandedTier.value = expandedTier.value === idx ? null : idx
}

/**
 * Get tier color class
 */
const getTierColor = (tierName) => {
  const colors = {
    'Basic Information': 'bg-blue-600',
    'Content & Creative': 'bg-purple-600',
    'Segmentation & Targeting': 'bg-green-600',
    'Advanced Optimization': 'bg-amber-600',
    'Core Elements': 'bg-blue-600',
    'Social Proof & Trust': 'bg-green-600',
    'Conversion Optimization': 'bg-purple-600',
    'Engagement Strategy': 'bg-orange-600'
  }
  return colors[tierName] || 'bg-gray-600'
}

/**
 * Get progress bar color
 */
const getProgressColor = (percentage) => {
  if (percentage === 100) return 'bg-green-500'
  if (percentage >= 75) return 'bg-blue-500'
  if (percentage >= 50) return 'bg-yellow-500'
  return 'bg-orange-500'
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
