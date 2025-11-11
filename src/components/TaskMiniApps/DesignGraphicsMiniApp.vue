<template>
  <div class="design-graphics-app">
    <!-- Header -->
    <div class="header">
      <h2 class="title">🖼️ Design Graphics</h2>
      <p class="subtitle">AI generates design briefs. You create graphics in your favorite tool. Step-by-step guides included.</p>
    </div>

    <!-- Phase 1: Setup Form -->
    <div v-if="!brief || !Object.keys(brief).length" class="setup-section">
      <div class="setup-card">
        <h3 class="setup-title">📋 Step 1: Design Brief</h3>
        <p class="setup-description">Tell us what graphic you need. We'll generate a detailed design brief with colors, layout, and elements.</p>

        <!-- Design Purpose -->
        <div class="form-group">
          <label class="form-label">Design Purpose *</label>
          <select v-model="formData.purpose" class="form-input">
            <option value="">Select a design purpose...</option>
            <option v-for="purpose in designPurposes" :key="purpose.id" :value="purpose.id">
              {{ purpose.emoji }} {{ purpose.name }} ({{ purpose.specs }})
            </option>
          </select>
          <p v-if="formData.purpose" class="form-hint">
            {{ getPurposeDescription(formData.purpose) }}
          </p>
        </div>

        <!-- Design Style -->
        <div class="form-group">
          <label class="form-label">Design Style *</label>
          <select v-model="formData.style" class="form-input">
            <option value="">Select a design style...</option>
            <option v-for="style in designStyles" :key="style.id" :value="style.id">
              {{ style.name }} - {{ style.description }}
            </option>
          </select>
        </div>

        <!-- Key Message -->
        <div class="form-group">
          <label class="form-label">Key Message / CTA *</label>
          <input
            v-model="formData.message"
            type="text"
            placeholder="e.g., 'Start Free Trial', 'Join 10K+ Users', 'Learn More'"
            class="form-input"
          />
          <p class="form-hint">What should the design communicate? What action do you want users to take?</p>
        </div>

        <!-- Error -->
        <div v-if="error" class="error-message">{{ error }}</div>

        <!-- Generate Button -->
        <button
          @click="generateBrief"
          :disabled="isGenerating || !formData.purpose || !formData.style || !formData.message.trim()"
          class="btn btn-primary"
        >
          <span v-if="!isGenerating">✨ Generate Design Brief</span>
          <span v-else>⏳ Generating brief...</span>
        </button>
      </div>
    </div>

    <!-- Phase 2: Design Brief Display -->
    <div v-else-if="brief && !selectedGuide" class="brief-section">
      <!-- Brief Header -->
      <div class="brief-header">
        <div class="brief-info">
          <h3 class="brief-title">{{ getPurposeName(formData.purpose) }} - {{ getStyleName(formData.style) }}</h3>
          <p class="brief-message">Message: "{{ formData.message }}"</p>
        </div>
        <button @click="resetDesign" class="btn btn-secondary btn-small">← Start Over</button>
      </div>

      <!-- Brief Content Grid -->
      <div class="brief-grid">
        <!-- Design Objectives -->
        <div class="brief-card">
          <h4 class="brief-card-title">🎯 Design Objectives</h4>
          <p class="brief-text">{{ brief.objectives }}</p>
        </div>

        <!-- Color Palette -->
        <div class="brief-card">
          <h4 class="brief-card-title">🎨 Color Palette</h4>
          <div class="color-swatches">
            <div
              v-for="(color, idx) in brief.colors"
              :key="idx"
              class="color-swatch"
              :style="{ backgroundColor: color.hex }"
              :title="color.name"
            >
              <span class="color-code">{{ color.hex }}</span>
              <span class="color-name">{{ color.name }}</span>
            </div>
          </div>
        </div>

        <!-- Typography -->
        <div class="brief-card">
          <h4 class="brief-card-title">🔤 Typography</h4>
          <div class="typography-guide">
            <div class="font-guide">
              <p class="font-label">Heading Font</p>
              <p class="font-name">{{ brief.fonts.heading }}</p>
              <p :style="{ fontFamily: brief.fonts.heading, fontSize: '24px', fontWeight: 'bold' }">
                Sample Heading
              </p>
            </div>
            <div class="font-guide">
              <p class="font-label">Body Font</p>
              <p class="font-name">{{ brief.fonts.body }}</p>
              <p :style="{ fontFamily: brief.fonts.body, fontSize: '16px' }">
                This is sample body text
              </p>
            </div>
          </div>
        </div>

        <!-- Layout Structure -->
        <div class="brief-card">
          <h4 class="brief-card-title">📐 Layout Structure</h4>
          <p class="brief-text">{{ brief.layout }}</p>
        </div>

        <!-- Key Elements -->
        <div class="brief-card">
          <h4 class="brief-card-title">✨ Key Elements to Include</h4>
          <ul class="elements-list">
            <li v-for="(element, idx) in brief.elements" :key="idx">{{ element }}</li>
          </ul>
        </div>

        <!-- Copy Requirements -->
        <div class="brief-card">
          <h4 class="brief-card-title">📝 Copy & Text Requirements</h4>
          <p class="brief-text">{{ brief.copyRequirements }}</p>
        </div>

        <!-- Sizing Guide -->
        <div class="brief-card">
          <h4 class="brief-card-title">📏 Sizing Guide</h4>
          <p class="brief-text">{{ brief.sizing }}</p>
        </div>

        <!-- Pro Tips -->
        <div class="brief-card tips-card">
          <h4 class="brief-card-title">💡 Pro Tips</h4>
          <ul class="tips-list">
            <li v-for="(tip, idx) in brief.tips" :key="idx">{{ tip }}</li>
          </ul>
        </div>
      </div>

      <!-- Guide Selection -->
      <div class="guide-selection-section">
        <h3 class="section-title">Step 2: Choose Your Tool</h3>
        <p class="section-description">Select which tool you'd like to use to create this design. We'll provide step-by-step instructions.</p>

        <div class="guide-buttons">
          <button
            v-for="(guide, toolId) in diyGuides"
            :key="toolId"
            @click="selectGuide(toolId)"
            class="guide-button"
          >
            <span class="guide-icon">{{ guide.icon }}</span>
            <span class="guide-name">{{ guide.name }}</span>
            <span class="guide-desc">{{ guide.description }}</span>
            <span class="arrow">→</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Phase 3: DIY Guide -->
    <div v-else-if="selectedGuide && currentGuide" class="guide-section">
      <!-- Guide Header -->
      <div class="guide-header">
        <div class="guide-header-info">
          <h3 class="guide-title">{{ currentGuide.name }}</h3>
          <p class="guide-url"><a :href="currentGuide.url" target="_blank">{{ currentGuide.url }}</a></p>
        </div>
        <button @click="deselectGuide" class="btn btn-secondary btn-small">← Choose Different Tool</button>
      </div>

      <!-- Steps -->
      <div class="steps-container">
        <div v-for="(step, idx) in currentGuide.steps" :key="idx" class="step-card">
          <div class="step-header">
            <span class="step-number">{{ step.number }}</span>
            <h4 class="step-title">{{ step.title }}</h4>
          </div>

          <p class="step-description">{{ step.description }}</p>

          <!-- Prompt Template (for Midjourney) -->
          <div v-if="step.template" class="prompt-template">
            <p class="template-label">📋 Prompt Template:</p>
            <div class="template-box">
              {{ step.template }}
              <button @click="copyToClipboard(step.template)" class="copy-btn">📋 Copy</button>
            </div>
          </div>

          <!-- Example (for DALL-E) -->
          <div v-if="step.example" class="example-box">
            <p class="example-label">📝 Example Description:</p>
            <p class="example-text">{{ step.example }}</p>
            <button @click="copyToClipboard(step.example)" class="copy-btn">📋 Copy</button>
          </div>

          <!-- Tip -->
          <div v-if="step.tip" class="tip-box">
            <p class="tip-label">💡 Tip:</p>
            <p class="tip-text">{{ step.tip }}</p>
          </div>
        </div>
      </div>

      <!-- Completion -->
      <div class="completion-section">
        <h4 class="section-title">Design Complete?</h4>
        <p class="section-description">Once you've created your design in {{ currentGuide.name }}, save it and move to the checklist.</p>

        <button @click="showChecklist = true" class="btn btn-primary">
          ✓ Proceed to Checklist
        </button>
      </div>
    </div>

    <!-- Phase 4: Design Checklist -->
    <div v-if="showChecklist" class="checklist-section">
      <div class="checklist-container">
        <h3 class="checklist-title">✓ Design Checklist</h3>
        <p class="checklist-description">Verify your design meets the brief requirements.</p>

        <div class="checklist-items">
          <label v-for="(item, idx) in checklist" :key="idx" class="checklist-item">
            <input
              v-model="item.checked"
              type="checkbox"
              class="checklist-checkbox"
            />
            <span class="checklist-label">{{ item.label }}</span>
          </label>
        </div>

        <!-- Notes -->
        <div class="form-group">
          <label class="form-label">Design Notes (optional)</label>
          <textarea
            v-model="designNotes"
            placeholder="Add any notes about your design... Which tool did you use? What challenges did you face? Etc."
            class="form-input textarea"
            rows="4"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="checklist-actions">
          <button @click="showChecklist = false" class="btn btn-secondary">← Back to Guide</button>
          <button
            @click="completeDesign"
            :disabled="!isChecklistComplete"
            class="btn btn-primary"
          >
            💾 Save Design & Complete
          </button>
        </div>
      </div>
    </div>

    <!-- Design History -->
    <div v-if="designHistory.length > 0" class="history-section">
      <h3 class="history-title">📋 Your Designs</h3>
      <div class="history-grid">
        <div v-for="(design, idx) in designHistory" :key="idx" class="history-card">
          <div class="history-header">
            <p class="history-name">{{ design.title }}</p>
            <span class="history-date">{{ formatDate(design.date) }}</span>
          </div>
          <p class="history-details">{{ design.purpose }} • {{ design.tool }}</p>
          <p v-if="design.notes" class="history-notes">{{ design.notes.substring(0, 60) }}...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { designGraphicsTask, designPurposes, designStyles, diyGuides } from '@/configs/designGraphics.config'
