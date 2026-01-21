<template>
  <div class="landing-page-creator">
    <!-- Header -->
    <div class="creator-header">
      <h2 class="creator-title">🚀 Landing Page Creator Assistant</h2>
      <p class="creator-subtitle">Build a professional landing page in 5 minutes. No coding required.</p>
    </div>

    <!-- Progress Bar -->
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <div class="progress-text">
        Step {{ currentStep }} of {{ totalSteps }}
      </div>
    </div>

    <!-- Main Content: Split View (Form + Preview) -->
    <div class="creator-content">
      <!-- Left: Form Section -->
      <div class="form-section">
        <LandingPageWizardStep
          :step="wizardSteps[currentStep - 1]"
          :step-number="currentStep"
          :form-data="formData"
          @update:formData="updateFormData"
          @generate-ai="generateFieldSuggestions"
        />

        <!-- AI Generate All Button (shown in Step 1) -->
        <div v-if="currentStep === 1" class="generate-all-section">
          <div class="generate-all-divider">
            <span>or skip the details</span>
          </div>
          <button
            :disabled="!canGenerateFullPage || isGeneratingFullPage"
            class="btn btn-ai"
            @click="generateFullPage"
          >
            <span v-if="isGeneratingFullPage" class="loading-dots">
              ✨ Generating...
            </span>
            <span v-else>
              ✨ Generate All Copy with AI
            </span>
          </button>
          <p class="generate-all-tip">
            Fill brand name & tagline above, then let AI write everything else
          </p>
          <div v-if="fullPageError" class="error-message small">
            {{ fullPageError }}
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="button-group">
          <button
            v-if="currentStep > 1"
            class="btn btn-secondary"
            @click="previousStep"
          >
            ← Back
          </button>
          <button
            v-if="currentStep < totalSteps"
            class="btn btn-primary"
            @click="nextStep"
          >
            Next →
          </button>
          <button
            v-else
            class="btn btn-success"
            @click="showExportModal = true"
          >
            ✓ Export & Finish
          </button>
        </div>
      </div>

      <!-- Right: Live Preview -->
      <div class="preview-section">
        <div class="preview-header">
          <h3>📱 Live Preview</h3>
          <button class="preview-toggle" @click="previewDevice = previewDevice === 'desktop' ? 'mobile' : 'desktop'">
            {{ previewDevice === 'desktop' ? '📱 Mobile' : '🖥️ Desktop' }}
          </button>
        </div>
        <LandingPagePreview
          :form-data="formData"
          :device="previewDevice"
        />
      </div>
    </div>

    <!-- Export Modal -->
    <div v-if="showExportModal" class="modal-overlay" @click.self="showExportModal = false">
      <div class="modal-content">
        <button class="modal-close" @click="showExportModal = false">✕</button>

        <h3 class="modal-title">🎉 Your Landing Page is Ready!</h3>

        <div class="export-options">
          <!-- Option 1: Publish to Web (Featured) -->
          <div class="export-option featured">
            <h4>🚀 Option 1: Publish to Web (Instant)</h4>
            <p>Get a live URL in seconds. Share your landing page immediately.</p>
            <button
              :disabled="isPublishing"
              class="btn btn-success"
              @click="publishToR2"
            >
              <span v-if="isPublishing">Publishing...</span>
              <span v-else>🚀 Publish Now</span>
            </button>

            <!-- Published URL -->
            <div v-if="publishedUrl" class="published-url">
              <div class="url-display">
                <a :href="publishedUrl" target="_blank" rel="noopener">{{ publishedUrl }}</a>
              </div>
              <button class="btn btn-small" @click="copyPublishedUrl">
                📋 Copy URL
              </button>
            </div>

            <div v-if="publishError" class="error-message small">
              {{ publishError }}
            </div>
          </div>

          <div class="export-option">
            <h4>Option 2: Copy HTML Code</h4>
            <p>Paste into your website builder (Wix, Squarespace, Wordpress block)</p>
            <button class="btn btn-primary" @click="copyHTMLCode">
              📋 Copy to Clipboard
            </button>
          </div>

          <div class="export-option">
            <h4>Option 3: Download HTML File</h4>
            <p>Download as standalone file (.html) - works on any domain</p>
            <button class="btn btn-primary" @click="downloadHTMLFile">
              ⬇️ Download File
            </button>
          </div>

          <div class="export-option">
            <h4>Option 4: View Deployment Guide</h4>
            <p>Step-by-step instructions for popular platforms</p>
            <button class="btn btn-secondary" @click="showDeploymentGuide = true">
              📖 Show Guide
            </button>
          </div>
        </div>

        <div v-if="copySuccess" class="success-message">
          ✓ Copied to clipboard!
        </div>
      </div>
    </div>

    <!-- Deployment Guide Modal -->
    <div v-if="showDeploymentGuide" class="modal-overlay" @click.self="showDeploymentGuide = false">
      <div class="modal-content modal-large">
        <button class="modal-close" @click="showDeploymentGuide = false">✕</button>

        <h3 class="modal-title">🚀 Deployment Guide</h3>

        <div class="deployment-guides">
          <div class="guide-section">
            <h4>Wordpress</h4>
            <ol>
              <li>Go to Pages → Add New</li>
              <li>Click "+" and search for "HTML"</li>
              <li>Paste the HTML code</li>
              <li>Publish!</li>
            </ol>
          </div>

          <div class="guide-section">
            <h4>Wix / Squarespace</h4>
            <ol>
              <li>Add a new section/page</li>
              <li>Look for "Code" or "HTML" block</li>
              <li>Paste the entire HTML code</li>
              <li>Save and publish</li>
            </ol>
          </div>

          <div class="guide-section">
            <h4>Your Own Domain (FTP)</h4>
            <ol>
              <li>Save the HTML file to your computer</li>
              <li>Use FTP client (FileZilla) to upload</li>
              <li>Upload to your web server's public_html folder</li>
              <li>Visit your domain - done!</li>
            </ol>
          </div>

          <div class="guide-section">
            <h4>Vercel / Netlify (Free)</h4>
            <ol>
              <li>Create account on Vercel.com or Netlify.com</li>
              <li>Drag & drop the HTML file</li>
              <li>Get a free domain automatically</li>
              <li>Share your landing page!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Suggestions Modal -->
    <div v-if="showAISuggestionsModal" class="modal-overlay" @click.self="showAISuggestionsModal = false">
      <div class="modal-content">
        <button class="modal-close" @click="showAISuggestionsModal = false">✕</button>

        <h3 class="modal-title">✨ AI Suggestions for {{ currentAIField }}</h3>

        <div v-if="isGeneratingAI" class="loading-spinner">
          <p>Generating suggestions...</p>
        </div>

        <div v-else-if="aiError" class="error-message">
          {{ aiError }}
        </div>

        <div v-else-if="aiSuggestions" class="suggestions-container">
          <div class="suggestions-text">
            {{ aiSuggestions }}
          </div>
          <button
            @click="showAISuggestionsModal = false"
            class="btn btn-primary"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import LandingPageWizardStep from './components/LandingPageWizardStep.vue'
