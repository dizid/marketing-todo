<template>
  <div class="channel-optimizer">
    <!-- Tab Navigation -->
    <div class="tab-nav">
      <button
        class="tab-button"
        :class="{ active: activeTab === 'overview' }"
        @click="activeTab = 'overview'"
      >
        📊 Overview
      </button>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'playbooks' }"
        @click="activeTab = 'playbooks'"
        :disabled="selectedChannels.length === 0"
      >
        📚 Playbooks
        <span v-if="selectedChannels.length > 0" class="badge">{{ selectedChannels.length }}</span>
      </button>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'resources' }"
        @click="activeTab = 'resources'"
      >
        🛠️ Resources
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- TAB 1: OVERVIEW -->
      <div v-if="activeTab === 'overview'" class="overview-tab">
        <div class="overview-header">
          <h2>📊 Marketing Channel Optimizer</h2>
          <p class="subtitle">
            Learn how to optimize your marketing channels for better results.
            This is a learning tool - no data input required.
          </p>
        </div>

        <h3 class="section-title">Which Channels Are You Using?</h3>
        <p class="section-subtitle">Select all channels you want to learn about</p>

        <div class="channel-grid">
          <div
            v-for="channel in taskConfig.channels"
            :key="channel.id"
            class="channel-card"
            :class="{ selected: isChannelSelected(channel.id) }"
            @click="toggleChannel(channel.id)"
          >
            <div class="channel-icon">{{ channel.icon }}</div>
            <h4>{{ channel.name }}</h4>
            <p class="sub-channels">{{ channel.subChannels.join(', ') }}</p>
            <p class="quick-tip">{{ channel.quickTip }}</p>
            <button class="select-btn" :class="{ selected: isChannelSelected(channel.id) }">
              {{ isChannelSelected(channel.id) ? '✓ Selected' : 'Select' }}
            </button>
          </div>
        </div>

        <div v-if="selectedChannels.length > 0" class="overview-actions">
          <button class="btn-primary" @click="activeTab = 'playbooks'">
            View Optimization Playbooks →
          </button>
        </div>
      </div>

      <!-- TAB 2: PLAYBOOKS -->
      <div v-if="activeTab === 'playbooks'" class="playbooks-tab">
        <div class="playbooks-layout">
          <!-- Sidebar: Channel List -->
          <div class="playbooks-sidebar">
            <h3>Selected Channels</h3>
            <div
              v-for="channelId in selectedChannels"
              :key="channelId"
              class="sidebar-channel"
              :class="{ active: activePlaybook === channelId }"
              @click="activePlaybook = channelId"
            >
              <span class="sidebar-icon">{{ getChannel(channelId).icon }}</span>
              <span class="sidebar-name">{{ getChannel(channelId).name }}</span>
            </div>
          </div>

          <!-- Main Content: Playbook -->
          <div class="playbooks-content">
            <div v-if="activePlaybook && getChannel(activePlaybook)" class="playbook">
              <div class="playbook-header">
                <span class="playbook-icon">{{ getChannel(activePlaybook).icon }}</span>
                <h2>{{ getChannel(activePlaybook).name }} Optimization Playbook</h2>
              </div>

              <!-- Common Problems & Solutions -->
              <section class="playbook-section">
                <h3 class="section-heading">❌ Common Problems & Solutions</h3>
                <div
                  v-for="(problem, idx) in getChannel(activePlaybook).playbook.commonProblems"
                  :key="idx"
                  class="problem-block"
                >
                  <div class="problem-header" @click="toggleSection('problem-' + idx)">
                    <h4>{{ idx + 1 }}. {{ problem.title }}</h4>
                    <span class="expand-icon">{{ expandedSections['problem-' + idx] ? '▼' : '▶' }}</span>
                  </div>
                  <div v-show="expandedSections['problem-' + idx]" class="problem-content">
                    <p class="problem-cause"><strong>Cause:</strong> {{ problem.cause }}</p>
                    <div class="solution">
                      <strong>✅ Solution:</strong>
                      <ol>
                        <li v-for="(step, i) in problem.solution.steps" :key="i">{{ step }}</li>
                      </ol>
                      <p class="improvement-note">
                        <strong>Expected Improvement:</strong> {{ problem.solution.expectedImprovement }}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Optimization Checklist -->
              <section class="playbook-section">
                <h3 class="section-heading">✅ Optimization Checklist</h3>
                <div class="checklist">
                  <label
                    v-for="(item, idx) in getChannel(activePlaybook).playbook.checklist"
                    :key="idx"
                    class="checklist-item"
                  >
                    <input
                      type="checkbox"
                      v-model="checklistProgress[activePlaybook][idx]"
                      @change="saveProgress"
                    />
                    <span>{{ item }}</span>
                  </label>
                </div>
              </section>

              <!-- Industry Benchmarks -->
              <section class="playbook-section">
                <h3 class="section-heading">📊 Industry Benchmarks</h3>
                <div class="benchmarks-table">
                  <div class="benchmark-row header">
                    <div class="benchmark-metric">Metric</div>
                    <div class="benchmark-value">Average</div>
                    <div class="benchmark-value">Target</div>
                    <div class="benchmark-value">Excellent</div>
                  </div>
                  <div
                    v-for="(benchmark, idx) in getChannel(activePlaybook).playbook.benchmarks"
                    :key="idx"
                    class="benchmark-row"
                  >
                    <div class="benchmark-metric">{{ benchmark.metric }}</div>
                    <div class="benchmark-value">{{ benchmark.average }}</div>
                    <div class="benchmark-value target">{{ benchmark.target }}</div>
                    <div class="benchmark-value excellent">{{ benchmark.excellent }}</div>
                  </div>
                </div>
              </section>

              <!-- A/B Test Ideas -->
              <section class="playbook-section">
                <h3 class="section-heading">🧪 A/B Test Ideas</h3>
                <div class="ab-tests">
                  <div
                    v-for="(test, idx) in getChannel(activePlaybook).playbook.abTests"
                    :key="idx"
                    class="ab-test"
                    :class="'priority-' + test.priority.toLowerCase()"
                  >
                    <div class="test-priority">{{ test.priority }}</div>
                    <div class="test-content">
                      <h4>{{ test.testName }}</h4>
                      <p class="test-description">{{ test.description }}</p>
                      <p class="test-example"><em>{{ test.example }}</em></p>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Recommended Tools -->
              <section class="playbook-section">
                <h3 class="section-heading">🛠️ Recommended Tools</h3>
                <div
                  v-for="(toolCategory, idx) in getChannel(activePlaybook).playbook.tools"
                  :key="idx"
                  class="tool-category"
                >
                  <h4 class="tool-category-name">{{ toolCategory.category }}</h4>
                  <div class="tool-list">
                    <div v-for="(tool, i) in toolCategory.items" :key="i" class="tool-item">
                      <div class="tool-header">
                        <strong>{{ tool.name }}</strong>
                        <span class="tool-price">{{ tool.price }}</span>
                      </div>
                      <p class="tool-description">{{ tool.description }}</p>
                      <a :href="tool.url" target="_blank" class="tool-link">View Tool →</a>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Learning Resources -->
              <section class="playbook-section">
                <h3 class="section-heading">📚 Learning Resources</h3>
                <div class="resource-list">
                  <div
                    v-for="(resource, idx) in getChannel(activePlaybook).playbook.resources"
                    :key="idx"
                    class="resource-item"
                  >
                    <div class="resource-type">{{ resource.type }}</div>
                    <div class="resource-content">
                      <strong>{{ resource.name }}</strong>
                      <span class="resource-price">{{ resource.price }}</span>
                      <a :href="resource.url" target="_blank" class="resource-link">Access →</a>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: RESOURCES -->
      <div v-if="activeTab === 'resources'" class="resources-tab">
        <div class="resources-header">
          <h2>🛠️ Marketing Optimization Tools</h2>
          <p class="subtitle">A curated list of the best tools for optimizing each channel</p>
        </div>

        <div class="resources-content">
          <!-- Analytics & Tracking -->
          <section class="resource-category">
            <h3>Analytics & Tracking</h3>
            <div class="resource-grid">
              <div class="resource-card">
                <h4>Google Analytics</h4>
                <p class="resource-price">Free</p>
                <p>Track website traffic, conversions, and user behavior</p>
                <a href="https://analytics.google.com" target="_blank" class="resource-btn">View Tool →</a>
              </div>
              <div class="resource-card">
                <h4>Mixpanel</h4>
                <p class="resource-price">$0-$999/mo</p>
                <p>Product analytics, funnels, retention</p>
                <a href="https://mixpanel.com" target="_blank" class="resource-btn">View Tool →</a>
              </div>
              <div class="resource-card">
                <h4>Hotjar</h4>
                <p class="resource-price">$39-$389/mo</p>
                <p>Heatmaps, session recordings, feedback polls</p>
                <a href="https://hotjar.com" target="_blank" class="resource-btn">View Tool →</a>
              </div>
            </div>
          </section>

          <!-- Paid Advertising -->
          <section class="resource-category">
            <h3>Paid Advertising</h3>
            <div class="resource-grid">
              <div class="resource-card">
                <h4>Google Ads Editor</h4>
                <p class="resource-price">Free</p>
                <p>Bulk management for Google Ads</p>
                <a href="https://ads.google.com/home/tools/ads-editor/" target="_blank" class="resource-btn">View Tool →</a>
              </div>
              <div class="resource-card">
                <h4>Meta Ads Manager</h4>
                <p class="resource-price">Free</p>
                <p>Manage Facebook & Instagram ads</p>
                <a href="https://business.facebook.com/adsmanager" target="_blank" class="resource-btn">View Tool →</a>
              </div>
              <div class="resource-card">
                <h4>AdEspresso</h4>
                <p class="resource-price">$49-$259/mo</p>
                <p>Simplify Meta ads A/B testing</p>
                <a href="https://adespresso.com" target="_blank" class="resource-btn">View Tool →</a>
              </div>
            </div>
          </section>

          <!-- SEO & Content -->
          <section class="resource-category">
            <h3>SEO & Content</h3>
            <div class="resource-grid">
              <div class="resource-card">
                <h4>Ahrefs</h4>
                <p class="resource-price">$99-$999/mo</p>
                <p>Backlinks, keywords, competitor analysis</p>
                <a href="https://ahrefs.com" target="_blank" class="resource-btn">View Tool →</a>
              </div>
              <div class="resource-card">
                <h4>SEMrush</h4>
                <p class="resource-price">$119-$449/mo</p>
                <p>All-in-one SEO and content toolkit</p>
                <a href="https://semrush.com" target="_blank" class="resource-btn">View Tool →</a>
              </div>
              <div class="resource-card">
                <h4>Grammarly</h4>
                <p class="resource-price">Free-$30/mo</p>
                <p>Writing assistant for content quality</p>
                <a href="https://grammarly.com" target="_blank" class="resource-btn">View Tool →</a>
              </div>
            </div>
          </section>

          <!-- Email Marketing -->
          <section class="resource-category">
            <h3>Email Marketing</h3>
            <div class="resource-grid">
              <div class="resource-card">
                <h4>Mailchimp</h4>
                <p class="resource-price">Free-$350/mo</p>
                <p>Email campaigns, automation, landing pages</p>
                <a href="https://mailchimp.com" target="_blank" class="resource-btn">View Tool →</a>
              </div>
              <div class="resource-card">
                <h4>ConvertKit</h4>
                <p class="resource-price">$29-$59/mo</p>
                <p>Email for creators and bloggers</p>
                <a href="https://convertkit.com" target="_blank" class="resource-btn">View Tool →</a>
              </div>
              <div class="resource-card">
                <h4>Really Good Emails</h4>
                <p class="resource-price">Free</p>
                <p>Email design inspiration library</p>
                <a href="https://reallygoodemails.com" target="_blank" class="resource-btn">View Tool →</a>
              </div>
            </div>
          </section>

          <!-- Conversion Optimization -->
          <section class="resource-category">
            <h3>Conversion Optimization</h3>
            <div class="resource-grid">
              <div class="resource-card">
                <h4>Unbounce</h4>
                <p class="resource-price">$90-$575/mo</p>
                <p>Landing page builder with A/B testing</p>
                <a href="https://unbounce.com" target="_blank" class="resource-btn">View Tool →</a>
              </div>
              <div class="resource-card">
                <h4>VWO</h4>
                <p class="resource-price">$199-$1,099/mo</p>
                <p>A/B testing and personalization</p>
                <a href="https://vwo.com" target="_blank" class="resource-btn">View Tool →</a>
              </div>
              <div class="resource-card">
                <h4>Optimizely</h4>
                <p class="resource-price">$50k+/year</p>
                <p>Enterprise A/B testing platform</p>
                <a href="https://optimizely.com" target="_blank" class="resource-btn">View Tool →</a>
              </div>
            </div>
          </section>

          <!-- Learning Resources -->
          <section class="resource-category">
            <h3>Learning Resources</h3>
            <div class="resource-grid">
              <div class="resource-card">
                <h4>Google Skillshop</h4>
                <p class="resource-price">Free</p>
                <p>Official Google Ads & Analytics courses</p>
                <a href="https://skillshop.withgoogle.com" target="_blank" class="resource-btn">View Tool →</a>
              </div>
              <div class="resource-card">
                <h4>HubSpot Academy</h4>
                <p class="resource-price">Free</p>
                <p>Inbound marketing certifications</p>
                <a href="https://academy.hubspot.com" target="_blank" class="resource-btn">View Tool →</a>
              </div>
              <div class="resource-card">
                <h4>Coursera - Digital Marketing</h4>
                <p class="resource-price">Free-$49</p>
                <p>University courses on marketing</p>
                <a href="https://coursera.org" target="_blank" class="resource-btn">View Tool →</a>
              </div>
              <div class="resource-card">
                <h4>Neil Patel's Blog</h4>
                <p class="resource-price">Free</p>
                <p>SEO, content, and growth marketing</p>
                <a href="https://neilpatel.com/blog" target="_blank" class="resource-btn">View Tool →</a>
              </div>
              <div class="resource-card">
                <h4>Marketing School Podcast</h4>
                <p class="resource-price">Free</p>
                <p>Daily 10-min marketing tips</p>
                <a href="https://marketingschool.io" target="_blank" class="resource-btn">View Tool →</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Marketing Channel Optimizer - Educational Mini-App
 *
 * 3-tab interface:
 * - Tab 1: Overview (select channels)
 * - Tab 2: Playbooks (detailed optimization guides)
 * - Tab 3: Resources (curated tool library)
 *
 * No AI, no data input - pure educational content
 * Saves selected channels and checklist progress to database
 */