import { generateAIContent } from '@/services/aiGeneration'

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
  purpose: '',
  style: '',
  message: ''
})

const brief = ref({})
const selectedGuide = ref(null)
const showChecklist = ref(false)
const isGenerating = ref(false)
const error = ref('')
const designNotes = ref('')
const designHistory = ref([])
const copyFeedback = ref('')

const checklist = ref([
  { label: 'Colors match the design brief', checked: false },
  { label: 'All key elements are included', checked: false },
  { label: 'Key message/CTA is clear and readable', checked: false },
  { label: 'Design dimensions are correct for the purpose', checked: false },
  { label: 'Font style matches the typography guide', checked: false },
  { label: 'Overall design meets the brief objectives', checked: false }
])

// Load from saved data
if (props.taskData && props.taskData.formData) {
  Object.assign(formData.value, props.taskData.formData)
}

if (props.taskData && props.taskData.brief) {
  brief.value = props.taskData.brief
}

if (props.taskData && props.taskData.designHistory) {
  designHistory.value = props.taskData.designHistory
}

// Computed
const currentGuide = computed(() => {
  return selectedGuide.value ? diyGuides[selectedGuide.value] : null
})

const isChecklistComplete = computed(() => {
  return checklist.value.every(item => item.checked)
})

// Methods
const getPurposeName = (id) => {
  return designPurposes.find(p => p.id === id)?.name || ''
}

