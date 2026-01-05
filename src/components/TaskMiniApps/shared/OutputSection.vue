<template>
  <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
    <h4 class="font-semibold text-gray-900 mb-4">Results & Save</h4>

    <!-- Saved Items -->
    <div v-if="items.length > 0" class="space-y-3 mb-4">
      <div v-for="(item, index) in items" :key="index" class="bg-white border border-gray-200 rounded-lg p-3">
        <div class="flex justify-between items-start gap-2 mb-2">
          <div class="flex-1">
            <h5 class="text-sm font-medium text-gray-900">{{ item.label || `Item ${index + 1}` }}</h5>
            <p v-if="item.description" class="text-xs text-gray-500 mt-1">{{ item.description }}</p>
          </div>
          <button
            @click="removeItem(index)"
            class="text-red-500 hover:text-red-700 text-xs font-medium"
          >
            Archive
          </button>
        </div>
        <p class="text-xs text-gray-600 whitespace-pre-wrap bg-gray-50 p-2 rounded border border-gray-100">
          {{ typeof item.content === 'string' ? item.content : JSON.stringify(item.content, null, 2) }}
        </p>
      </div>
    </div>

    <div v-else class="text-center py-6 text-gray-500 text-sm">
      No items saved yet
    </div>

    <!-- Actions -->
    <div v-if="items.length > 0" class="flex gap-2 mt-4">
      <button
        @click="exportJSON"
        class="flex-1 px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
      >
        📥 Export JSON
      </button>
      <button
        @click="clearAll"
        class="flex-1 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 rounded transition"
      >
        🗑️ Clear All
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  exportFilename: {
    type: String,
    default: 'export'
  }
})

const emit = defineEmits(['update:items', 'remove', 'clear'])

const localItems = ref([...props.items])

watch(
  () => props.items,
  (newItems) => {
    localItems.value = [...newItems]
  }
)

const removeItem = (index) => {
  localItems.value.splice(index, 1)
  emit('update:items', localItems.value)
  emit('remove', index)
}

const clearAll = () => {
  if (confirm('Are you sure? This cannot be undone.')) {
    localItems.value = []
    emit('update:items', [])
    emit('clear')
  }
}

const exportJSON = () => {
  const dataStr = JSON.stringify(localItems.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${props.exportFilename}-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
button {
  transition: all 0.2s ease-in-out;
}
</style>