import LandingPagePreview from './components/LandingPagePreview.vue'
import { generateLandingPageHTML } from '../../services/landingPageExporter'
import { wizardSteps, fullPageAIPrompt } from '../../configs/landingPageCreatorAssistant.config'
import { generateAIContent } from '../../services/aiGeneration'

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
const currentStep = ref(1)
const previewDevice = ref('desktop')
const showExportModal = ref(false)
const showDeploymentGuide = ref(false)
const copySuccess = ref(false)
const showAISuggestionsModal = ref(false)
const aiSuggestions = ref(null)
const currentAIField = ref(null)
const isGeneratingAI = ref(false)
const aiError = ref(null)

// Full page generation state
const isGeneratingFullPage = ref(false)
const fullPageError = ref(null)

// Publishing state
const isPublishing = ref(false)
const publishError = ref(null)
const publishedUrl = ref(null)

// Timeout tracking
let copyTimeout = null

const formData = ref({
  brand_name: '',
  tagline: '',
  logo_url: '',
  primary_color: '#6366f1',
  hero_headline: '',
  hero_subheadline: '',
  hero_cta_text: 'Get Started Free',
  hero_image_url: '',
  features: [],
  signup_headline: 'Ready to get started?',
  signup_button_text: 'Create Account',
  signup_success_message: 'Check your email!',
  footer_company_name: '',
  footer_email: '',
  footer_links: ''
})