const getPurposeDescription = (id) => {
  return designPurposes.find(p => p.id === id)?.description || ''
}

const getStyleName = (id) => {
  return designStyles.find(s => s.id === id)?.name || ''
}

const generateDefaultBrief = () => {
  // Fallback brief when API fails - dynamically generated based on style
  const colorPalettes = {
    'modern-minimal': [
      { name: 'Primary', hex: '#000000' },
      { name: 'Secondary', hex: '#FFFFFF' },
      { name: 'Accent', hex: '#6366F1' },
      { name: 'Neutral', hex: '#F5F5F5' }
    ],
    'bold-vibrant': [
      { name: 'Primary', hex: '#FF6B6B' },
      { name: 'Secondary', hex: '#4ECDC4' },
      { name: 'Accent', hex: '#FFE66D' },
      { name: 'Neutral', hex: '#2D3436' }
    ],
    'professional': [
      { name: 'Primary', hex: '#003366' },
      { name: 'Secondary', hex: '#666666' },
      { name: 'Accent', hex: '#0099CC' },
      { name: 'Neutral', hex: '#F0F0F0' }
    ],
    'playful': [
      { name: 'Primary', hex: '#FF1493' },
      { name: 'Secondary', hex: '#00CED1' },
      { name: 'Accent', hex: '#FFD700' },
      { name: 'Neutral', hex: '#FFFFFF' }
    ],
    'luxury': [
      { name: 'Primary', hex: '#1a1a1a' },
      { name: 'Secondary', hex: '#D4AF37' },
      { name: 'Accent', hex: '#C0C0C0' },
      { name: 'Neutral', hex: '#F5F5F0' }
    ],
    'tech': [
      { name: 'Primary', hex: '#1E90FF' },
      { name: 'Secondary', hex: '#00FF00' },
      { name: 'Accent', hex: '#FF00FF' },
      { name: 'Neutral', hex: '#1a1a2e' }
    ]
  }

  const styleDescriptions = {
    'modern-minimal': 'Clean, minimalist design with plenty of whitespace',
    'bold-vibrant': 'Eye-catching, energetic design with vibrant colors',
    'professional': 'Corporate, trustworthy design that builds credibility',
    'playful': 'Friendly, approachable design with casual vibes',
    'luxury': 'Sophisticated, premium design that exudes elegance',
    'tech': 'Modern, futuristic design that emphasizes innovation'
  }

  const purposeElements = {
    'social-banner': ['Your logo', 'Key message', 'CTA button or link', 'Brand colors'],
    'website-hero': ['Background image', 'Headline text', 'Subheading', 'CTA button', 'Brand logo'],
    'infographic': ['Headline', 'Data visualization', 'Icons or illustrations', 'Key statistics', 'Source attribution'],
    'ad-creative': ['Headline', 'Product image or mockup', 'Value proposition', 'CTA button', 'Company branding'],
    'product-screenshot': ['Screenshot of key feature', 'Annotations/callouts', 'UI highlights', 'Brief explanation'],
    'thumbnail': ['Text overlay', 'Eye-catching image', 'High contrast', 'Readable from small size']
  }

  const purposeNames = {
    'social-banner': 'Social Media Banner',
    'website-hero': 'Website Hero Image',
    'infographic': 'Infographic',
    'ad-creative': 'Paid Ad Creative',
    'product-screenshot': 'Product Screenshot',
    'thumbnail': 'YouTube Thumbnail'
  }

  const purposeSizing = {
    'social-banner': '1200x628px or 1080x1080px',
    'website-hero': '1920x600px or full width',
    'infographic': '1200x1600px (vertical) or 1600x1000px (horizontal)',
    'ad-creative': '1200x628px, 1080x1080px, or 300x250px',
    'product-screenshot': 'Native screen size (e.g., 1920x1080)',
    'thumbnail': '1280x720px'
  }

  return {
    objectives: `Create a ${styleDescriptions[formData.value.style] || 'well-designed'} ${purposeNames[formData.value.purpose] || 'graphic'} that communicates "${formData.value.message}". The design should grab attention and drive action.`,
    colors: colorPalettes[formData.value.style] || colorPalettes['modern-minimal'],
    fonts: {
      heading: 'Bold, modern sans-serif (e.g., Montserrat Bold, Poppins Bold, Inter Bold)',
      body: 'Clean, readable sans-serif (e.g., Inter, Open Sans, Roboto)'
    },
    layout: 'Arrange elements to create visual hierarchy. Place the most important message prominently, use the color palette consistently, and leave enough whitespace to avoid clutter.',
    elements: purposeElements[formData.value.purpose] || ['Logo', 'Text', 'Images', 'Shapes'],
    copyRequirements: `Include the main message: "${formData.value.message}". Keep text concise and readable from a distance. Include your CTA (Call-to-Action) prominently.`,
    sizing: purposeSizing[formData.value.purpose] || 'Standard web size',
    tips: [
      'Use high contrast between text and background for readability',
      'Keep fonts to max 2-3 different typefaces',
      'Ensure design works at small sizes (for social feeds)',
      'Test on mobile and desktop before finalizing',
      'Use the color palette consistently throughout'
    ]
  }
}

