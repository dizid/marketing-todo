<template>
  <!-- Add Tasks Modal -->
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="sticky top-0 px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <h3 class="text-lg font-semibold text-gray-900">
          Add Tasks Back to Project
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>
      </div>

      <!-- Modal Content -->
      <div class="px-6 py-4">
        <p class="text-sm text-gray-600 mb-4">
          Select tasks to add back to your project. Removed tasks don't count toward your progress.
        </p>

        <div v-if="removedTasks.length === 0" class="text-center py-8">
          <p class="text-gray-500">No removed tasks. All tasks are currently active.</p>
        </div>

        <div v-else class="space-y-3">
          <!-- Removed Tasks by Category -->
          <div v-for="category in removedTasksByCategory" :key="category.name">
            <h4 class="font-semibold text-gray-900 mb-2">{{ category.label }}</h4>
            <div class="space-y-2 ml-4">
              <div
                v-for="task in category.removedItems"
                :key="task.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
              >
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ task.name }}</p>
                  <p class="text-sm text-gray-600">{{ task.description }}</p>
                </div>
                <button
                  @click="addTaskBack(task.id)"
                  :disabled="isLoading"
                  class="ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition font-medium text-sm whitespace-nowrap"
                >
                  {{ isLoading ? '⏳' : '✓' }} Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="sticky bottom-0 px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button
          @click="$emit('close')"
          class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition font-medium text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * AddTasksModal Component
 *
 * Shows removed tasks and allows user to re-add them to the project
 * Features:
 * - Display tasks organized by category
 * - Add button for each removed task
 * - Loading state during add operation
 */

import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close'])

// Stores
const projectStore = useProjectStore()

// State
const isLoading = false

// Task categories (same as Dashboard)
const allTaskCategories = [
  {
    name: 'setup',
    label: 'Setup Basics',
    items: [
      {
        id: 'setup-1',
        name: 'Define Audience & Goals',
        description: 'Profile ideal users and set acquisition targets.'
      },
      {
        id: 'setup-2',
        name: 'Set Up Landing Page',
        description: 'Build a simple site with features, screenshots, and sign-up form.'
      },
      {
        id: 'setup-3',
        name: 'Connect Accounts',
        description: 'Link social (X, LinkedIn, Reddit), email (Mailchimp), and analytics.'
      },
      {
        id: 'setup-4',
        name: 'Prepare Assets',
        description: 'Create demo video/screenshots and basic branding.'
      },
      {
        id: 'setup-5',
        name: 'Set Up Tracking Sheet',
        description: 'Use Google Sheets for logging sign-ups and sources.'
      }
    ]
  },
  {
    name: 'social',
    label: 'Social Media Marketing',
    items: [
      {
        id: 'social-1',
        name: 'Schedule Posts',
        description: 'Plan and queue 4-6 updates on X/LinkedIn/Instagram.'
      },
      {
        id: 'social-2',
        name: 'Engage Followers',
        description: 'Respond to comments/DMs to build community.'
      },
      {
        id: 'social-3',
        name: 'Run Giveaway/Contest',
        description: 'Offer free access for shares/retweets.'
      }
    ]
  },
  {
    name: 'content',
    label: 'Content Creation',
    items: [
      {
        id: 'content-1',
        name: 'Write Blog Post',
        description: 'Detail app benefits or niche tutorials.'
      },
      {
        id: 'content-2',
        name: 'Create Video Tutorial',
        description: 'Short demo of key features.'
      },
      {
        id: 'content-3',
        name: 'Design Graphics',
        description: 'Social banners, infographics.'
      }
    ]
  },
  {
    name: 'acquisition',
    label: 'User Acquisition & Engagement',
    items: [
      {
        id: 'acq-1',
        name: 'Post in Communities',
        description: 'Share on Reddit, Indie Hackers, Product Hunt.'
      },
      {
        id: 'acq-2',
        name: 'Personalized Outreach',
        description: 'Email/DM 20-50 potential users.'
      },
      {
        id: 'acq-3',
        name: 'Host Webinar/Q&A',
        description: 'Live session for demos.'
      }
    ]
  },
  {
    name: 'feedback',
    label: 'Feedback & Iteration',
    items: [
      {
        id: 'feedback-1',
        name: 'Collect User Feedback',
        description: 'Send surveys or interviews to 10+ users.'
      },
      {
        id: 'feedback-2',
        name: 'Publish Product Updates',
        description: 'Share improvements and bug fixes on social.'
      },
      {
        id: 'feedback-3',
        name: 'Iterate on Features',
        description: 'Prioritize user requests and refine product.'
      }
    ]
  },
  {
    name: 'analytics',
    label: 'Analytics & Optimization',
    items: [
      {
        id: 'analytics-1',
        name: 'Set Up Analytics',
        description: 'Track sign-ups, retention, and engagement metrics.'
      },
      {
        id: 'analytics-2',
        name: 'Optimize Channels',
        description: 'Double down on high-performers.'
      },
      {
        id: 'analytics-3',
        name: 'Review ROI',
        description: 'Calculate cost-per-user (even if organic).'
      }
    ]
  }
]

// Computed properties
const removedTasks = computed(() => {
  return allTaskCategories
    .flatMap(cat =>
      cat.items
        .filter(item => projectStore.currentProjectTasks[item.id]?.removed)
        .map(item => ({ ...item, categoryName: cat.name }))
    )
})

const removedTasksByCategory = computed(() => {
  return allTaskCategories
    .map(cat => ({
      name: cat.name,
      label: cat.label,
      removedItems: cat.items.filter(item => projectStore.currentProjectTasks[item.id]?.removed)
    }))
    .filter(cat => cat.removedItems.length > 0)
})

// Methods
const addTaskBack = async (taskId) => {
  try {
    await projectStore.addTask(taskId)
  } catch (error) {
    console.error('Error adding task back:', error)
  }
}
</script>

<style scoped>
/* Smooth transitions */
button {
  transition: all 0.2s ease-in-out;
}
</style>
