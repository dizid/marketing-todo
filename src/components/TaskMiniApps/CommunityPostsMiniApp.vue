<template>
  <div class="app">
    <h2>🌐 Post in Communities</h2>
    <div class="communities-grid">
      <div v-for="community in communities" :key="community.id" class="community-card" @click="selectedCommunity = community.id">
        <div class="icon">{{ community.icon }}</div>
        <h3>{{ community.name }}</h3>
        <p>{{ community.description }}</p>
        <span v-if="selectedCommunity === community.id" class="selected">✓ Selected</span>
      </div>
    </div>
    <div v-if="selectedCommunity" class="details">
      <h3>{{ getSelectedCommunity().name }}</h3>
      <div class="section">
        <h4>Tone Guide</h4>
        <p>{{ getSelectedCommunity().tone }}</p>
      </div>
      <div class="section">
        <h4>Rules</h4>
        <p>{{ getSelectedCommunity().rules }}</p>
      </div>
      <div class="section">
        <h4>Post Template</h4>
        <div class="template-box">{{ getSelectedCommunity().template }}</div>
        <button @click="copyTemplate" class="btn">📋 Copy Template</button>
      </div>
      <label class="checkbox">
        <input v-model="posted[selectedCommunity]" type="checkbox" />
        <span>I've posted here</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { communityPostsTask } from '@/configs/communityPosts.config'

const props = defineProps({ taskConfig: Object, taskData: Object })
const emit = defineEmits(['save'])

const communities = ref(communityPostsTask.communities)
const selectedCommunity = ref(null)
const posted = ref(props.taskData?.posted || {})

const getSelectedCommunity = () => communities.value.find(c => c.id === selectedCommunity.value) || {}
const copyTemplate = async () => {
  await navigator.clipboard.writeText(getSelectedCommunity().template)
  emit('save', { posted: posted.value })
}
</script>

<style scoped>
.app { max-width: 1000px; margin: 0 auto; padding: 20px; }
.communities-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 30px; }
.community-card { background: white; border: 2px solid #e0e0e0; border-radius: 12px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; }
.community-card:hover { border-color: #6366f1; }
.community-card.selected { border-color: #10b981; background: #f0fdf4; }
.icon { font-size: 2.5rem; margin-bottom: 10px; }
.community-card h3 { margin: 0 0 8px 0; }
.community-card p { margin: 0 0 12px 0; font-size: 0.85rem; color: #666; }
.selected { display: block; background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; }
.details { background: white; border: 2px solid #6366f1; border-radius: 12px; padding: 24px; }
.section { margin-bottom: 20px; }
.section h4 { font-weight: 600; margin: 0 0 8px 0; }
.section p { margin: 0; color: #666; }
.template-box { background: #f9f9f9; border-left: 4px solid #6366f1; padding: 12px; border-radius: 6px; margin: 12px 0; }
.btn { background: #6366f1; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
.checkbox { display: flex; align-items: center; gap: 8px; margin-top: 20px; }
</style>
