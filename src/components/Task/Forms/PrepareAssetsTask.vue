<template>
  <div class="space-y-6">
    <!-- Overview -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p class="text-sm text-blue-900">
        <strong>Prepare Marketing Assets:</strong> Organize and track all visual, video, and brand materials needed for your campaign.
      </p>
    </div>

    <!-- Asset Categories -->
    <div class="space-y-6">
      <!-- Visual Assets -->
      <div>
        <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>🖼️</span> Visual Assets
          <span class="text-xs font-normal text-gray-500">({{ visualAssets.length }} items)</span>
        </h4>
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <div
            v-for="(asset, idx) in visualAssets"
            :key="idx"
            class="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition"
          >
            <input
              v-model="asset.completed"
              type="checkbox"
              class="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <div class="flex-1 min-w-0">
              <h5 class="font-medium text-gray-900">{{ asset.name }}</h5>
              <p class="text-xs text-gray-600 mt-1">{{ asset.description }}</p>
              <input
                v-model="asset.notes"
                type="text"
                placeholder="Add notes or file location..."
                class="mt-2 w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button
              @click="removeVisualAsset(idx)"
              class="text-red-500 hover:text-red-700 text-sm font-medium whitespace-nowrap"
            >
              Remove
            </button>
          </div>
          <button
            @click="addVisualAsset"
            class="w-full px-3 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 transition"
          >
            + Add Visual Asset
          </button>
        </div>
      </div>

      <!-- Video Assets -->
      <div>
        <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>🎥</span> Video Assets
          <span class="text-xs font-normal text-gray-500">({{ videoAssets.length }} items)</span>
        </h4>
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <div
            v-for="(asset, idx) in videoAssets"
            :key="idx"
            class="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition"
          >
            <input
              v-model="asset.completed"
              type="checkbox"
              class="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <div class="flex-1 min-w-0">
              <h5 class="font-medium text-gray-900">{{ asset.name }}</h5>
              <p class="text-xs text-gray-600 mt-1">{{ asset.description }}</p>
              <div class="grid grid-cols-2 gap-2 mt-2 text-xs">
                <input
                  v-model="asset.duration"
                  type="text"
                  placeholder="Duration (e.g., 2 min)"
                  class="px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                <input
                  v-model="asset.notes"
                  type="text"
                  placeholder="Link or location..."
                  class="px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
            <button
              @click="removeVideoAsset(idx)"
              class="text-red-500 hover:text-red-700 text-sm font-medium whitespace-nowrap"
            >
              Remove
            </button>
          </div>
          <button
            @click="addVideoAsset"
            class="w-full px-3 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 transition"
          >
            + Add Video Asset
          </button>
        </div>
      </div>

      <!-- Branding Elements -->
      <div>
        <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>🎨</span> Branding Elements
          <span class="text-xs font-normal text-gray-500">(4 items)</span>
        </h4>
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Primary Color</label>
                <div class="flex gap-2 items-center">
                  <input
                    v-model="formData.primaryColor"
                    type="color"
                    class="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    v-model="formData.primaryColorHex"
                    type="text"
                    placeholder="#000000"
                    class="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Secondary Color</label>
                <div class="flex gap-2 items-center">
                  <input
                    v-model="formData.secondaryColor"
                    type="color"
                    class="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    v-model="formData.secondaryColorHex"
                    type="text"
                    placeholder="#000000"
                    class="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Primary Font</label>
              <input
                v-model="formData.primaryFont"
                type="text"
                placeholder="e.g., Inter, Poppins, Georgia"
                class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Logo Format</label>
              <select
                v-model="formData.logoFormat"
                class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select format</option>
                <option value="svg">SVG</option>
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="multiple">Multiple formats</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Asset Completion Summary -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-900 mb-3">Asset Completion Status</h4>
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-700">Visual Assets</span>
          <span class="text-sm font-medium text-gray-900">{{ visualCompletedCount }}/{{ visualAssets.length }}</span>
        </div>
        <div class="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
          <div
            class="h-full bg-indigo-600 transition-all duration-300"
            :style="{ width: visualAssets.length > 0 ? (visualCompletedCount / visualAssets.length) * 100 + '%' : '0%' }"
          ></div>
        </div>

        <div class="flex justify-between items-center mt-3">
          <span class="text-sm text-gray-700">Video Assets</span>
          <span class="text-sm font-medium text-gray-900">{{ videoCompletedCount }}/{{ videoAssets.length }}</span>
        </div>
        <div class="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
          <div
            class="h-full bg-indigo-600 transition-all duration-300"
            :style="{ width: videoAssets.length > 0 ? (videoCompletedCount / videoAssets.length) * 100 + '%' : '0%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Brand Guidelines -->
    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">📋 Brand Style Guide</label>
      <textarea
        v-model="formData.brandGuide"
        placeholder="Document your brand voice, tone, visual guidelines, usage rules, and design principles..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[100px]"
      ></textarea>
    </div>

    <!-- Asset Storage Locations -->
    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">📁 Asset Storage Locations</label>
      <textarea
        v-model="formData.storageLocations"
        placeholder="Document where assets are stored: Dropbox path, Google Drive folder, GitHub repo, cloud bucket URL, etc. Make them easily accessible to your team."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[80px]"
      ></textarea>
    </div>

    <!-- Additional Notes -->
    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">📝 Additional Notes</label>
      <textarea
        v-model="formData.notes"
        placeholder="Special instructions, restrictions, licensing info, or other important asset notes..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[80px]"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  taskId: String,
  taskData: Object
})

