<template>
  <div class="write-blog-app">
    <!-- Header -->
    <div class="header">
      <h2 class="title">📝 Write Blog Post</h2>
      <p class="subtitle">AI-guided structure. You write the content. Clear outline keeps you on track.</p>
    </div>

    <!-- Step 1: Research Setup -->
    <div v-if="!outline || !Object.keys(outline).length" class="setup-section">
      <div class="setup-card">
        <h3 class="setup-title">📚 Step 1: Research Setup</h3>
        <p class="setup-description">Tell us about your blog post. We'll generate an outline and talking points.</p>

        <!-- Topic -->
        <div class="form-group">
          <label class="form-label">Blog Topic / Title *</label>
          <input
            v-model="formData.topic"
            type="text"
            placeholder="e.g., How to Build a SaaS Product from Scratch"
            class="form-input"
          />
        </div>

        <!-- Target Audience -->
        <div class="form-group">
          <label class="form-label">Target Audience *</label>
          <input
            v-model="formData.audience"
            type="text"
            placeholder="e.g., Startup founders, SaaS entrepreneurs"
            class="form-input"
          />
        </div>

        <!-- Keywords -->
        <div class="form-group">
          <label class="form-label">Keywords (comma-separated)</label>
          <input
            v-model="formData.keywords"
            type="text"
            placeholder="e.g., SaaS, product development, startup"
            class="form-input"
          />
          <p class="form-hint">These will be naturally incorporated throughout your blog.</p>
        </div>

        <!-- Tone -->
        <div class="form-group">
          <label class="form-label">Writing Tone</label>
          <select v-model="formData.tone" class="form-input">
            <option value="professional">Professional / Corporate</option>
            <option value="conversational">Conversational / Friendly</option>
            <option value="educational">Educational / How-to</option>
            <option value="narrative">Narrative / Storytelling</option>
            <option value="thought-leadership">Thought Leadership / Opinion</option>
          </select>
        </div>

        <!-- Word Count -->
        <div class="form-group">
          <label class="form-label">Target Word Count</label>
          <select v-model="formData.wordCount" class="form-input">
            <option value="short">Short (500-800 words)</option>
            <option value="medium">Medium (1000-1500 words)</option>
            <option value="long">Long (2000-3000 words)</option>
            <option value="comprehensive">Comprehensive (3000+ words)</option>
          </select>
        </div>

        <!-- Error -->
        <div v-if="error" class="error-message">{{ error }}</div>

        <!-- Generate Button -->
        <button
          @click="generateOutline"
          :disabled="isGenerating || !formData.topic.trim() || !formData.audience.trim()"
          class="btn btn-primary"
        >
          <span v-if="!isGenerating">🚀 Generate Outline & Start Writing</span>
          <span v-else>⏳ Generating outline...</span>
        </button>
      </div>
    </div>

    <!-- Step 2: Writing Interface -->
    <div v-else class="writing-section">
      <!-- Writing Header -->
      <div class="writing-header">
        <div class="writing-header-info">
          <h3 class="writing-title">{{ formData.topic }}</h3>
          <p class="writing-subtitle">{{ formData.audience }} • {{ formData.tone }}</p>
        </div>
        <div class="writing-header-stats">
          <div class="stat">
            <span class="stat-label">Word Count</span>
            <span class="stat-value">{{ totalWordCount }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Sections</span>
            <span class="stat-value">{{ completedSections }} / {{ sections.length }}</span>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <p class="progress-text">{{ progressPercentage }}% Complete</p>
      </div>

      <!-- Main Writing Area -->
      <div class="writing-container">
        <!-- Outline Reference (Left Sidebar) -->
        <div class="outline-sidebar">
          <h4 class="sidebar-title">📋 Outline</h4>
          <div class="sections-list">
            <button
              v-for="(section, idx) in sections"
              :key="section.id"
              @click="currentSectionIdx = idx"
              class="section-item"
              :class="{ active: currentSectionIdx === idx, completed: section.status === 'complete' }"
            >
              <span class="section-number">{{ idx + 1 }}</span>
              <div class="section-info">
                <p class="section-name">{{ section.title }}</p>
                <p class="section-status">{{ section.wordCount }} words</p>
              </div>
              <span v-if="section.status === 'complete'" class="section-check">✓</span>
            </button>
          </div>

          <!-- Tips -->
          <div class="tips-box">
            <h5 class="tips-title">💡 Quick Tips</h5>
            <ul class="tips-list">
              <li v-for="(tip, idx) in tips.writing.slice(0, 3)" :key="idx">{{ tip }}</li>
            </ul>
          </div>
        </div>

        <!-- Section Editor (Center) -->
        <div class="editor-area">
          <!-- Current Section -->
          <div v-if="currentSection" class="section-editor">
            <!-- Section Header -->
            <div class="section-header">
              <h4 class="section-editor-title">{{ currentSection.title }}</h4>
              <span class="section-count">{{ currentSectionIdx + 1 }} of {{ sections.length }}</span>
            </div>

            <!-- Guidance Box -->
            <div class="guidance-box">
              <p class="guidance-text">{{ currentSection.guidance }}</p>
              <p class="word-count-hint">Target: {{ currentSection.wordCountTarget }} words</p>
            </div>

            <!-- Text Editor -->
            <textarea
              v-model="currentSection.content"
              :placeholder="`Write your ${currentSection.title.toLowerCase()} here...`"
              class="section-textarea"
              @input="updateSectionStatus"
            ></textarea>

            <!-- Section Word Count -->
            <div class="section-footer">
              <span class="word-count">{{ currentSection.wordCount }} / {{ currentSection.wordCountTarget }} words</span>
              <button
                v-if="currentSection.status !== 'complete'"
                @click="markSectionComplete"
                class="btn btn-small btn-success"
              >
                ✓ Mark Complete
              </button>
              <button
                v-else
                @click="markSectionIncomplete"
                class="btn btn-small btn-secondary"
              >
                ← Back to Editing
              </button>
            </div>

            <!-- Navigation -->
            <div class="section-nav">
              <button
                v-if="currentSectionIdx > 0"
                @click="currentSectionIdx--"
                class="btn btn-nav"
              >
                ← Previous
              </button>
              <button
                v-if="currentSectionIdx < sections.length - 1"
                @click="currentSectionIdx++"
                class="btn btn-nav"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        <!-- Help Panel (Right Sidebar) -->
        <div class="help-sidebar">
          <h4 class="sidebar-title">ℹ️ Help & Tips</h4>

          <!-- SEO Tips -->
          <div class="help-section">
            <h5 class="help-section-title">🔍 SEO Tips</h5>
            <ul class="tips-list">
              <li v-for="(tip, idx) in tips.seo.slice(0, 3)" :key="idx">{{ tip }}</li>
            </ul>
          </div>

          <!-- Engagement Tips -->
          <div class="help-section">
            <h5 class="help-section-title">💬 Engagement</h5>
            <ul class="tips-list">
              <li v-for="(tip, idx) in tips.engagement.slice(0, 3)" :key="idx">{{ tip }}</li>
            </ul>
          </div>

          <!-- Structure Tips -->
          <div class="help-section">
            <h5 class="help-section-title">📐 Structure</h5>
            <ul class="tips-list">
              <li v-for="(tip, idx) in tips.structure.slice(0, 2)" :key="idx">{{ tip }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="isComplete" class="action-buttons">
        <button @click="resetBlog" class="btn btn-secondary">← Start Over</button>
        <button @click="saveBlogPost" class="btn btn-primary">💾 Save Blog Post</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { writeBlogTask } from '@/configs/writeBlog.config'

// Props
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

// Emits
const emit = defineEmits(['save'])

// State
const formData = ref({
  topic: '',
  audience: '',
  keywords: '',
  tone: 'educational',
  wordCount: 'medium'
})

const sections = ref([])
const currentSectionIdx = ref(0)
const isGenerating = ref(false)
const error = ref('')
const outline = ref({})

// Load from config
const tips = computed(() => writeBlogTask.tips)

// Initialize from saved data
if (props.taskData && props.taskData.formData) {
  Object.assign(formData.value, props.taskData.formData)
}

if (props.taskData && props.taskData.sections) {
  sections.value = props.taskData.sections
  outline.value = props.taskData.outline || {}
}

// Computed
const currentSection = computed(() => sections.value[currentSectionIdx.value] || null)

const totalWordCount = computed(() => {
  return sections.value.reduce((sum, section) => sum + (section.wordCount || 0), 0)
})

const completedSections = computed(() => {
  return sections.value.filter(s => s.status === 'complete').length
})

const progressPercentage = computed(() => {
  if (sections.value.length === 0) return 0
  return Math.round((completedSections.value / sections.value.length) * 100)
})

const isComplete = computed(() => {
  return progressPercentage.value === 100
})

// Methods
const generateOutline = async () => {
  if (!formData.value.topic.trim() || !formData.value.audience.trim()) {
    error.value = 'Please fill in Topic and Audience'
    return
  }

  isGenerating.value = true
  error.value = ''

  try {
    // Initialize sections from config
    const wordCountTargets = {
      short: { intro: 100, main: 250, case: 100, conclusion: 100 },
      medium: { intro: 150, main: 400, case: 300, conclusion: 150 },
      long: { intro: 200, main: 600, case: 400, conclusion: 200 },
      comprehensive: { intro: 250, main: 800, case: 500, conclusion: 250 }
    }

    const targets = wordCountTargets[formData.value.wordCount] || wordCountTargets.medium

    sections.value = [
      {
        id: 'introduction',
        title: 'Introduction / Hook',
        wordCountTarget: targets.intro,
        guidance: 'Start with a compelling hook. Answer: What problem does this solve? Why should readers care? Mention your main topic naturally.',
        content: '',
        status: 'empty',
        wordCount: 0
      },
      {
        id: 'main_point_1',
        title: 'First Main Point',
        wordCountTarget: targets.main,
        guidance: 'Introduce your first key idea. Support it with examples, data, or personal experience. Connect back to reader pain points.',
        content: '',
        status: 'empty',
        wordCount: 0
      },
      {
        id: 'main_point_2',
        title: 'Second Main Point',
        wordCountTarget: targets.main,
        guidance: 'Build on your first point. Keep the reader engaged with practical examples and actionable insights.',
        content: '',
        status: 'empty',
        wordCount: 0
      },
      {
        id: 'main_point_3',
        title: 'Third Main Point',
        wordCountTarget: targets.main,
        guidance: 'Your final key idea. Make it count and reinforce your main argument. Leave reader with memorable takeaway.',
        content: '',
        status: 'empty',
        wordCount: 0
      },
      {
        id: 'case_study_example',
        title: 'Real-World Example or Case Study',
        wordCountTarget: targets.case,
        guidance: 'Share a concrete example, story, or case study that illustrates your points. Make it specific and relatable.',
        content: '',
        status: 'empty',
        wordCount: 0
      },
      {
        id: 'conclusion',
        title: 'Conclusion & Call-to-Action',
        wordCountTarget: targets.conclusion,
        guidance: 'Summarize key takeaways in 2-3 sentences. End with a clear call-to-action. What should readers do next?',
        content: '',
        status: 'empty',
        wordCount: 0
      }
    ]

    outline.value = writeBlogTask.outline

    // Save progress
    saveProgress()
  } catch (err) {
    console.error('Generation error:', err)
    error.value = 'Failed to generate outline. Please try again.'
  } finally {
    isGenerating.value = false
  }
}

const updateSectionStatus = () => {
  if (!currentSection.value) return

  // Count words
  const words = currentSection.value.content.trim().split(/\s+/).filter(w => w.length > 0)
  currentSection.value.wordCount = words.length

  // Auto-save
  saveProgress()
}

const markSectionComplete = () => {
  if (currentSection.value) {
    currentSection.value.status = 'complete'
    saveProgress()
  }
}

const markSectionIncomplete = () => {
  if (currentSection.value) {
    currentSection.value.status = 'draft'
    saveProgress()
  }
}

const saveProgress = () => {
  emit('save', {
    formData: formData.value,
    sections: sections.value,
    outline: outline.value
  })
}

const resetBlog = () => {
  sections.value = []
  outline.value = {}
  currentSectionIdx.value = 0
  error.value = ''
  saveProgress()
}

const saveBlogPost = () => {
  // Compile full blog
  const fullBlog = sections.value
    .map(s => `${s.title}\n${s.content}`)
    .join('\n\n')

  emit('save', {
    formData: formData.value,
    sections: sections.value,
    outline: outline.value,
    fullBlog: fullBlog,
    savedAt: new Date().toISOString(),
    status: 'completed'
  })
}

// Auto-save on content changes
watch(
  () => [formData.value, sections.value],
  () => {
    if (outline.value && Object.keys(outline.value).length > 0) {
      saveProgress()
    }
  },
  { deep: true }
)
</script>

<style scoped>
.write-blog-app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #111;
  margin: 0 0 10px 0;
}

.subtitle {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

/* Setup Section */
.setup-section {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.setup-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.setup-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111;
  margin: 0 0 8px 0;
}

.setup-description {
  font-size: 0.95rem;
  color: #666;
  margin: 0 0 24px 0;
  line-height: 1.6;
}

/* Form Styles */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-hint {
  font-size: 0.85rem;
  color: #999;
  margin-top: 6px;
  margin-bottom: 0;
}

.error-message {
  padding: 12px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  color: #c33;
  font-size: 0.9rem;
  margin-bottom: 16px;
}

/* Button Styles */
.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  width: 100%;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background: #e0e0e0;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}

.btn-small {
  padding: 8px 16px;
  font-size: 0.85rem;
}

.btn-nav {
  background: #f0f0f0;
  color: #333;
  padding: 8px 16px;
  font-size: 0.9rem;
}

.btn-nav:hover:not(:disabled) {
  background: #e0e0e0;
}

/* Writing Section */
.writing-section {
  display: flex;
  flex-direction: column;
}

.writing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e0e0e0;
}

.writing-header-info {
  flex: 1;
}

.writing-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #111;
  margin: 0 0 4px 0;
}

