<template>
  <!-- Task Modal Wrapper -->
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-4" @click="handleBackdropClick">
    <div
      class="bg-white w-full h-full md:h-auto md:max-h-[90vh] rounded-none md:rounded-lg shadow-xl overflow-y-auto flex flex-col"
      :class="customComponent ? 'md:max-w-6xl' : 'md:max-w-3xl'"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="sticky top-0 px-6 py-4 md:border-b border-gray-200 flex justify-between items-start bg-white">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ taskMetadata?.icon }} {{ taskMetadata?.name }}
          </h3>
          <p class="text-sm text-gray-600 mt-1 hidden md:block">{{ taskMetadata?.description }}</p>
        </div>
        <button
          @click="handleClose"
          class="text-gray-500 hover:text-gray-700 text-2xl ml-4 flex-shrink-0"
        >
          ✕
        </button>
      </div>

      <!-- Modal Content - Custom or Unified Task Component -->
      <div v-if="taskConfig" class="px-4 md:px-6 py-4 h-full md:h-auto">
        <!-- Custom Component (e.g., Landing Page Creator) -->
        <component
          v-if="customComponent"
          :is="customComponent"
          :task-config="taskConfig"
          :task-data="currentTaskData"
          @save="handleSave"
        />

        <!-- Default: Unified Task Component -->
        <UnifiedTaskComponent
          v-else
          :task-id="taskId"
          :task-config="taskConfig"
          :initial-data="currentTaskData"
          @save="handleSave"
        />
      </div>

      <!-- Fallback: Simple Task (checkbox + notes) -->
      <div v-else class="px-4 md:px-6 py-4">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              v-model="notes"
              placeholder="Add any notes for this task..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-vertical min-h-[100px]"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="sticky bottom-0 px-6 py-4 bg-gray-50 md:border-t border-gray-200 flex justify-end gap-3">
        <button
          @click="handleClose"
          class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition font-medium text-sm"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * TaskModal Component - Refactored for Unified Task System
 *
 * Generic modal wrapper for all tasks (simple or with AI generation)
 * Features:
 * - Unified task configuration loading
 * - Automatic UnifiedTaskComponent rendering
 * - Auto-save via Pinia store
 * - Fallback for basic tasks (notes only)
 */

import { ref, computed, watch } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { getTaskMetadata } from '@/services/taskRegistry'
import { unifiedTasksMap } from '@/configs/unifiedTasks'
import UnifiedTaskComponent from '@/components/UnifiedTaskComponent.vue'
import LandingPageCreatorAssistant from '@/components/TaskMiniApps/LandingPageCreatorAssistant.vue'
import ConnectAccountsMiniApp from '@/components/TaskMiniApps/ConnectAccountsMiniApp.vue'
import PrepareAssetsMiniApp from '@/components/TaskMiniApps/PrepareAssetsMiniApp.vue'
import TrackingSheetMiniApp from '@/components/TaskMiniApps/TrackingSheetMiniApp.vue'
import WriteBlogPostMiniApp from '@/components/TaskMiniApps/WriteBlogPostMiniApp.vue'
import DesignGraphicsMiniApp from '@/components/TaskMiniApps/DesignGraphicsMiniApp.vue'
import EngageFollowersMiniApp from '@/components/TaskMiniApps/EngageFollowersMiniApp.vue'
import GiveawayMiniApp from '@/components/TaskMiniApps/GiveawayMiniApp.vue'
import VideoScriptMiniApp from '@/components/TaskMiniApps/VideoScriptMiniApp.vue'
import CommunityPostsMiniApp from '@/components/TaskMiniApps/CommunityPostsMiniApp.vue'
import OutreachMiniApp from '@/components/TaskMiniApps/OutreachMiniApp.vue'
import WebinarMiniApp from '@/components/TaskMiniApps/WebinarMiniApp.vue'
import FeedbackCollectionMiniApp from '@/components/TaskMiniApps/FeedbackCollectionMiniApp.vue'
import PublishUpdatesMiniApp from '@/components/TaskMiniApps/PublishUpdatesMiniApp.vue'
import IterateFeaturesMiniApp from '@/components/TaskMiniApps/IterateFeaturesMiniApp.vue'
import ChangelogMiniApp from '@/components/TaskMiniApps/ChangelogMiniApp.vue'
import FeaturePrioritizationMiniApp from '@/components/TaskMiniApps/FeaturePrioritizationMiniApp.vue'
import AnalyticsSetupMiniApp from '@/components/TaskMiniApps/AnalyticsSetupMiniApp.vue'
import ChannelOptimizerMiniApp from '@/components/TaskMiniApps/ChannelOptimizerMiniApp.vue'
import ChannelAnalyzerMiniApp from '@/components/TaskMiniApps/ChannelAnalyzerMiniApp.vue'
import RoiCalculatorMiniApp from '@/components/TaskMiniApps/RoiCalculatorMiniApp.vue'
import PaidAdsLaunchMiniApp from '@/components/TaskMiniApps/PaidAdsLaunchMiniApp.vue'
import PaidAdsOptimizeMiniApp from '@/components/TaskMiniApps/PaidAdsOptimizeMiniApp.vue'