import { ref, computed, onMounted, watch } from 'vue'
import { useProjectStore } from '@/stores/projectStore'

// Props and emits
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

const emit = defineEmits(['save'])

const projectStore = useProjectStore()

// State
const activeTab = ref('overview')
const selectedChannels = ref([])
const activePlaybook = ref(null)
const expandedSections = ref({})
const checklistProgress = ref({})

// Initialize checklist progress for all channels
const initializeChecklistProgress = () => {
  const progress = {}
  props.taskConfig.channels.forEach(channel => {
    progress[channel.id] = Array(channel.playbook.checklist.length).fill(false)
  })
  return progress
}

// Load saved data on mount
onMounted(() => {
  if (props.taskData && Object.keys(props.taskData).length > 0) {
    selectedChannels.value = props.taskData.selectedChannels || []
    activeTab.value = props.taskData.activeTab || 'overview'
    activePlaybook.value = props.taskData.activePlaybook || selectedChannels.value[0] || null
    checklistProgress.value = props.taskData.checklistProgress || initializeChecklistProgress()
  } else {
    checklistProgress.value = initializeChecklistProgress()
  }

  // Auto-select first channel if channels are selected but no active playbook
  if (selectedChannels.value.length > 0 && !activePlaybook.value) {
    activePlaybook.value = selectedChannels.value[0]
  }
})

