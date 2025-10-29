<template>
  <div class="prepare-assets-app">
    <!-- Header -->
    <div class="header">
      <h2 class="title">🎨 Prepare Your Assets</h2>
      <p class="subtitle">Create professional logos, images, videos, and branding. Each asset takes 15-30 minutes.</p>
    </div>

    <!-- Assets Grid -->
    <div class="assets-grid">
      <div
        v-for="asset in assets"
        :key="asset.id"
        class="asset-card"
        :class="{ completed: getStatus(asset.id) === 'completed' }"
        @click="openGuide(asset)"
      >
        <!-- Card Content -->
        <div class="card-header">
          <span class="icon">{{ asset.icon }}</span>
          <span class="status-badge" :class="getStatus(asset.id)">
            {{ getStatusLabel(asset.id) }}
          </span>
        </div>

        <h3 class="card-title">{{ asset.name }}</h3>
        <p class="card-description">{{ asset.description }}</p>

        <button class="card-button">
          {{ getStatus(asset.id) === 'completed' ? '✅ Done' : '→ View Guide' }}
        </button>
      </div>
    </div>

    <!-- Guide Modal -->
    <div v-if="selectedAsset" class="modal-overlay" @click.self="closeGuide">
      <div class="modal-content">
        <button class="modal-close" @click="closeGuide">✕</button>

        <div class="modal-header">
          <span class="modal-icon">{{ selectedAsset.icon }}</span>
          <h3 class="modal-title">{{ selectedAsset.name }}</h3>
        </div>

        <div class="guide-content">
          <!-- Why -->
          <div class="guide-section">
            <h4 class="guide-label">💡 Why This Matters</h4>
            <p class="guide-text">{{ selectedAsset.why }}</p>
          </div>

          <!-- What to Do -->
          <div class="guide-section">
            <h4 class="guide-label">📋 What to Create</h4>
            <p class="guide-text">{{ selectedAsset.instruction }}</p>
          </div>

          <!-- Specs -->
          <div class="guide-section specs-box">
            <h4 class="guide-label">📐 Technical Specs</h4>
            <p class="guide-text">{{ selectedAsset.specs }}</p>
          </div>

          <!-- Tools -->
          <div class="guide-section">
            <h4 class="guide-label">🛠️ Recommended Tools</h4>
            <div class="tools-list">
              <a
                v-for="tool in selectedAsset.tools"
                :key="tool.name"
                :href="tool.url"
                target="_blank"
                class="tool-link"
              >
                {{ tool.name }} ↗️
              </a>
            </div>
          </div>

          <!-- Pro Tip -->
          <div class="guide-section help-box">
            <h4 class="guide-label">💬 Pro Tip</h4>
            <p class="guide-text">{{ selectedAsset.helpText }}</p>
          </div>

          <!-- Checkbox -->
          <div class="checkbox-section">
            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="getStatus(selectedAsset.id) === 'completed'"
                @change="toggleCompletion(selectedAsset.id)"
              />
              <span>I've created this asset</span>
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
import { assets } from '../../configs/prepareAssets.config'

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
const selectedAsset = ref(null)

// Initialize completion status from saved data
const assetStatus = ref({})
if (props.taskData && props.taskData.assetStatus) {
  Object.assign(assetStatus.value, props.taskData.assetStatus)
}

// Initialize all assets as 'not-started' if not in data
assets.forEach(asset => {
  if (!assetStatus.value[asset.id]) {
    assetStatus.value[asset.id] = 'not-started'
  }
})

// Methods
const openGuide = (asset) => {
  selectedAsset.value = asset
}

const closeGuide = () => {
  selectedAsset.value = null
}

const getStatus = (assetId) => {
  return assetStatus.value[assetId] || 'not-started'
}

const getStatusLabel = (assetId) => {
  const status = getStatus(assetId)
  switch (status) {
    case 'completed':
      return '✅ Done'
    case 'in-progress':
      return '⏳ In Progress'
    default:
      return 'Not Started'
  }
}

const toggleCompletion = (assetId) => {
  const currentStatus = assetStatus.value[assetId]
  assetStatus.value[assetId] = currentStatus === 'completed' ? 'not-started' : 'completed'
}

// Watch for status changes and auto-save
watch(
  () => assetStatus.value,
  (newStatus) => {
    emit('save', {
      assetStatus: newStatus
    })
  },
  { deep: true }
)
</script>

<style scoped>
.prepare-assets-app {
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

/* Assets Grid */
.assets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.asset-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.asset-card:hover {
  border-color: #6366f1;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
  transform: translateY(-4px);
}

.asset-card.completed {
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
  max-width: 500px;
  w-full: 100%;
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

.tools-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tool-link {
  background: #f0f7ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
  padding: 10px 12px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s;
  display: inline-block;
}

.tool-link:hover {
  background: #dbeafe;
  border-color: #60a5fa;
  transform: translateX(2px);
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
  .assets-grid {
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