.writing-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.writing-header-stats {
  display: flex;
  gap: 24px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.75rem;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #6366f1;
}

/* Progress Section */
.progress-section {
  margin-bottom: 32px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}

/* Writing Container */
.writing-container {
  display: grid;
  grid-template-columns: 250px 1fr 280px;
  gap: 24px;
  margin-bottom: 32px;
}

/* Outline Sidebar */
.outline-sidebar {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
}

.sidebar-title {
  font-size: 1rem;
  font-weight: bold;
  color: #111;
  margin: 0 0 16px 0;
}

.sections-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.section-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.section-item:hover {
  border-color: #6366f1;
  background: #f5f5ff;
}

.section-item.active {
  border-color: #6366f1;
  background: #f5f5ff;
}

.section-item.completed {
  border-color: #10b981;
  background: #f0fdf4;
}

.section-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #6366f1;
  color: white;
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: bold;
  flex-shrink: 0;
}

.section-item.completed .section-number {
  background: #10b981;
}

.section-info {
  flex: 1;
  min-width: 0;
}

.section-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.section-status {
  font-size: 0.75rem;
  color: #999;
  margin: 0;
}

.section-check {
  color: #10b981;
  font-weight: bold;
}

/* Tips Box */
.tips-box {
  background: #f0f7ff;
  border-left: 4px solid #3b82f6;
  padding: 12px;
  border-radius: 6px;
  margin-top: 16px;
}