// Initialize with existing data if available
if (props.taskData && props.taskData.formData) {
  formData.value = { ...formData.value, ...props.taskData.formData }
}

// Computed
const totalSteps = computed(() => wizardSteps.length)
const progressPercent = computed(() => (currentStep.value / totalSteps.value) * 100)
const canGenerateFullPage = computed(() => {
  return formData.value.brand_name?.trim() && formData.value.tagline?.trim()
})

// Watch for form data changes and auto-save to database
watch(
  () => formData.value,
  (newData) => {
    // Emit save event with form data
    emit('save', {
      formData: newData
    })
  },
  { deep: true }
)

// Update form data and trigger save
const updateFormData = (newData) => {
  formData.value = newData
}

// Methods
const nextStep = () => {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Generate AI suggestions for a field
const generateFieldSuggestions = async (fieldId) => {
  console.log('[LandingPageCreatorAssistant] Generating AI suggestions for field:', fieldId)

  currentAIField.value = fieldId
  isGeneratingAI.value = true
  aiError.value = null

  try {
    // Call the AI service with the task config and form data
    const taskConfig = {
      name: 'Landing Page Creator',
      aiConfig: {
        promptTemplate: `You are an expert landing page copywriter. Help improve this landing page copy:

Product: {brand_name}
Tagline: {tagline}

Current Headlines:
- Main: {hero_headline}
- Sub: {hero_subheadline}

Features: {feature_1_title}, {feature_2_title}, {feature_3_title}

Current Field: {current_field}
Current Value: {current_value}

Please suggest 3 alternatives for this field that are more compelling, benefit-focused, and likely to convert visitors.
Format as a numbered list with brief explanations.`,
        temperature: 0.7,
        maxTokens: 800
      }
    }

    // Prepare template variables
    const templateData = {
      ...formData.value,
      current_field: fieldId,
      current_value: formData.value[fieldId] || ''
    }

    // Call the AI generation service (imported function)
    const suggestions = await generateAIContent(taskConfig, templateData)
    aiSuggestions.value = suggestions
    showAISuggestionsModal.value = true

  } catch (err) {
    console.error('[LandingPageCreatorAssistant] AI generation error:', err)
    aiError.value = 'Failed to generate suggestions. Please try again.'
  } finally {
    isGeneratingAI.value = false
  }
}

const copyHTMLCode = async () => {
  try {
    const html = generateLandingPageHTML(formData.value)
    await navigator.clipboard.writeText(html)
    copySuccess.value = true
    copyTimeout = setTimeout(() => {
      copySuccess.value = false
    }, 3000)
  } catch (err) {
    console.error('Failed to copy HTML:', err)
    alert('Failed to copy. Please try again.')
  }
}

const downloadHTMLFile = () => {
  try {
    const html = generateLandingPageHTML(formData.value)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formData.value.brand_name.replace(/\s+/g, '-').toLowerCase()}-landing-page.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Failed to download HTML:', err)
    alert('Failed to download. Please try again.')
  }
}

/**
 * Generate full landing page copy with AI
 * Uses brand name + tagline to create all sections
 */