const generateBrief = async () => {
  if (!formData.value.purpose || !formData.value.style || !formData.value.message.trim()) {
    error.value = 'Please fill in all fields'
    return
  }

  isGenerating.value = true
  error.value = ''

  try {
    // Try to get AI-generated brief first
    const purposeName = getPurposeName(formData.value.purpose)
    const styleName = getStyleName(formData.value.style)

    const prompt = `Create a detailed design brief for a ${purposeName} with ${styleName} style. Key message: "${formData.value.message}".

    Respond with ONLY valid JSON (no markdown, no extra text):
    {
      "objectives": "2-3 sentence brief on what this design should achieve",
      "colors": [
        {"name": "Primary Color", "hex": "#FF6B6B"},
        {"name": "Secondary Color", "hex": "#4ECDC4"},
        {"name": "Accent Color", "hex": "#FFE66D"},
        {"name": "Neutral", "hex": "#F7F7F7"}
      ],
      "fonts": {
        "heading": "Bold Sans Serif (e.g., Montserrat Bold, Poppins Bold)",
        "body": "Clean Sans Serif (e.g., Inter, Open Sans)"
      },
      "layout": "Description of how elements should be arranged",
      "elements": ["element 1", "element 2", "element 3"],
      "copyRequirements": "What text should be included and where",
      "sizing": "Exact dimensions needed",
      "tips": ["tip 1", "tip 2", "tip 3"]
    }`

    const config = {
      id: 'design-graphics-brief',
      aiConfig: {
        promptTemplate: prompt,
        temperature: 0.7,
        maxTokens: 2000,
        model: 'grok-2'
      }
    }

    let responseText
    try {
      responseText = await generateAIContent(config, {})
    } catch (err) {
      console.warn('AI generation failed, using default brief:', err)
      brief.value = generateDefaultBrief()
      saveProgress()
      return
    }

    if (!responseText) {
      console.warn('No AI response, using default brief')
      brief.value = generateDefaultBrief()
      saveProgress()
      return
    }

    // Parse JSON from response
    let parsedBrief
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedBrief = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found')
      }
    } catch (parseErr) {
      console.warn('JSON parse failed, using default brief:', parseErr)
      brief.value = generateDefaultBrief()
      saveProgress()
      return
    }

    // Validate required fields
    if (!parsedBrief.objectives || !parsedBrief.colors || !parsedBrief.fonts) {
      console.warn('Missing required fields, using default brief')
      brief.value = generateDefaultBrief()
      saveProgress()
      return
    }

    brief.value = parsedBrief
    saveProgress()
  } catch (err) {
    console.error('Generation error:', err)
    // Fallback to default brief
    brief.value = generateDefaultBrief()
    saveProgress()
  } finally {
    isGenerating.value = false
  }
}

