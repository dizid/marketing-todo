<template>
  <div class="app">
    <h2>🎁 Run Giveaway/Contest</h2>
    <div class="steps">
      <button v-for="step in steps" :key="step.number" @click="currentStep = step.number" :class="{ active: currentStep === step.number }" class="step-btn">
        Step {{ step.number }}: {{ step.title }}
      </button>
    </div>
    <div class="content">
      <h3>{{ getCurrentStep().title }}</h3>
      <div class="form-group" v-for="field in getCurrentStep().fields" :key="field">
        <label>{{ formatLabel(field) }}</label>
        <input v-model="data[field]" type="text" class="input" />
      </div>
      <button @click="save" class="btn-primary">Save & Continue</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { giveawayTask } from '@/configs/giveaway.config'

const props = defineProps({ taskConfig: Object, taskData: Object })
const emit = defineEmits(['save'])

const currentStep = ref(1)
const steps = ref(giveawayTask.steps)
const data = ref(props.taskData || {})

const getCurrentStep = () => steps.value.find(s => s.number === currentStep.value) || {}
const formatLabel = (field) => field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
const save = () => { emit('save', data.value) }
</script>

<style scoped>
.app { max-width: 800px; margin: 0 auto; padding: 20px; }
h2 { font-size: 1.8rem; margin: 0 0 20px 0; }
.steps { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.step-btn { padding: 8px 12px; background: #f0f0f0; border: 2px solid #e0e0e0; border-radius: 6px; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
.step-btn.active { background: #6366f1; color: white; border-color: #6366f1; }
.content { background: white; border: 2px solid #e0e0e0; border-radius: 12px; padding: 24px; }
.content h3 { margin: 0 0 20px 0; font-size: 1.3rem; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-weight: 600; margin-bottom: 6px; font-size: 0.95rem; }
.input { width: 100%; padding: 10px 12px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 0.95rem; }
.input:focus { outline: none; border-color: #6366f1; }
.btn-primary { background: #6366f1; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 16px; }
.btn-primary:hover { background: #4f46e5; }
</style>