// Map of custom component names to their imported components
const customComponentMap = {
  'LandingPageCreatorAssistant': LandingPageCreatorAssistant,
  'ConnectAccountsMiniApp': ConnectAccountsMiniApp,
  'PrepareAssetsMiniApp': PrepareAssetsMiniApp,
  'TrackingSheetMiniApp': TrackingSheetMiniApp,
  'WriteBlogPostMiniApp': WriteBlogPostMiniApp,
  'DesignGraphicsMiniApp': DesignGraphicsMiniApp,
  'EngageFollowersMiniApp': EngageFollowersMiniApp,
  'GiveawayMiniApp': GiveawayMiniApp,
  'VideoScriptMiniApp': VideoScriptMiniApp,
  'CommunityPostsMiniApp': CommunityPostsMiniApp,
  'OutreachMiniApp': OutreachMiniApp,
  'WebinarMiniApp': WebinarMiniApp,
  'FeedbackCollectionMiniApp': FeedbackCollectionMiniApp,
  'PublishUpdatesMiniApp': PublishUpdatesMiniApp,
  'IterateFeaturesMiniApp': IterateFeaturesMiniApp,
  'ChangelogMiniApp': ChangelogMiniApp,
  'FeaturePrioritizationMiniApp': FeaturePrioritizationMiniApp,
  'AnalyticsSetupMiniApp': AnalyticsSetupMiniApp,
  'ChannelOptimizerMiniApp': ChannelOptimizerMiniApp,
  'ChannelAnalyzerMiniApp': ChannelAnalyzerMiniApp,
  'RoiCalculatorMiniApp': RoiCalculatorMiniApp,
  'PaidAdsLaunchMiniApp': PaidAdsLaunchMiniApp,
  'PaidAdsOptimizeMiniApp': PaidAdsOptimizeMiniApp
}

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  taskId: {
    type: [String, null],
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'save'])

// Stores
const projectStore = useProjectStore()

// State
const notes = ref('')

// Computed
const taskMetadata = computed(() => getTaskMetadata(props.taskId))

const taskConfig = computed(() => {
  if (!props.taskId) return null
  return unifiedTasksMap[props.taskId] || null
})

const customComponent = computed(() => {
  if (!taskConfig.value?.customComponent) return null
  return customComponentMap[taskConfig.value.customComponent] || null
})

const currentTaskData = computed(() => {
  if (!projectStore.projectData.taskData) {
    return {}
  }
  return projectStore.projectData.taskData[props.taskId] || {}
})

// Methods
const handleBackdropClick = (e) => {
  // Only close if clicking on the backdrop itself, not the modal
  if (e.target === e.currentTarget) {
    handleClose()
  }
}

const handleSave = async (data) => {
  // This is called on every form change (auto-save)
  // Don't close the modal - only close on explicit user action
  // Just emit the event for parent to handle
  emit('save', { taskId: props.taskId, data })
}

const handleClose = () => {
  // Reset local state
  notes.value = ''
  emit('close')
}
</script>

<style scoped>
/* Modal animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

div[class*="fixed"] {
  animation: slideIn 0.2s ease-out;
}
</style>
