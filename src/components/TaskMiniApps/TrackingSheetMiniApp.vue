<template>
  <div class="tracking-sheet-app">
    <!-- Header -->
    <div class="header">
      <h2 class="title">📊 Set Up Your Tracking Sheet</h2>
      <p class="subtitle">Monitor your sign-ups, sources, and conversions to measure what's working. Takes 20 minutes to set up.</p>
    </div>

    <!-- Templates Grid -->
    <div class="templates-grid">
      <div
        v-for="template in templates"
        :key="template.id"
        class="template-card"
        :class="{ completed: getStatus(template.id) === 'completed' }"
        @click="openGuide(template)"
      >
        <!-- Card Content -->
        <div class="card-header">
          <span class="icon">{{ template.icon }}</span>
          <span class="status-badge" :class="getStatus(template.id)">
            {{ getStatusLabel(template.id) }}
          </span>
        </div>

        <h3 class="card-title">{{ template.name }}</h3>
        <p class="card-description">{{ template.description }}</p>

        <button class="card-button">
          {{ getStatus(template.id) === 'completed' ? '✅ Done' : '→ View Guide' }}
        </button>
      </div>
    </div>

    <!-- Guide Modal -->
    <div v-if="selectedTemplate" class="modal-overlay" @click.self="closeGuide">
      <div class="modal-content">
        <button class="modal-close" @click="closeGuide">✕</button>

        <div class="modal-header">
          <span class="modal-icon">{{ selectedTemplate.icon }}</span>
          <h3 class="modal-title">{{ selectedTemplate.name }}</h3>
        </div>

        <div class="guide-content">
          <!-- Why -->
          <div class="guide-section">
            <h4 class="guide-label">💡 Why This Matters</h4>
            <p class="guide-text">{{ selectedTemplate.why }}</p>
          </div>

          <!-- What to Do -->
          <div class="guide-section">
            <h4 class="guide-label">📋 What to Do</h4>
            <p class="guide-text">{{ selectedTemplate.instruction }}</p>
          </div>

          <!-- Specs -->
          <div class="guide-section specs-box">
            <h4 class="guide-label">📐 What's Included</h4>
            <p class="guide-text">{{ selectedTemplate.specs }}</p>
          </div>

          <!-- Download/Link Buttons -->
          <div v-if="selectedTemplate.id === 'google-sheets'" class="guide-section">
            <!-- Template Columns -->
            <div class="columns-box">
              <h4 class="guide-label">📋 Column Headers to Copy</h4>
              <div class="columns-display">
                <div v-for="column in selectedTemplate.templateColumns" :key="column" class="column-tag">
                  {{ column }}
                </div>
              </div>
              <p class="button-subtitle">Copy these headers to your Google Sheet. They define what data you'll track.</p>
            </div>

            <!-- Action Button -->
            <a href="https://sheets.google.com" target="_blank" class="action-button google-sheets">
              {{ selectedTemplate.actionText }}
            </a>
            <p class="button-subtitle">Opens Google Sheets in a new tab. Create a blank sheet and paste the column headers above.</p>
          </div>

          <div v-else-if="selectedTemplate.id === 'excel'" class="guide-section">
            <button @click="downloadExcelTemplate" class="action-button excel">
              {{ selectedTemplate.downloadText }}
            </button>
            <p class="button-subtitle">Downloads to your computer. Open with Excel or Google Sheets.</p>
          </div>

          <!-- Metrics Guide -->
          <div v-if="selectedTemplate.id === 'metrics-guide'" class="guide-section">
            <div class="metrics-list">
              <div v-for="metric in metricsGuide.metrics" :key="metric.name" class="metric-item">
                <div class="metric-header">
                  <span class="metric-emoji">{{ metric.emoji }}</span>
                  <h5 class="metric-name">{{ metric.name }}</h5>
                </div>
                <p class="metric-text"><strong>What it is:</strong> {{ metric.description }}</p>
                <p class="metric-text"><strong>Why it matters:</strong> {{ metric.why }}</p>
                <p class="metric-text"><strong>Example:</strong> {{ metric.example }}</p>
              </div>
            </div>
          </div>

          <!-- Pro Tip -->
          <div class="guide-section help-box">
            <h4 class="guide-label">💬 Pro Tip</h4>
            <p class="guide-text">{{ selectedTemplate.helpText }}</p>
          </div>

          <!-- Checkbox -->
          <div class="checkbox-section">
            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="getStatus(selectedTemplate.id) === 'completed'"
                @change="toggleCompletion(selectedTemplate.id)"
              />
              <span>I've set up this template</span>
            </label>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeGuide">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { templates, metricsGuide } from '../../configs/trackingSheet.config'

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
const selectedTemplate = ref(null)

// Initialize completion status from saved data
const templateStatus = ref({})
if (props.taskData && props.taskData.templateStatus) {
  Object.assign(templateStatus.value, props.taskData.templateStatus)
}

