<template>
  <div v-if="isReady" class="card p-4 mb-6">
    <!-- No active playbook - show selection -->
    <div v-if="!activePlaybook">
      <div class="flex items-center gap-2 mb-3">
        <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span class="text-sm font-medium text-gray-300">Launch Playbooks</span>
        <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-500/20 text-orange-400">
          NEW
        </span>
      </div>
      <p class="text-xs text-gray-500 mb-4">
        Focused journeys to achieve specific goals. Skip the overwhelm.
      </p>

      <!-- Playbook cards -->
      <div class="space-y-3">
        <div
          v-for="playbook in playbooks"
          :key="playbook.id"
          class="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 hover:border-orange-500/40 transition-all cursor-pointer"
          @click="activatePlaybook(playbook.id)"
        >
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-medium text-white">{{ playbook.name }}</h3>
              <p class="text-sm text-gray-400 mt-1">{{ playbook.tagline }}</p>
              <p class="text-xs text-gray-500 mt-2">{{ playbook.taskCount }} steps</p>
            </div>
            <button
              class="px-3 py-1.5 text-sm font-medium rounded-md bg-orange-600 text-white hover:bg-orange-500 transition-colors"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Active playbook - show progress -->
    <div v-else>
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span class="text-sm font-medium text-gray-300">{{ currentPlaybook?.name }}</span>
        </div>
        <button
          @click="deactivatePlaybook"
          class="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Exit playbook
        </button>
      </div>

      <!-- Progress bar -->
      <div class="mb-4">
        <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{{ progress.completed }}/{{ progress.total }} steps</span>
        </div>
        <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
            :style="{ width: `${progress.percentage}%` }"
          />
        </div>
      </div>

      <!-- Task list -->
      <div class="space-y-2">
        <div
          v-for="task in progress.tasks"
          :key="task.taskId"
          :class="[
            'flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer hover:bg-gray-700/50',
            task.isCompleted ? 'bg-green-500/10' : 'bg-gray-800/50',
            isNextTask(task.taskId) ? 'ring-1 ring-orange-500/50' : ''
          ]"
          @click="goToTask(task.taskId)"
        >
          <!-- Checkbox -->
          <div
            :class="[
              'w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium',
              task.isCompleted ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            ]"
          >
            <span v-if="task.isCompleted">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span v-else>{{ task.step }}</span>
          </div>

          <!-- Task info -->
          <div class="flex-1 min-w-0">
            <p
              :class="[
                'text-sm truncate',
                task.isCompleted ? 'text-gray-500 line-through' : 'text-white'
              ]"
            >
              {{ task.name }}
            </p>
            <p v-if="isNextTask(task.taskId)" class="text-xs text-cyan-400">
              {{ task.why }}
            </p>
          </div>

          <!-- Go button for next task -->
          <button
            v-if="isNextTask(task.taskId)"
            @click.stop="goToTask(task.taskId)"
            class="px-3 py-1 text-xs font-medium rounded bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
          >
            Go
          </button>
        </div>
      </div>

      <!-- Completion celebration -->
      <div
        v-if="progress.isComplete"
        class="mt-4 p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
      >
        <p class="text-green-400 font-medium">Playbook Complete!</p>
        <p class="text-sm text-gray-400 mt-1">
          You've completed all 7 steps. Time to get those customers!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { getPlaybookList, getPlaybookProgress } from '@/services/taskRecommendationEngine'

const emit = defineEmits(['task-opened'])
const projectStore = useProjectStore()

// State
const playbooks = ref([])
const progress = ref({ completed: 0, total: 0, percentage: 0, tasks: [], isComplete: false })
const isChanging = ref(false)

// Computed
const isReady = computed(() => {
  return projectStore.currentProject &&
         projectStore.currentProjectSettings &&
         !projectStore.isLoading
})

const activePlaybook = computed(() => projectStore.activePlaybook)

const currentPlaybook = computed(() => {
  if (!activePlaybook.value) return null
  return playbooks.value.find(p => p.id === activePlaybook.value)
})

const nextTaskId = computed(() => {
  if (!progress.value.tasks) return null
  const nextTask = progress.value.tasks.find(t => !t.isCompleted)
  return nextTask?.taskId || null
})

// Methods
const isNextTask = (taskId) => taskId === nextTaskId.value

const loadPlaybooks = () => {
  try {
    playbooks.value = getPlaybookList()
  } catch (err) {
    console.warn('Failed to load playbooks:', err)
    playbooks.value = []
  }
}

const loadProgress = () => {
  if (!activePlaybook.value) {
    progress.value = { completed: 0, total: 0, percentage: 0, tasks: [], isComplete: false }
    return
  }

  try {
    const tasks = projectStore.currentProjectTasks || {}
    const completedTaskIds = Object.entries(tasks)
      .filter(([_, task]) => task.checked && !task.removed)
      .map(([id, _]) => id)

    progress.value = getPlaybookProgress(activePlaybook.value, completedTaskIds)
  } catch (err) {
    console.warn('Failed to load playbook progress:', err)
  }
}

const activatePlaybook = async (playbookId) => {
  if (isChanging.value) return

  isChanging.value = true
  try {
    await projectStore.setActivePlaybook(playbookId)
    loadProgress()
  } catch (err) {
    console.error('Failed to activate playbook:', err)
  } finally {
    isChanging.value = false
  }
}

const deactivatePlaybook = async () => {
  if (isChanging.value) return

  isChanging.value = true
  try {
    await projectStore.setActivePlaybook(null)
  } catch (err) {
    console.error('Failed to deactivate playbook:', err)
  } finally {
    isChanging.value = false
  }
}

const goToTask = (taskId) => {
  emit('task-opened', { taskId })
}

// Lifecycle
onMounted(() => {
  loadPlaybooks()
  loadProgress()
})

// Watch for changes
watch(
  () => projectStore.activePlaybook,
  () => loadProgress(),
  { immediate: true }
)

watch(
  () => projectStore.currentProjectTasks,
  () => loadProgress(),
  { deep: true }
)
</script>
