<template>
  <div class="app">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <div class="content">
      <div class="form-group">
        <label>Add your input:</label>
        <textarea v-model="userInput" placeholder="Start typing..." class="textarea"></textarea>
      </div>
      <button @click="save" class="btn-primary">Save Progress</button>
    </div>
    <div v-if="items.length" class="items">
      <h3>Your Items</h3>
      <div v-for="(item, idx) in items" :key="idx" class="item">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ taskConfig: Object, taskData: Object })
const emit = defineEmits(['save'])

const title = 'ChannelAnalyzer Task'
const description = 'Track and manage your ChannelAnalyzer'
const userInput = ref('')
const items = ref(props.taskData?.items || [])

const save = () => {
  if (userInput.value) {
    items.value.push(userInput.value)
    userInput.value = ''
  }
  emit('save', { items: items.value })
}
</script>

<style scoped>
.app { max-width: 800px; margin: 0 auto; padding: 20px; }
h2 { margin: 0 0 10px 0; }
p { color: #666; margin: 0 0 20px 0; }
.content { background: white; border: 2px solid #e0e0e0; border-radius: 12px; padding: 20px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-weight: 600; margin-bottom: 8px; }
.textarea { width: 100%; min-height: 100px; padding: 12px; border: 2px solid #e0e0e0; border-radius: 6px; font-family: inherit; }
.btn-primary { background: #6366f1; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; }
.items { margin-top: 30px; }
.items h3 { margin: 0 0 12px 0; }
.item { background: #f9f9f9; border-left: 4px solid #6366f1; padding: 12px; margin-bottom: 8px; border-radius: 4px; }
</style>
