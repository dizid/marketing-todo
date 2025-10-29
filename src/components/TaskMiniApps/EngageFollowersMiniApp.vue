<template>
  <div class="app">
    <h2 class="title">💬 Engage Followers</h2>
    <p class="subtitle">Template responses for common interactions</p>
    
    <div class="cards-grid">
      <div v-for="type in interactionTypes" :key="type.id" class="card" @click="expandCard(type.id)">
        <div class="card-icon">{{ type.emoji }}</div>
        <h3>{{ type.name }}</h3>
        <p>{{ type.description }}</p>
        <span class="card-button">{{ expanded === type.id ? '−' : '+' }} {{ expanded === type.id ? '3 templates' : 'View' }}</span>
      </div>
    </div>

    <div v-if="expanded" class="expanded-section">
      <div class="modal-header">
        <h3>{{ getCurrentType().name }}</h3>
        <button @click="expandCard(null)" class="close-btn">✕</button>
      </div>

      <div class="scenarios">
        <h4>Example Situations:</h4>
        <ul>
          <li v-for="scenario in getCurrentType().scenarios" :key="scenario">{{ scenario }}</li>
        </ul>
      </div>

      <div class="templates">
        <h4>Response Templates:</h4>
        <div v-for="(template, idx) in getCurrentType().templates" :key="idx" class="template-box">
          <p>{{ template }}</p>
          <button @click="copyToClipboard(template)" class="copy-btn">📋 Copy</button>
        </div>
      </div>

      <label class="checkbox">
        <input type="checkbox" v-model="completed[expanded]" />
        <span>I've reviewed these templates</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { interactionTypes } from '@/configs/engageFollowers.config'

const props = defineProps({ taskConfig: Object, taskData: Object })
const emit = defineEmits(['save'])

const expanded = ref(null)
const completed = ref({})

if (props.taskData?.completed) Object.assign(completed.value, props.taskData.completed)

const expandCard = (id) => { expanded.value = expanded.value === id ? null : id }
const getCurrentType = () => interactionTypes.find(t => t.id === expanded.value) || {}
const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text)
  emit('save', { completed: completed.value })
}
</script>

<style scoped>
.app { max-width: 1000px; margin: 0 auto; padding: 20px; }
.title { font-size: 2rem; font-weight: bold; color: #111; margin: 0 0 10px 0; }
.subtitle { font-size: 1rem; color: #666; margin: 0 0 30px 0; }
.cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 30px; }
.card { background: white; border: 2px solid #e0e0e0; border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.2s; text-align: center; }
.card:hover { border-color: #6366f1; background: #f5f5ff; }
.card-icon { font-size: 2.5rem; margin-bottom: 10px; }
.card h3 { margin: 0 0 8px 0; font-size: 1rem; color: #111; }
.card p { margin: 0 0 12px 0; font-size: 0.85rem; color: #666; }
.card-button { display: inline-block; background: #6366f1; color: white; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; }
.expanded-section { background: white; border: 2px solid #6366f1; border-radius: 12px; padding: 24px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-header h3 { margin: 0; font-size: 1.5rem; }
.close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #999; }
.scenarios, .templates { margin-bottom: 20px; }
.scenarios h4, .templates h4 { font-weight: 600; color: #111; margin: 0 0 12px 0; }
.scenarios ul { list-style: none; padding: 0; margin: 0; }
.scenarios li { padding: 6px 0; color: #666; padding-left: 20px; position: relative; }
.scenarios li::before { content: '•'; position: absolute; left: 0; }
.template-box { background: #f9f9f9; border-left: 4px solid #6366f1; padding: 12px; border-radius: 6px; margin-bottom: 12px; position: relative; }
.template-box p { margin: 0 0 8px 0; color: #666; font-size: 0.95rem; line-height: 1.5; }
.copy-btn { position: absolute; top: 8px; right: 8px; background: #6366f1; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
.checkbox { display: flex; align-items: center; gap: 8px; cursor: pointer; margin-top: 20px; }
.checkbox input { cursor: pointer; }
@media (max-width: 768px) {
  .cards-grid { grid-template-columns: 1fr; }
  .expanded-section { padding: 16px; }
}
</style>