const selectGuide = (toolId) => {
  selectedGuide.value = toolId
}

const deselectGuide = () => {
  selectedGuide.value = null
  showChecklist.value = false
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    copyFeedback.value = 'Copied!'
    setTimeout(() => {
      copyFeedback.value = ''
    }, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}

const completeDesign = () => {
  const newDesign = {
    title: formData.value.message,
    purpose: getPurposeName(formData.value.purpose),
    style: getStyleName(formData.value.style),
    tool: currentGuide.value.name,
    date: new Date().toISOString(),
    notes: designNotes.value
  }

  designHistory.value.unshift(newDesign)

  // Reset for next design
  brief.value = {}
  selectedGuide.value = null
  showChecklist.value = false
  designNotes.value = ''
  checklist.value.forEach(item => item.checked = false)
  formData.value = { purpose: '', style: '', message: '' }

  saveProgress()
}

const resetDesign = () => {
  brief.value = {}
  formData.value = { purpose: '', style: '', message: '' }
  error.value = ''
  saveProgress()
}

const saveProgress = () => {
  emit('save', {
    formData: formData.value,
    brief: brief.value,
    designHistory: designHistory.value
  })
}

const formatDate = (isoString) => {
  try {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return 'Unknown'
  }
}

// Auto-save
watch(
  () => [formData.value, brief.value, designHistory.value],
  () => {
    if (brief.value && Object.keys(brief.value).length > 0) {
      saveProgress()
    }
  },
  { deep: true }
)
</script>

<style scoped>
.design-graphics-app {
  max-width: 1200px;
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
}

.setup-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
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
  font-family: inherit;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-input.textarea {
  resize: vertical;
  min-height: 100px;
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

.btn-small {
  padding: 8px 16px;
  font-size: 0.85rem;
  width: auto;
}

/* Brief Section */
.brief-section {
  display: flex;
  flex-direction: column;
}

.brief-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.brief-info {
  flex: 1;
}

.brief-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #111;
  margin: 0 0 4px 0;
}

.brief-message {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
}

/* Brief Grid */
.brief-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.brief-card {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
}

.brief-card.tips-card {
  background: #f0f7ff;
  border: 2px solid #3b82f6;
}

.brief-card-title {
  font-size: 1rem;
  font-weight: bold;
  color: #111;
  margin: 0 0 12px 0;
}

.brief-text {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

/* Color Swatches */
.color-swatches {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.color-swatch {
  height: 120px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid #ddd;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  font-size: 0.85rem;
  font-weight: 600;
}

.color-code {
  display: block;
  margin-bottom: 4px;
}

.color-name {
  display: block;
  font-size: 0.75rem;
}

/* Typography */
.typography-guide {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.font-guide {
  padding: 12px;
  background: white;
  border-radius: 6px;
}

.font-label {
  font-size: 0.85rem;
  color: #999;
  margin: 0 0 4px 0;
  font-weight: 600;
  text-transform: uppercase;
}

.font-name {
  font-size: 0.9rem;
  color: #333;
  margin: 0 0 8px 0;
  font-weight: 500;
}

/* Elements List */
.elements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.elements-list li {
  padding: 8px 0;
  color: #666;
  font-size: 0.95rem;
  border-bottom: 1px solid #e0e0e0;
}

.elements-list li:last-child {
  border-bottom: none;
}

.elements-list li::before {
  content: '✓ ';
  color: #10b981;
  font-weight: bold;
  margin-right: 8px;
}

/* Tips List */
.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  padding: 8px 0;
  color: #1e40af;
  font-size: 0.95rem;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.tips-list li:last-child {
  border-bottom: none;
}

.tips-list li::before {
  content: '💡 ';
  margin-right: 8px;
}

/* Guide Selection */
.guide-selection-section {
  margin-top: 40px;
  padding-top: 40px;
  border-top: 2px solid #e0e0e0;
}

.section-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #111;
  margin: 0 0 8px 0;
}

.section-description {
  font-size: 0.95rem;
  color: #666;
  margin: 0 0 24px 0;
}

.guide-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.guide-button {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.guide-button:hover {
  border-color: #6366f1;
  background: #f5f5ff;
  transform: translateY(-2px);
}

.guide-icon {
  font-size: 2rem;
}

.guide-name {
  font-weight: 600;
  color: #111;
  font-size: 1rem;
}

.guide-desc {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.5;
  flex-grow: 1;
}

.arrow {
  color: #6366f1;
  font-weight: bold;
  align-self: flex-end;
}

/* Guide Section */
.guide-section {
  display: flex;
  flex-direction: column;
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.guide-header-info {
  flex: 1;
}

.guide-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #111;
  margin: 0 0 4px 0;
}

.guide-url {
  font-size: 0.9rem;
  margin: 0;
}

.guide-url a {
  color: #6366f1;
  text-decoration: none;
}

.guide-url a:hover {
  text-decoration: underline;
}

/* Steps */
.steps-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.step-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 24px;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #6366f1;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1rem;
  flex-shrink: 0;
}

.step-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #111;
  margin: 0;
}

.step-description {
  font-size: 0.95rem;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.6;
}

/* Prompt Template & Example */
.prompt-template,
.example-box {
  background: #f0f0f0;
  border-left: 4px solid #6366f1;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 12px;
  position: relative;
}

.template-label,
.example-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.template-box,
.example-text {
  font-size: 0.9rem;
  color: #555;
  font-family: 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
  padding: 8px;
  background: white;
  border-radius: 4px;
  word-break: break-word;
}

.copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 6px 12px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: #4f46e5;
}

/* Tip Box */
.tip-box {
  background: #f0f7ff;
  border-left: 4px solid #3b82f6;
  padding: 12px;
  border-radius: 6px;
  margin-top: 12px;
}

.tip-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e40af;
  margin: 0 0 4px 0;
}