// Auto-save on data change
watch([activeTab, selectedChannels, activePlaybook, checklistProgress], () => {
  saveProgress()
}, { deep: true })

// Methods
const saveProgress = () => {
  emit('save', {
    selectedChannels: selectedChannels.value,
    activeTab: activeTab.value,
    activePlaybook: activePlaybook.value,
    checklistProgress: checklistProgress.value
  })
}

const toggleChannel = (channelId) => {
  const index = selectedChannels.value.indexOf(channelId)
  if (index > -1) {
    selectedChannels.value.splice(index, 1)
    // If removing active playbook, switch to first available
    if (activePlaybook.value === channelId) {
      activePlaybook.value = selectedChannels.value[0] || null
    }
  } else {
    selectedChannels.value.push(channelId)
    // Set as active playbook if first selection
    if (!activePlaybook.value) {
      activePlaybook.value = channelId
    }
  }
}

const isChannelSelected = (channelId) => {
  return selectedChannels.value.includes(channelId)
}

const getChannel = (channelId) => {
  return props.taskConfig.channels.find(c => c.id === channelId)
}

const toggleSection = (sectionKey) => {
  expandedSections.value[sectionKey] = !expandedSections.value[sectionKey]
}
</script>

<style scoped>
.channel-optimizer {
  max-width: 1400px;
  margin: 0 auto;
}