const emit = defineEmits(['save'])

const formData = ref({
  primaryColor: '#000000',
  primaryColorHex: '#000000',
  secondaryColor: '#ffffff',
  secondaryColorHex: '#ffffff',
  primaryFont: '',
  logoFormat: '',
  brandGuide: '',
  storageLocations: '',
  notes: '',
  visualAssets: [],
  videoAssets: []
})

const visualAssets = ref([
  { name: 'Demo Video', description: 'Screen recording of key features', completed: false, notes: '' },
  { name: 'Product Screenshots', description: '5-10 high-quality UI screenshots', completed: false, notes: '' },
  { name: 'Social Media Banner', description: '1200x630px for social sharing', completed: false, notes: '' }
])

const videoAssets = ref([
  { name: 'Feature Demo', description: '2-3 min walkthrough of main features', completed: false, duration: '', notes: '' },
  { name: 'User Tutorial', description: '5 min getting started guide', completed: false, duration: '', notes: '' }
])

// Load existing data
watch(
  () => props.taskData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formData.value = {
        ...formData.value,
        ...newData
      }
      if (newData.visualAssets) visualAssets.value = newData.visualAssets
      if (newData.videoAssets) videoAssets.value = newData.videoAssets
    }
  },
  { immediate: true }
)

// Computed: Visual assets completion
const visualCompletedCount = computed(() => {
  return visualAssets.value.filter(a => a.completed).length
})

// Computed: Video assets completion
const videoCompletedCount = computed(() => {
  return videoAssets.value.filter(a => a.completed).length
})

// Add visual asset
const addVisualAsset = () => {
  visualAssets.value.push({
    name: '',
    description: '',
    completed: false,
    notes: ''
  })
  emitSave()
}

// Remove visual asset
const removeVisualAsset = (idx) => {
  visualAssets.value.splice(idx, 1)
  emitSave()
}

// Add video asset
const addVideoAsset = () => {
  videoAssets.value.push({
    name: '',
    description: '',
    completed: false,
    duration: '',
    notes: ''
  })
  emitSave()
}

// Remove video asset
const removeVideoAsset = (idx) => {
  videoAssets.value.splice(idx, 1)
  emitSave()
}

// Emit save with all data
const emitSave = () => {
  emit('save', {
    ...formData.value,
    visualAssets: visualAssets.value,
    videoAssets: videoAssets.value
  })
}

// Auto-save on all changes
watch(formData, emitSave, { deep: true })
watch(visualAssets, emitSave, { deep: true })
watch(videoAssets, emitSave, { deep: true })
</script>

<style scoped>
input[type="checkbox"] {
  transition: all 0.2s ease-in-out;
}

input[type="checkbox"]:hover {
  transform: scale(1.1);
}

textarea {
  transition: all 0.2s ease-in-out;
}

textarea:focus {
  border-color: #e0e7ff;
}
</style>