.tip-text {
  font-size: 0.9rem;
  color: #1e40af;
  margin: 0;
  line-height: 1.5;
}

/* Completion Section */
.completion-section {
  background: #f0fdf4;
  border: 2px solid #10b981;
  border-radius: 10px;
  padding: 24px;
  text-align: center;
}

.completion-section .section-title {
  color: #047857;
  margin-bottom: 8px;
}

.completion-section .section-description {
  color: #059669;
  margin-bottom: 20px;
}

/* Checklist Section */
.checklist-section {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 32px;
  margin-top: 24px;
}

.checklist-container {
  display: flex;
  flex-direction: column;
}

.checklist-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111;
  margin: 0 0 8px 0;
}

.checklist-description {
  font-size: 0.95rem;
  color: #666;
  margin: 0 0 20px 0;
}

.checklist-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.checklist-item:hover {
  background: #f0f0f0;
}

.checklist-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #10b981;
}

.checklist-label {
  font-size: 0.95rem;
  color: #333;
  cursor: pointer;
}

.checklist-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.checklist-actions .btn {
  width: auto;
  min-width: 150px;
}

/* History Section */
.history-section {
  margin-top: 40px;
  padding-top: 40px;
  border-top: 2px solid #e0e0e0;
}

.history-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #111;
  margin: 0 0 20px 0;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.history-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.history-header {
  margin-bottom: 8px;
}

.history-name {
  font-weight: 600;
  color: #111;
  margin: 0 0 4px 0;
  font-size: 0.95rem;
}

.history-date {
  font-size: 0.8rem;
  color: #999;
}

.history-details {
  font-size: 0.85rem;
  color: #666;
  margin: 0 0 8px 0;
}

.history-notes {
  font-size: 0.8rem;
  color: #999;
  margin: 0;
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .design-graphics-app {
    padding: 12px;
  }

  .setup-card {
    padding: 20px;
  }

  .title {
    font-size: 1.5rem;
  }

  .brief-grid {
    grid-template-columns: 1fr;
  }

  .guide-buttons {
    grid-template-columns: 1fr;
  }

  .checklist-section {
    padding: 20px;
  }

  .history-grid {
    grid-template-columns: 1fr;
  }
}
</style>
