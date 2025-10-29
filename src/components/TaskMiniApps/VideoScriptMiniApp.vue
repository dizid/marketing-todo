<template>
  <div class="app">
    <h2>🎥 Video Script Builder</h2>
    <div class="sections">
      <button v-for="section in sections" :key="section.id" @click="activeSection = section.id" :class="{ active: activeSection === section.id }" class="section-btn">
        {{ section.title }}
      </button>
    </div>
    <div v-if="currentSection" class="editor">
      <h3>{{ currentSection.title }} ({{ currentSection.target }}s)</h3>
      <p class="guidance">{{ currentSection.guidance }}</p>
      <textarea v-model="scripts[activeSection]" placeholder="Write your script here..." class="textarea"></textarea>
      <div class="stats">
        <span>Words: {{ (scripts[activeSection] || '').split(/\s+/).length }}</span>
        <span>Target: {{ currentSection.target }} seconds</span>
      </div>
      <button @click="save" class="btn-primary">Save Script</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { videoScriptTask } from '@/configs/videoScript.config'

const props = defineProps({ taskConfig: Object, taskData: Object })
const emit = defineEmits(['save'])

const sections = ref(videoScriptTask.sections)
const activeSection = ref('hook')
const scripts = ref(props.taskData?.scripts || {})

const currentSection = computed(() => {
  return sections.value.find(s => s.id === activeSection.value)
})

const save = () => { emit('save', { scripts: scripts.value }) }
</script>

<style scoped>
.app { max-width: 900px; margin: 0 auto; padding: 20px; }
h2 { margin: 0 0 20px 0; }
.sections { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.section-btn { padding: 8px 12px; background: #f0f0f0; border: 2px solid #e0e0e0; border-radius: 6px; cursor: pointer; }
.section-btn.active { background: #6366f1; color: white; }
.editor { background: white; border: 2px solid #e0e0e0; border-radius: 12px; padding: 24px; }
.editor h3 { margin: 0 0 8px 0; }
.guidance { color: #666; margin: 0 0 16px 0; font-size: 0.95rem; }
.textarea { width: 100%; min-height: 200px; padding: 12px; border: 2px solid #e0e0e0; border-radius: 6px; font-family: inherit; resize: vertical; }
.stats { display: flex; gap: 20px; margin: 12px 0; font-size: 0.9rem; color: #666; }
.btn-primary { background: #6366f1; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; margin-top: 12px; }
</style>