const generateFullPage = async () => {
  if (!canGenerateFullPage.value) {
    fullPageError.value = 'Please fill in brand name and tagline first'
    return
  }

  console.log('[LandingPageCreator] Generating full page copy...')
  isGeneratingFullPage.value = true
  fullPageError.value = null

  try {
    // Build the prompt with brand info
    const prompt = fullPageAIPrompt
      .replace('{brand_name}', formData.value.brand_name)
      .replace('{tagline}', formData.value.tagline)

    // Call Grok API via proxy
    const response = await fetch('/.netlify/functions/grok-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'grok-3-fast',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('No content in API response')
    }

    // Parse JSON from response (handle potential markdown code blocks)
    let jsonStr = content
    if (content.includes('```')) {
      jsonStr = content.replace(/```json?\s*/g, '').replace(/```/g, '').trim()
    }

    const generated = JSON.parse(jsonStr)
    console.log('[LandingPageCreator] Generated copy:', generated)

    // Populate form data with generated content
    formData.value.hero_headline = generated.hero_headline || formData.value.hero_headline
    formData.value.hero_subheadline = generated.hero_subheadline || formData.value.hero_subheadline
    formData.value.hero_cta_text = generated.hero_cta_text || formData.value.hero_cta_text
    formData.value.signup_headline = generated.signup_headline || formData.value.signup_headline
    formData.value.signup_button_text = generated.signup_button_text || formData.value.signup_button_text

    // Populate features
    if (generated.features && Array.isArray(generated.features)) {
      generated.features.forEach((feature, index) => {
        const num = index + 1
        if (num <= 5) {
          formData.value[`feature_${num}_title`] = feature.title
          formData.value[`feature_${num}_description`] = feature.description
          formData.value[`feature_${num}_icon`] = feature.icon
        }
      })

      // Also update features array for preview
      formData.value.features = generated.features.map(f => ({
        title: f.title,
        description: f.description,
        icon: f.icon
      }))
    }

    // Advance to step 2 to show generated content
    if (currentStep.value === 1) {
      currentStep.value = 2
    }

  } catch (err) {
    console.error('[LandingPageCreator] Full page generation error:', err)
    fullPageError.value = `Failed to generate: ${err.message}`
  } finally {
    isGeneratingFullPage.value = false
  }
}

/**
 * Publish landing page to Cloudflare R2
 * Returns a live public URL
 */