// Initialize all templates as 'not-started' if not in data
templates.forEach(template => {
  if (!templateStatus.value[template.id]) {
    templateStatus.value[template.id] = 'not-started'
  }
})

// Methods
const openGuide = (template) => {
  selectedTemplate.value = template
}

const closeGuide = () => {
  selectedTemplate.value = null
}

const getStatus = (templateId) => {
  return templateStatus.value[templateId] || 'not-started'
}

const getStatusLabel = (templateId) => {
  const status = getStatus(templateId)
  switch (status) {
    case 'completed':
      return '✅ Done'
    case 'in-progress':
      return '⏳ In Progress'
    default:
      return 'Not Started'
  }
}

const toggleCompletion = (templateId) => {
  const currentStatus = templateStatus.value[templateId]
  templateStatus.value[templateId] = currentStatus === 'completed' ? 'not-started' : 'completed'
}

const downloadExcelTemplate = () => {
  // Generate simple Excel file
  const csvContent = [
    ['Date', 'Source', 'User Name', 'Email', 'Product Usage (days)', 'Paid Customer', 'Revenue', 'Notes'],
    ['2025-01-15', 'Twitter', 'John Doe', 'john@example.com', 5, 'Yes', 29, 'Loves the feature'],
    ['2025-01-16', 'Product Hunt', 'Jane Smith', 'jane@example.com', 2, 'No', 0, 'Still exploring'],
    ['2025-01-17', 'Friend Referral', 'Bob Wilson', 'bob@example.com', 12, 'Yes', 99, 'Enterprise plan']
  ]

  let csv = csvContent.map(row =>
    row.map(cell => {
      // Escape quotes and wrap in quotes if needed
      const str = String(cell)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"'
      }
      return str
    }).join(',')
  ).join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'tracking-sheet-template.csv'
  link.click()
}

// Watch for status changes and auto-save
watch(
  () => templateStatus.value,
  (newStatus) => {
    emit('save', {
      templateStatus: newStatus
    })
  },
  { deep: true }
)
</script>

<style scoped>
.tracking-sheet-app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

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

/* Templates Grid */
.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.template-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.template-card:hover {
  border-color: #6366f1;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
  transform: translateY(-4px);
}

.template-card.completed {
  border-color: #10b981;
  background: #f0fdf4;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.icon {
  font-size: 2.5rem;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  background: #f0f0f0;
  color: #666;
}

.status-badge.completed {
  background: #d1fae5;
  color: #047857;
}

.status-badge.in-progress {
  background: #fef3c7;
  color: #d97706;
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #111;
  margin: 0 0 8px 0;
}

.card-description {
  font-size: 0.95rem;
  color: #666;
  margin: 0 0 16px 0;
  flex-grow: 1;
  line-height: 1.5;
}

.card-button {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: auto;
}

.card-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
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
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
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
  z-index: 10;
}

.modal-close:hover {
  color: #333;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 30px 24px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-icon {
  font-size: 2rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111;
  margin: 0;
}

.guide-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.guide-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.guide-label {
  font-weight: 600;
  color: #111;
  margin: 0;
  font-size: 0.95rem;
}

.guide-text {
  color: #666;
  margin: 0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.specs-box {
  background: #f3f4f6;
  border-left: 4px solid #8b5cf6;
  padding: 12px;
  border-radius: 4px;
}

.columns-box {
  background: #f0f7ff;
  border-left: 4px solid #3b82f6;
  padding: 12px;
  border-radius: 4px;
}

.columns-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

.column-tag {
  background: white;
  border: 2px solid #3b82f6;
  color: #1e40af;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.action-button {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  padding: 14px 20px;
  border-radius: 8px;
  text-decoration: none;
  text-align: center;
  font-weight: 600;
  display: block;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
}

.action-button.google-sheets {
  background: linear-gradient(135deg, #34a853, #2d7e4a);
}

.action-button.excel {
  background: linear-gradient(135deg, #1f5e3d, #165a3a);
}

.button-subtitle {
  font-size: 0.85rem;
  color: #999;
  margin: 8px 0 0 0;
  text-align: center;
}

.metrics-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-item {
  background: #f9f9f9;
  border-left: 4px solid #6366f1;
  padding: 12px;
  border-radius: 4px;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.metric-emoji {
  font-size: 1.2rem;
}

.metric-name {
  font-weight: 600;
  color: #111;
  margin: 0;
  font-size: 0.95rem;
}

.metric-text {
  color: #666;
  margin: 4px 0;
  line-height: 1.5;
  font-size: 0.9rem;
}

.help-box {
  background: #f0f7ff;
  border-left: 4px solid #6366f1;
  padding: 12px;
  border-radius: 4px;
}

.checkbox-section {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: #333;
  font-weight: 500;
  margin: 0;
}

.checkbox-label input[type='checkbox'] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #6366f1;
}

.modal-actions {
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* Responsive */
@media (max-width: 768px) {
  .templates-grid {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 1.5rem;
  }

  .modal-content {
    max-width: 100%;
  }
}
</style>
