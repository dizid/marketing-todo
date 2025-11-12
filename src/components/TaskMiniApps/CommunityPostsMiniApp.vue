<template>
  <div class="community-posts-app">
    <!-- Tab Navigation -->
    <div class="tab-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['tab-button', { 'active': activeTab === tab.id }]"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Tab 1: Overview -->
      <div v-show="activeTab === 'overview'" class="tab-panel">
        <div class="overview-header">
          <h2 class="section-title">🌐 Community Posting Guide</h2>
          <p class="section-description">
            Learn how to post in 10+ communities. One successful post can drive 500+ signups.
            Each community has unique norms - this guide teaches you the right approach.
          </p>
        </div>

        <!-- Community Selection Grid -->
        <div class="communities-grid">
          <div
            v-for="community in communities"
            :key="community.id"
            @click="selectCommunity(community.id)"
            :class="['community-card', { 'selected': selectedCommunities.includes(community.id) }]"
          >
            <div class="community-icon">{{ community.icon }}</div>
            <h3 class="community-name">{{ community.name }}</h3>
            <p class="community-description">{{ community.description }}</p>
            <div class="community-meta">
              <span class="meta-badge" :class="`badge-${community.difficulty.toLowerCase()}`">
                {{ community.difficulty }}
              </span>
              <span class="meta-category">{{ community.category }}</span>
            </div>
            <div v-if="selectedCommunities.includes(community.id)" class="selected-badge">
              ✓ Selected
            </div>
          </div>
        </div>

        <div class="overview-footer">
          <div class="tip-box">
            <div class="tip-icon">💡</div>
            <div class="tip-content">
              <strong>Pro Tip:</strong> Start with 2-3 communities. Master those before expanding.
              Focus on communities where your target audience actually hangs out.
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Community Guides -->
      <div v-show="activeTab === 'guides'" class="tab-panel">
        <div class="guides-header">
          <h2 class="section-title">📚 Community-Specific Guides</h2>
          <p class="section-description">
            Step-by-step posting guides, do's/don'ts, templates, and engagement tips for each community.
          </p>
        </div>

        <!-- Community Guide Sections -->
        <div class="guides-container">
          <div
            v-for="community in communities"
            :key="`guide-${community.id}`"
            class="guide-section"
          >
            <!-- Guide Header (Clickable) -->
            <button
              @click="toggleGuide(community.id)"
              class="guide-header"
            >
              <div class="guide-header-left">
                <span class="guide-icon">{{ community.icon }}</span>
                <div class="guide-title-group">
                  <h3 class="guide-title">{{ community.name }}</h3>
                  <p class="guide-subtitle">{{ community.description }}</p>
                </div>
              </div>
              <div class="guide-header-right">
                <span class="meta-badge" :class="`badge-${community.difficulty.toLowerCase()}`">
                  {{ community.difficulty }}
                </span>
                <span class="expand-icon">{{ expandedGuides[community.id] ? '−' : '+' }}</span>
              </div>
            </button>

            <!-- Guide Content (Expandable) -->
            <div v-show="expandedGuides[community.id]" class="guide-content">
              <!-- Posting Guide Steps -->
              <div class="guide-subsection">
                <h4 class="subsection-title">
                  <span class="subsection-icon">📝</span>
                  Step-by-Step Posting Guide
                </h4>
                <div class="steps-list">
                  <div
                    v-for="(step, idx) in community.postingGuide.steps"
                    :key="`step-${idx}`"
                    class="step-item"
                  >
                    <div class="step-number">{{ idx + 1 }}</div>
                    <div class="step-content">
                      <h5 class="step-title">{{ step.title }}</h5>
                      <p class="step-description">{{ step.description }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Do's and Don'ts -->
              <div class="guide-subsection">
                <h4 class="subsection-title">
                  <span class="subsection-icon">✅</span>
                  Do's and Don'ts
                </h4>
                <div class="dos-donts-grid">
                  <!-- Do's -->
                  <div class="dos-column">
                    <h5 class="column-title do-title">✓ Do:</h5>
                    <ul class="dos-list">
                      <li v-for="(item, idx) in community.postingGuide.dos" :key="`do-${idx}`">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <!-- Don'ts -->
                  <div class="donts-column">
                    <h5 class="column-title dont-title">✗ Don't:</h5>
                    <ul class="donts-list">
                      <li v-for="(item, idx) in community.postingGuide.donts" :key="`dont-${idx}`">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Engagement Tips -->
              <div class="guide-subsection">
                <h4 class="subsection-title">
                  <span class="subsection-icon">💬</span>
                  Engagement Tips
                </h4>
                <ul class="tips-list">
                  <li v-for="(tip, idx) in community.postingGuide.engagementTips" :key="`tip-${idx}`">
                    {{ tip }}
                  </li>
                </ul>
              </div>

              <!-- Post Templates -->
              <div class="guide-subsection">
                <h4 class="subsection-title">
                  <span class="subsection-icon">📋</span>
                  Post Templates
                </h4>
                <div class="templates-container">
                  <div
                    v-for="(template, idx) in community.postTemplates"
                    :key="`template-${idx}`"
                    :class="['template-card', `template-${template.quality}`]"
                  >
                    <div class="template-header">
                      <span :class="['quality-badge', `quality-${template.quality}`]">
                        {{ template.quality === 'good' ? '✓ Good Example' : '✗ Bad Example' }}
                      </span>
                    </div>
                    <div class="template-content">
                      <div class="template-title">{{ template.title }}</div>
                      <div class="template-body">{{ template.body }}</div>
                    </div>
                    <div class="template-footer">
                      <strong>Why {{ template.quality === 'good' ? 'this works' : 'this fails' }}:</strong>
                      {{ template.why }}
                    </div>
                    <button
                      v-if="template.quality === 'good'"
                      @click="copyTemplate(template)"
                      class="copy-button"
                    >
                      📋 Copy Template
                    </button>
                  </div>
                </div>
              </div>

              <!-- Headline Formulas -->
              <div class="guide-subsection">
                <h4 class="subsection-title">
                  <span class="subsection-icon">✨</span>
                  Headline Formulas
                </h4>
                <div class="formulas-grid">
                  <div
                    v-for="(formula, idx) in community.headlineFormulas"
                    :key="`formula-${idx}`"
                    class="formula-card"
                  >
                    <span class="formula-icon">💡</span>
                    <span class="formula-text">{{ formula }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 3: Resources -->
      <div v-show="activeTab === 'resources'" class="tab-panel">
        <div class="resources-header">
          <h2 class="section-title">🛠️ Scheduling Tools</h2>
          <p class="section-description">
            Tools to help you schedule and manage posts across multiple communities.
          </p>
        </div>

        <!-- Scheduling Tools Grid -->
        <div class="tools-grid">
          <div
            v-for="tool in schedulingTools"
            :key="tool.name"
            class="tool-card"
          >
            <div class="tool-header">
              <h3 class="tool-name">{{ tool.name }}</h3>
              <span class="tool-pricing">{{ tool.pricing }}</span>
            </div>
            <p class="tool-best-for">
              <strong>Best for:</strong> {{ tool.bestFor }}
            </p>
            <ul class="tool-features">
              <li v-for="(feature, idx) in tool.features" :key="`feature-${idx}`">
                ✓ {{ feature }}
              </li>
            </ul>
            <a
              :href="tool.url"
              target="_blank"
              rel="noopener"
              class="tool-link"
            >
              Visit {{ tool.name }} →
            </a>
          </div>
        </div>

        <!-- General Tips -->
        <div class="resources-tips">
          <div class="tip-box">
            <h4 class="tip-box-title">💡 Scheduling Tips</h4>
            <ul class="tip-list">
              <li><strong>Plan ahead:</strong> Batch your community posts. Write 3-5 posts in one sitting, schedule them throughout the week.</li>
              <li><strong>Optimize timing:</strong> Post when your audience is most active. For most communities, this is 8-10am ET or 2-4pm ET on weekdays.</li>
              <li><strong>Don't over-automate:</strong> Schedule the post, but engage in real-time. Reply to comments manually within the first hour.</li>
              <li><strong>Track what works:</strong> Note which communities drive the most traffic. Double down on those.</li>
              <li><strong>Respect community norms:</strong> Never use automation to spam or cross-post identical content.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { communityPostsTask } from '@/configs/communityPosts.config'

const props = defineProps({
  taskConfig: { type: Object, required: true },
  taskData: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['save'])

// Data
const activeTab = ref('overview')
const selectedCommunities = ref(props.taskData?.selectedCommunities || [])
const expandedGuides = ref({})

const tabs = [
  { id: 'overview', label: 'Overview', icon: '🌐' },
  { id: 'guides', label: 'Community Guides', icon: '📚' },
  { id: 'resources', label: 'Resources', icon: '🛠️' }
]

const communities = computed(() => communityPostsTask.communities)
const schedulingTools = computed(() => communityPostsTask.schedulingTools)

// Methods
const selectCommunity = (communityId) => {
  const index = selectedCommunities.value.indexOf(communityId)
  if (index > -1) {
    selectedCommunities.value.splice(index, 1)
  } else {
    selectedCommunities.value.push(communityId)
  }
  saveData()
}

const toggleGuide = (communityId) => {
  expandedGuides.value[communityId] = !expandedGuides.value[communityId]
}

const copyTemplate = async (template) => {
  const text = `${template.title}\n\n${template.body}`
  try {
    await navigator.clipboard.writeText(text)
    alert('Template copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const saveData = () => {
  emit('save', {
    selectedCommunities: selectedCommunities.value,
    activeTab: activeTab.value
  })
}
</script>

<style scoped>
.community-posts-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

/* Tab Navigation */
.tab-nav {
  display: flex;
  gap: 8px;
  padding: 16px;
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
  border-radius: 12px 12px 0 0;
}

.tab-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.tab-button:hover {
  border-color: #6366f1;
  background: #eef2ff;
}

.tab-button.active {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  border-color: #4f46e5;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.3);
}

.tab-icon {
  font-size: 18px;
}

.tab-label {
  font-size: 14px;
}

/* Tab Content */
.tab-content {
  background: white;
  border-radius: 0 0 12px 12px;
  min-height: 500px;
}

.tab-panel {
  padding: 32px;
}

/* Overview Tab */
.overview-header {
  margin-bottom: 32px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;
}

.section-description {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.communities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.community-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.community-card:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
  transform: translateY(-2px);
}

.community-card.selected {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.community-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.community-name {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.community-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.community-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.meta-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-beginner {
  background: #dbeafe;
  color: #1e40af;
}

.badge-intermediate {
  background: #fef3c7;
  color: #92400e;
}

.badge-advanced {
  background: #fee2e2;
  color: #991b1b;
}

.meta-category {
  font-size: 12px;
  color: #9ca3af;
}

.selected-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #10b981;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.overview-footer {
  margin-top: 32px;
}

.tip-box {
  display: flex;
  gap: 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #fbbf24;
  border-radius: 12px;
  padding: 20px;
}

.tip-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.tip-content {
  font-size: 14px;
  color: #78350f;
  line-height: 1.6;
}

.tip-content strong {
  color: #78350f;
  font-weight: 600;
}

/* Guides Tab */
.guides-header {
  margin-bottom: 32px;
}

.guides-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.guide-section {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.guide-section:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}

.guide-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.guide-header:hover {
  background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
}

.guide-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.guide-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.guide-title-group {
  flex: 1;
}

.guide-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.guide-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.guide-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.expand-icon {
  font-size: 24px;
  font-weight: 300;
  color: #6366f1;
}

.guide-content {
  padding: 32px 24px;
  background: white;
}

.guide-subsection {
  margin-bottom: 32px;
}

.guide-subsection:last-child {
  margin-bottom: 0;
}

.subsection-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.subsection-icon {
  font-size: 20px;
}

/* Steps List */
.steps-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.step-number {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 16px;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.step-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* Do's and Don'ts */
.dos-donts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.column-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  padding: 8px 12px;
  border-radius: 8px;
}

.do-title {
  background: #d1fae5;
  color: #065f46;
}

.dont-title {
  background: #fee2e2;
  color: #991b1b;
}

.dos-list,
.donts-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dos-list li {
  padding-left: 28px;
  position: relative;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

.dos-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: 700;
  font-size: 16px;
}

.donts-list li {
  padding-left: 28px;
  position: relative;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

.donts-list li::before {
  content: '✗';
  position: absolute;
  left: 0;
  color: #ef4444;
  font-weight: 700;
  font-size: 16px;
}

/* Tips List */
.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tips-list li {
  padding-left: 28px;
  position: relative;
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
}

.tips-list li::before {
  content: '💬';
  position: absolute;
  left: 0;
  font-size: 16px;
}

/* Templates */
.templates-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.template-card {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.template-good {
  border-color: #10b981;
}

.template-bad {
  border-color: #ef4444;
}

.template-header {
  padding: 12px 16px;
  background: #f9fafb;
}

.quality-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.quality-good {
  background: #d1fae5;
  color: #065f46;
}

.quality-bad {
  background: #fee2e2;
  color: #991b1b;
}

.template-content {
  padding: 16px;
  background: white;
}

.template-title {
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
  font-size: 15px;
}

.template-body {
  font-size: 13px;
  color: #374151;
  line-height: 1.6;
  white-space: pre-wrap;
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #6366f1;
}

.template-footer {
  padding: 12px 16px;
  background: #fffbeb;
  border-top: 1px solid #fbbf24;
  font-size: 13px;
  color: #78350f;
  line-height: 1.5;
}

.template-footer strong {
  color: #78350f;
}

.copy-button {
  width: 100%;
  padding: 10px;
  background: #6366f1;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s;
}

.copy-button:hover {
  background: #4f46e5;
}

/* Headline Formulas */
.formulas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.formula-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #fbbf24;
  border-radius: 8px;
  transition: all 0.2s;
}

.formula-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
}

.formula-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.formula-text {
  font-size: 14px;
  color: #78350f;
  line-height: 1.5;
  font-weight: 500;
}

/* Resources Tab */
.resources-header {
  margin-bottom: 32px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.tool-card {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  background: white;
  transition: all 0.3s;
}

.tool-card:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
  transform: translateY(-2px);
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.tool-name {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.tool-pricing {
  font-size: 14px;
  font-weight: 600;
  color: #6366f1;
}

.tool-best-for {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.tool-features {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.tool-features li {
  font-size: 13px;
  color: #374151;
  padding: 6px 0;
  line-height: 1.4;
}

.tool-link {
  display: block;
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s;
}

.tool-link:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
}

/* Resources Tips */
.resources-tips {
  margin-top: 32px;
}

.tip-box-title {
  font-size: 18px;
  font-weight: 600;
  color: #78350f;
  margin: 0 0 16px 0;
}

.tip-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-list li {
  font-size: 14px;
  color: #78350f;
  line-height: 1.6;
}

.tip-list strong {
  font-weight: 600;
  color: #78350f;
}

/* Responsive */
@media (max-width: 768px) {
  .tab-panel {
    padding: 20px;
  }

  .tab-label {
    display: none;
  }

  .communities-grid {
    grid-template-columns: 1fr;
  }

  .dos-donts-grid {
    grid-template-columns: 1fr;
  }

  .formulas-grid {
    grid-template-columns: 1fr;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>