const publishToR2 = async () => {
  console.log('[LandingPageCreator] Publishing to R2...')
  isPublishing.value = true
  publishError.value = null
  publishedUrl.value = null

  try {
    const html = generateLandingPageHTML(formData.value)

    const response = await fetch('/.netlify/functions/r2-publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        html,
        brandName: formData.value.brand_name
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Upload failed: ${response.status}`)
    }

    const data = await response.json()
    publishedUrl.value = data.url
    console.log('[LandingPageCreator] Published to:', data.url)

  } catch (err) {
    console.error('[LandingPageCreator] Publish error:', err)
    publishError.value = `Failed to publish: ${err.message}`
  } finally {
    isPublishing.value = false
  }
}

/**
 * Copy published URL to clipboard
 */
const copyPublishedUrl = async () => {
  if (!publishedUrl.value) return
  try {
    await navigator.clipboard.writeText(publishedUrl.value)
    copySuccess.value = true
    copyTimeout = setTimeout(() => {
      copySuccess.value = false
    }, 3000)
  } catch (err) {
    console.error('Failed to copy URL:', err)
  }
}

// Cleanup timeout on unmount
onBeforeUnmount(() => {
  if (copyTimeout) clearTimeout(copyTimeout)
})
</script>

<style scoped>
.landing-page-creator {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
  background: #fafafa;
}

.creator-header {
  text-align: center;
  margin-bottom: 40px;
}

.creator-title {
  font-size: 2rem;
  font-weight: bold;
  color: #111;
  margin-bottom: 10px;
}

.creator-subtitle {
  font-size: 1.1rem;
  color: #666;
}

/* Progress Bar */
.progress-container {
  margin-bottom: 40px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

/* Main Content Layout */
.creator-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.form-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.preview-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 30px;
  max-height: 90vh;
  overflow-y: auto;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.preview-header h3 {
  font-size: 1.2rem;
  margin: 0;
  color: #111;
}

.preview-toggle {
  background: #f0f0f0;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.preview-toggle:hover {
  background: #e0e0e0;
}

/* Buttons */
.button-group {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-success {
  background: linear-gradient(135deg, #10b981, #14b8a6);
  color: white;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
}

.btn-ai {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  width: 100%;
  font-size: 1.1rem;
  padding: 14px 24px;
}

.btn-ai:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);
}

.btn-ai:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-small {
  padding: 6px 12px;
  font-size: 0.85rem;
}

/* Generate All Section */
.generate-all-section {
  margin-top: 30px;
  padding-top: 20px;
}

.generate-all-divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
}

.generate-all-divider::before,
.generate-all-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e0e0e0;
}

.generate-all-divider span {
  padding: 0 15px;
  color: #999;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.generate-all-tip {
  text-align: center;
  color: #666;
  font-size: 0.85rem;
  margin-top: 10px;
}

.loading-dots::after {
  content: '';
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0%, 20% { content: ''; }
  40% { content: '.'; }
  60% { content: '..'; }
  80%, 100% { content: '...'; }
}

/* Featured Export Option */
.export-option.featured {
  border-color: #10b981;
  background: #ecfdf5;
}

.export-option.featured h4 {
  color: #047857;
}

/* Published URL */
.published-url {
  margin-top: 15px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #d1fae5;
}

.url-display {
  margin-bottom: 10px;
  word-break: break-all;
}

.url-display a {
  color: #059669;
  text-decoration: none;
  font-size: 0.9rem;
}

.url-display a:hover {
  text-decoration: underline;
}

/* Small error message */
.error-message.small {
  font-size: 0.85rem;
  padding: 8px 12px;
  margin-top: 10px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 40px;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.modal-large {
  max-width: 800px;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.modal-close:hover {
  color: #333;
}

.modal-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 30px;
  color: #111;
}

/* Export Options */
.export-options {
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
}

.export-option {
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s;
}

.export-option:hover {
  border-color: #6366f1;
  background: #f9f7ff;
}

.export-option h4 {
  font-size: 1.1rem;
  margin: 0 0 10px 0;
  color: #111;
}

.export-option p {
  color: #666;
  margin: 0 0 15px 0;
  font-size: 0.95rem;
}

.export-option .btn {
  width: 100%;
}

/* Deployment Guide */
.deployment-guides {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.guide-section {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: #f9f9f9;
}

.guide-section h4 {
  font-size: 1.1rem;
  margin: 0 0 15px 0;
  color: #111;
}

.guide-section ol {
  margin: 0;
  padding-left: 20px;
  color: #666;
  font-size: 0.95rem;
}

.guide-section li {
  margin-bottom: 8px;
}

/* Success Message */
.success-message {
  background: #d1fae5;
  border: 1px solid #6ee7b7;
  color: #047857;
  padding: 15px;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
}

/* AI Suggestions Container */
.suggestions-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.suggestions-text {
  background: #f9f7ff;
  border: 1px solid #e9d5ff;
  border-radius: 8px;
  padding: 20px;
  color: #333;
  font-size: 0.95rem;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 400px;
  overflow-y: auto;
}

.loading-spinner {
  text-align: center;
  padding: 40px;
  color: #666;
}

.loading-spinner::after {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #e0e0e0;
  border-top: 3px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 15px;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .creator-content {
    grid-template-columns: 1fr;
  }

  .preview-section {
    position: static;
    max-height: none;
  }
}

@media (max-width: 768px) {
  .landing-page-creator {
    padding: 20px;
  }

  .creator-title {
    font-size: 1.5rem;
  }

  .button-group {
    flex-direction: column;
  }

  .btn {
    flex: 1;
  }

  .modal-content {
    padding: 30px 20px;
    margin: 20px;
  }

  .deployment-guides {
    grid-template-columns: 1fr;
  }
}
</style>