/* Tab Navigation */
.tab-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  border-bottom: 2px solid #e5e7eb;
}

.tab-button {
  position: relative;
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 15px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-button:hover:not(:disabled) {
  color: #4f46e5;
  background: #f9fafb;
}

.tab-button.active {
  color: #4f46e5;
  border-bottom-color: #4f46e5;
}

.tab-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-button .badge {
  display: inline-block;
  background: #4f46e5;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 6px;
}

/* Tab Content */
.tab-content {
  min-height: 500px;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* OVERVIEW TAB */
.overview-header {
  text-align: center;
  margin-bottom: 48px;
}

.overview-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 16px;
  color: #6b7280;
  max-width: 700px;
  margin: 0 auto;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.section-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 32px;
}

.channel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.channel-card {
  background: white;
  border: 3px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.channel-card:hover {
  border-color: #a5b4fc;
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.1);
}

.channel-card.selected {
  border-color: #4f46e5;
  background: #eef2ff;
}

.channel-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.channel-card h4 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.sub-channels {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 12px;
}

.quick-tip {
  font-size: 13px;
  color: #4b5563;
  background: #f3f4f6;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.select-btn {
  width: 100%;
  padding: 10px;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s;
}

.select-btn:hover {
  background: #e5e7eb;
}

.select-btn.selected {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
}

.overview-actions {
  text-align: center;
}

.btn-primary {
  padding: 14px 32px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

/* PLAYBOOKS TAB */
.playbooks-layout {
  display: flex;
  gap: 24px;
}

.playbooks-sidebar {
  width: 220px;
  flex-shrink: 0;
}

.playbooks-sidebar h3 {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.sidebar-channel {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 4px;
}

.sidebar-channel:hover {
  background: #f3f4f6;
}

.sidebar-channel.active {
  background: #eef2ff;
  color: #4f46e5;
  font-weight: 600;
}

.sidebar-icon {
  font-size: 24px;
}

.sidebar-name {
  font-size: 14px;
}

.playbooks-content {
  flex: 1;
  overflow-y: auto;
}

.playbook {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 32px;
}

.playbook-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #e5e7eb;
}

.playbook-icon {
  font-size: 48px;
}

.playbook-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.playbook-section {
  margin-bottom: 48px;
}

.section-heading {
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f3f4f6;
}

/* Common Problems */
.problem-block {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
}

.problem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.3s;
}

.problem-header:hover {
  background: #f3f4f6;
}

.problem-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.expand-icon {
  color: #6b7280;
  font-size: 14px;
}

.problem-content {
  padding: 0 20px 20px;
}

.problem-cause {
  color: #6b7280;
  margin-bottom: 16px;
}

.solution {
  background: white;
  border-left: 4px solid #10b981;
  padding: 16px;
  border-radius: 4px;
}

.solution ol {
  margin: 12px 0 12px 24px;
}

.solution li {
  margin-bottom: 8px;
  color: #4b5563;
}

.improvement-note {
  background: #d1fae5;
  padding: 8px 12px;
  border-radius: 4px;
  color: #047857;
  font-size: 14px;
  margin-top: 12px;
}

/* Checklist */
.checklist {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.checklist-item:hover {
  border-color: #a5b4fc;
  background: white;
}

.checklist-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  cursor: pointer;
}

.checklist-item span {
  flex: 1;
  color: #4b5563;
  line-height: 1.6;
}

/* Benchmarks */
.benchmarks-table {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.benchmark-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 16px;
  align-items: center;
}

.benchmark-row.header {
  background: #f3f4f6;
  font-weight: 600;
  color: #1f2937;
}

.benchmark-row:not(.header) {
  border-top: 1px solid #e5e7eb;
}

.benchmark-metric {
  font-size: 14px;
  color: #1f2937;
}

.benchmark-value {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
}

.benchmark-value.target {
  color: #0891b2;
  font-weight: 600;
}

.benchmark-value.excellent {
  color: #10b981;
  font-weight: 600;
}

/* A/B Tests */
.ab-tests {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ab-test {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
}

.ab-test.priority-high {
  border-left: 4px solid #ef4444;
}

.ab-test.priority-medium {
  border-left: 4px solid #f59e0b;
}

.ab-test.priority-low {
  border-left: 4px solid #6b7280;
}

.test-priority {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  min-width: 80px;
}

.ab-test.priority-high .test-priority {
  color: #ef4444;
}

.ab-test.priority-medium .test-priority {
  color: #f59e0b;
}

.test-content {
  flex: 1;
}

.test-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
}

.test-description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 6px;
}