.tips-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e40af;
  margin: 0 0 8px 0;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 6px;
  padding-left: 16px;
  position: relative;
}

.tips-list li:last-child {
  margin-bottom: 0;
}

.tips-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #3b82f6;
  font-weight: bold;
}

/* Editor Area */
.editor-area {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 32px;
}

.section-editor {
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.section-editor-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #111;
  margin: 0;
}

.section-count {
  font-size: 0.85rem;
  color: #999;
  font-weight: 600;
}

/* Guidance Box */
.guidance-box {
  background: #f5f5ff;
  border-left: 4px solid #6366f1;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.guidance-text {
  font-size: 0.95rem;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.6;
}

.word-count-hint {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
  font-weight: 500;
}

/* Textarea */
.section-textarea {
  width: 100%;
  min-height: 400px;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.2s;
  margin-bottom: 16px;
}

.section-textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Section Footer */
.section-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 6px;
  margin-bottom: 16px;
}

.word-count {
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
}

.word-count.warning {
  color: #d97706;
}

/* Section Nav */
.section-nav {
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.section-nav .btn {
  flex: 1;
}

/* Help Sidebar */
.help-sidebar {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  max-height: 600px;
  overflow-y: auto;
}

.help-section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.help-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.help-section-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 8px 0;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #e0e0e0;
}

.action-buttons .btn {
  width: auto;
  min-width: 150px;
}

/* Responsive */
@media (max-width: 1024px) {
  .writing-container {
    grid-template-columns: 1fr;
  }

  .outline-sidebar,
  .help-sidebar {
    grid-column: 1;
  }

  .writing-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .writing-header-stats {
    width: 100%;
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .write-blog-app {
    padding: 12px;
  }

  .setup-card {
    padding: 20px;
  }

  .editor-area {
    padding: 16px;
  }

  .title {
    font-size: 1.5rem;
  }

  .writing-title {
    font-size: 1.3rem;
  }

  .section-textarea {
    min-height: 250px;
  }

  .action-buttons {
    flex-direction: column-reverse;
  }

  .action-buttons .btn {
    width: 100%;
  }

  .outline-sidebar,
  .help-sidebar {
    display: none;
  }
}
</style>