.test-example {
  font-size: 13px;
  color: #4b5563;
  background: white;
  padding: 8px 12px;
  border-radius: 4px;
}

/* Tools */
.tool-category {
  margin-bottom: 32px;
}

.tool-category-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.tool-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tool-item {
  padding: 16px;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.tool-header strong {
  font-size: 15px;
  color: #1f2937;
}

.tool-price {
  font-size: 13px;
  color: #10b981;
  font-weight: 600;
}

.tool-description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.tool-link {
  display: inline-block;
  color: #4f46e5;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s;
}

.tool-link:hover {
  color: #4338ca;
  text-decoration: underline;
}

/* Resources */
.resource-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
}

.resource-type {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  min-width: 70px;
  text-align: center;
}

.resource-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.resource-content strong {
  flex: 1;
  font-size: 14px;
  color: #1f2937;
}

.resource-price {
  font-size: 13px;
  color: #10b981;
  font-weight: 600;
}

.resource-link {
  color: #4f46e5;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s;
}

.resource-link:hover {
  color: #4338ca;
  text-decoration: underline;
}

/* RESOURCES TAB */
.resources-header {
  text-align: center;
  margin-bottom: 48px;
}

.resources-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.resource-category {
  margin-bottom: 48px;
}

.resource-category h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.resource-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s;
}

.resource-card:hover {
  border-color: #4f46e5;
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.1);
}

.resource-card h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.resource-card .resource-price {
  display: inline-block;
  background: #d1fae5;
  color: #047857;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.resource-card p {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.6;
}

.resource-btn {
  display: inline-block;
  padding: 8px 16px;
  background: #4f46e5;
  color: white;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s;
}

.resource-btn:hover {
  background: #4338ca;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 1024px) {
  .playbooks-layout {
    flex-direction: column;
  }

  .playbooks-sidebar {
    width: 100%;
    display: flex;
    gap: 8px;
    overflow-x: auto;
  }

  .sidebar-channel {
    flex-shrink: 0;
  }
}

@media (max-width: 768px) {
  .channel-grid {
    grid-template-columns: 1fr;
  }

  .benchmark-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .benchmark-row .benchmark-value {
    text-align: left;
  }

  .resource-grid {
    grid-template-columns: 1fr;
  }
}
</style>
