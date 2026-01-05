<template>
  <div class="chatbot-container">
    <!-- SETUP SCREEN -->
    <div v-if="currentScreen === 'setup'" class="screen setup-screen">
      <div class="setup-header">
        <h2>Objection Handling Practice</h2>
        <p>Practice handling real sales objections with instant feedback</p>
      </div>

      <div class="setup-grid">
        <!-- Difficulty Selector -->
        <div class="setup-section">
          <h3>🎯 Choose Difficulty</h3>
          <div class="option-group">
            <button
              v-for="diff in [1, 2, 3]"
              :key="diff"
              @click="selectedDifficulty = diff"
              :class="['option-btn', { active: selectedDifficulty === diff }]"
            >
              <span class="label">{{ difficultyLabel(diff) }}</span>
              <span class="desc">{{ difficultyDesc(diff) }}</span>
            </button>
          </div>
        </div>

        <!-- Channel Selector -->
        <div class="setup-section">
          <h3>📞 Practice Channel</h3>
          <div class="option-group">
            <button
              v-for="ch in ['phone', 'email', 'chat']"
              :key="ch"
              @click="selectedChannel = ch"
              :class="['option-btn', { active: selectedChannel === ch }]"
            >
              <span class="label">{{ channelLabel(ch) }}</span>
              <span class="desc">{{ channelDesc(ch) }}</span>
            </button>
          </div>
        </div>
      </div>

      <button @click="startSession" class="btn-primary btn-large">
        Start Practice Session (5 Objections)
      </button>
    </div>

    <!-- PRACTICE SCREEN -->
    <div v-if="currentScreen === 'practice'" class="screen practice-screen">
      <!-- Progress Bar -->
      <div class="progress-section">
        <div class="progress-header">
          <span class="objection-counter">
            Objection {{ currentIndex + 1 }} of {{ sessionObjections.length }}
          </span>
          <span class="difficulty-badge" :class="`diff-${sessionObjections[currentIndex].difficulty}`">
            {{ difficultyLabel(sessionObjections[currentIndex].difficulty) }}
          </span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>

      <!-- Objection Display -->
      <div class="objection-section">
        <div class="scenario-label">Customer says:</div>
        <div class="objection-text">
          "{{ currentObjection.scenarios[0] }}"
        </div>
        <div class="objection-category">
          <span class="category-tag" :class="`cat-${currentObjection.category}`">
            {{ categoryLabel(currentObjection.category) }}
          </span>
          <span class="channel-tag">
            {{ channelLabel(selectedChannel) }} sales
          </span>
        </div>
      </div>

      <!-- User Response Input -->
      <div class="response-section">
        <label class="response-label">Your response:</label>
        <textarea
          v-model="userResponse"
          placeholder="Type your response to the objection..."
          @keydown.enter.ctrl="submitResponse"
          class="response-textarea"
          :disabled="responseFeedback !== null"
        ></textarea>
        <div class="response-hints" v-if="responseFeedback === null">
          <small>💡 Hint: Try using {{ hintTechniques() }}</small>
        </div>
      </div>

      <!-- Feedback Section (shown after submit) -->
      <div v-if="responseFeedback !== null" class="feedback-section">
        <div class="feedback-score">
          <div class="score-display">
            <span class="score-number">{{ feedbackScore }}/10</span>
            <span class="score-label">{{ scoreLabel() }}</span>
          </div>
          <div class="score-bar">
            <div class="score-fill" :style="{ width: (feedbackScore / 10 * 100) + '%' }"></div>
          </div>
        </div>

        <div class="techniques-detected">
          <div class="techniques-header">Techniques Detected:</div>
          <div v-if="detectedTechniques.length > 0" class="technique-list">
            <span v-for="tech in detectedTechniques" :key="tech" class="technique-badge">
              ✓ {{ techniques[tech]?.name || tech }}
            </span>
          </div>
          <div v-else class="no-techniques">
            No sales techniques detected. Try mentioning ROI, customer success, timeline options, etc.
          </div>
        </div>

        <div class="best-practice-box">
          <div class="bp-header">📚 Best Practice Response:</div>
          <p class="bp-text">{{ currentObjection.bestPracticeResponse }}</p>
          <div class="bp-techniques">
            <span v-for="tech in currentObjection.techniquesUsed" :key="tech" class="tech-tag">
              {{ techniques[tech]?.name || tech }}
            </span>
          </div>
        </div>

        <div class="coaching-tip-box">
          <div class="ct-header">🎓 Coaching Tip:</div>
          <p class="ct-text">{{ currentObjection.coachingTip }}</p>
        </div>

        <button @click="nextObjection" class="btn-primary btn-next">
          {{ currentIndex < sessionObjections.length - 1 ? 'Next Objection' : 'See Results' }}
        </button>
      </div>

      <!-- Submit Button (before feedback) -->
      <div v-if="responseFeedback === null" class="submit-section">
        <button @click="submitResponse" :disabled="!userResponse.trim()" class="btn-primary btn-submit">
          Submit Response
        </button>
      </div>
    </div>

    <!-- RESULTS SCREEN -->
    <div v-if="currentScreen === 'results'" class="screen results-screen">
      <div class="results-header">
        <h2>Session Complete! 🎉</h2>
        <p>Great practice. Here's how you did:</p>
      </div>

      <div class="results-grid">
        <!-- Overall Stats -->
        <div class="results-card">
          <h3>Overall Performance</h3>
          <div class="stat-row">
            <span class="stat-label">Average Score:</span>
            <span class="stat-value">{{ overallStats.averageScore.toFixed(1) }}/10</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Questions Completed:</span>
            <span class="stat-value">{{ sessionObjections.length }}/{{ sessionObjections.length }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Estimated Win Rate:</span>
            <span class="stat-value">{{ overallStats.estimatedWinRate }}%</span>
          </div>
        </div>

        <!-- Techniques Used -->
        <div class="results-card">
          <h3>Techniques You Used</h3>
          <div v-if="overallStats.techniqueUsage.length > 0" class="techniques-summary">
            <div v-for="(tech, idx) in overallStats.techniqueUsage" :key="idx" class="technique-row">
              <span class="tech-name">{{ tech.name }}</span>
              <span class="tech-count">{{ tech.count }}x</span>
            </div>
          </div>
          <div v-else class="no-data">
            No techniques detected. Try using more sales language!
          </div>
        </div>

        <!-- Objections Breakdown -->
        <div class="results-card full-width">
          <h3>Objection Breakdown</h3>
          <div class="objections-table">
            <div class="table-header">
              <span class="col-objection">Objection</span>
              <span class="col-category">Category</span>
              <span class="col-score">Score</span>
            </div>
            <div v-for="(obj, idx) in sessionObjections" :key="idx" class="table-row">
              <span class="col-objection">{{ obj.scenarios[0].substring(0, 40) }}...</span>
              <span class="col-category">{{ categoryLabel(obj.category) }}</span>
              <span class="col-score">{{ sessionScores[idx] }}/10</span>
            </div>
          </div>
        </div>
      </div>

      <div class="results-actions">
        <button @click="continuePractice" class="btn-secondary">
          Practice More (Harder Objections)
        </button>
        <button @click="resetSession" class="btn-primary">
          Start New Session
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  taskConfig: Object,
  taskData: Object
})

const emit = defineEmits(['save'])

// State
const currentScreen = ref('setup')
const selectedDifficulty = ref(1)
const selectedChannel = ref('phone')
const userResponse = ref('')
const responseFeedback = ref(null)
const feedbackScore = ref(0)
const detectedTechniques = ref([])
const currentIndex = ref(0)
const sessionObjections = ref([])
const sessionScores = ref([])
const sessionStats = ref({
  totalScore: 0,
  questionsCompleted: 0,
  techniquesCounted: {}
})

// Config data (from objectionHandling.config.js)
const objections = computed(() => props.taskConfig?.objections || [])
const techniques = computed(() => props.taskConfig?.techniques || {})

// Functions

// Difficulty helpers
const difficultyLabel = (d) => {
  return { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' }[d] || 'Beginner'
}

const difficultyDesc = (d) => {
  return {
    1: 'Common objections',
    2: 'Specific scenarios',
    3: 'Multi-objections'
  }[d] || ''
}

// Channel helpers
const channelLabel = (c) => {
  return { phone: 'Phone', email: 'Email', chat: 'Chat' }[c] || 'Phone'
}

const channelDesc = (c) => {
  return {
    phone: 'Live conversation',
    email: 'Written response',
    chat: 'Real-time messaging'
  }[c] || ''
}

// Category helpers
const categoryLabel = (cat) => {
  return {
    price: '💰 Price',
    authority: '⭐ Authority',
    timing: '⏰ Timing',
    capability: '⚙️ Capability',
    combo: '🔗 Multi-Objection'
  }[cat] || cat
}

// Start session with filtered objections
const startSession = () => {
  // Filter objections by difficulty and channel
  const filtered = objections.value.filter(
    (obj) =>
      obj.difficulty <= selectedDifficulty.value &&
      obj.channel.includes(selectedChannel.value)
  )

  // Shuffle and pick 5
  sessionObjections.value = filtered
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)

  sessionScores.value = new Array(5).fill(0)
  currentIndex.value = 0
  userResponse.value = ''
  responseFeedback.value = null
  currentScreen.value = 'practice'

  // Save progress
  saveProgress()
}

// Get current objection
const currentObjection = computed(() => sessionObjections.value[currentIndex.value])

// Progress percent
const progressPercent = computed(() => {
  if (sessionObjections.value.length === 0) return 0
  return ((currentIndex.value + 1) / sessionObjections.value.length) * 100
})

// Hint techniques
const hintTechniques = () => {
  if (!currentObjection.value) return ''
  const topTechs = currentObjection.value.techniquesUsed
  return topTechs
    .map((t) => techniques.value[t]?.name || t)
    .slice(0, 2)
    .join(' or ')
}

// Detect techniques in user response
const detectTechniques = (response) => {
  const detected = []
  const lowerResponse = response.toLowerCase()

  for (const [key, tech] of Object.entries(techniques.value)) {
    if (!tech.keywords) continue
    const matchCount = tech.keywords.filter((kw) =>
      lowerResponse.includes(kw.toLowerCase())
    ).length

    if (matchCount >= 2) {
      detected.push(key)
    }
  }

  return detected
}

// Score response
const scoreResponse = () => {
  detectedTechniques.value = detectTechniques(userResponse.value)
  const baseScore = Math.min(detectedTechniques.value.length * 2, 8)
  const lengthBonus = userResponse.value.length > 50 ? 1 : 0
  const final = Math.min(baseScore + lengthBonus, 10)
  feedbackScore.value = final
  return final
}

// Score label
const scoreLabel = () => {
  if (feedbackScore.value >= 8) return 'Excellent'
  if (feedbackScore.value >= 6) return 'Good'
  if (feedbackScore.value >= 4) return 'Fair'
  return 'Needs Work'
}

// Submit response
const submitResponse = () => {
  if (!userResponse.value.trim()) return

  const score = scoreResponse()
  sessionScores.value[currentIndex.value] = score
  sessionStats.value.totalScore += score
  sessionStats.value.questionsCompleted++

  // Count techniques
  detectedTechniques.value.forEach((tech) => {
    if (!sessionStats.value.techniquesCounted[tech]) {
      sessionStats.value.techniquesCounted[tech] = 0
    }
    sessionStats.value.techniquesCounted[tech]++
  })

  responseFeedback.value = { score }
  saveProgress()
}

// Next objection
const nextObjection = () => {
  if (currentIndex.value < sessionObjections.value.length - 1) {
    currentIndex.value++
    userResponse.value = ''
    responseFeedback.value = null
  } else {
    currentScreen.value = 'results'
  }
  saveProgress()
}

// Continue practice (increase difficulty)
const continuePractice = () => {
  selectedDifficulty.value = Math.min(selectedDifficulty.value + 1, 3)
  currentScreen.value = 'setup'
}

// Reset session
const resetSession = () => {
  currentScreen.value = 'setup'
  selectedDifficulty.value = 1
  selectedChannel.value = 'phone'
  userResponse.value = ''
  responseFeedback.value = null
  currentIndex.value = 0
  sessionObjections.value = []
  sessionScores.value = []
  sessionStats.value = {
    totalScore: 0,
    questionsCompleted: 0,
    techniquesCounted: {}
  }
  saveProgress()
}

// Overall stats
const overallStats = computed(() => {
  if (sessionScores.value.length === 0) {
    return { averageScore: 0, estimatedWinRate: 0, techniqueUsage: [] }
  }

  const avgScore = sessionScores.value.reduce((a, b) => a + b, 0) / sessionScores.value.length
  const winRate = Math.round((avgScore / 10) * 100)

  const techniqueUsage = Object.entries(sessionStats.value.techniquesCounted)
    .map(([key, count]) => ({
      name: techniques.value[key]?.name || key,
      count
    }))
    .sort((a, b) => b.count - a.count)

  return {
    averageScore: avgScore,
    estimatedWinRate: winRate,
    techniqueUsage
  }
})

// Save progress to localStorage
const saveProgress = () => {
  const data = {
    currentScreen: currentScreen.value,
    sessionScores: sessionScores.value,
    sessionStats: sessionStats.value,
    timestamp: new Date().toISOString()
  }
  localStorage.setItem('objection-handling-progress', JSON.stringify(data))
  emit('save', data)
}
</script>

<style scoped>
.chatbot-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  background: #f9fafb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.screen {
  padding: 40px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

/* ====== SETUP SCREEN ====== */
.setup-screen {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.setup-header {
  margin-bottom: 40px;
  text-align: center;
}

.setup-header h2 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
}

.setup-header p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.setup-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.setup-section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.option-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
}

.option-btn.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
}

.option-btn .label {
  font-weight: 600;
  font-size: 14px;
}

.option-btn .desc {
  font-size: 12px;
  opacity: 0.9;
}

/* ====== PRACTICE SCREEN ====== */
.practice-screen {
  background: white;
}

.progress-section {
  margin-bottom: 32px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.objection-counter {
  color: #333;
  font-weight: 600;
}

.difficulty-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.difficulty-badge.diff-1 {
  background: #dbeafe;
  color: #1e40af;
}

.difficulty-badge.diff-2 {
  background: #fef3c7;
  color: #92400e;
}

.difficulty-badge.diff-3 {
  background: #fecaca;
  color: #991b1b;
}

.progress-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.objection-section {
  background: #f0f4ff;
  border-left: 4px solid #667eea;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 32px;
}

.scenario-label {
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
}

.objection-text {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
  line-height: 1.4;
}

.objection-category {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-tag,
.channel-tag {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  background: white;
  border: 1px solid #d1d5db;
}

.category-tag.cat-price {
  border-color: #fbbf24;
  color: #92400e;
  background: #fef3c7;
}

.category-tag.cat-authority {
  border-color: #a78bfa;
  color: #5b21b6;
  background: #f3e8ff;
}

.category-tag.cat-timing {
  border-color: #38bdf8;
  color: #0c4a6e;
  background: #cffafe;
}

.category-tag.cat-capability {
  border-color: #34d399;
  color: #065f46;
  background: #d1fae5;
}

.category-tag.cat-combo {
  border-color: #f472b6;
  color: #831843;
  background: #fce7f3;
}

.response-section {
  margin-bottom: 20px;
}

.response-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.response-textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.2s;
}

.response-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.response-textarea:disabled {
  background: #f3f4f6;
  color: #999;
  cursor: not-allowed;
}

.response-hints {
  margin-top: 8px;
  color: #666;
  font-size: 12px;
}

/* ====== FEEDBACK SECTION ====== */
.feedback-section {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
}

.feedback-score {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.score-display {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.score-number {
  font-size: 36px;
  font-weight: 700;
  color: #667eea;
}

.score-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.score-bar {
  background: #e5e7eb;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  align-self: center;
  width: 100%;
  max-width: 200px;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.techniques-detected {
  margin-bottom: 20px;
}

.techniques-header {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 8px;
}

.technique-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.technique-badge {
  background: white;
  border: 1px solid #10b981;
  color: #065f46;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.no-techniques {
  color: #666;
  font-size: 13px;
  padding: 8px;
  background: white;
  border-radius: 4px;
}

.best-practice-box,
.coaching-tip-box {
  background: white;
  border-left: 3px solid #667eea;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.bp-header,
.ct-header {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.bp-text,
.ct-text {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 10px 0;
}

.bp-techniques {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.tech-tag {
  background: #ede9fe;
  color: #5b21b6;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

/* ====== BUTTONS ====== */
.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e5e7eb;
  color: #333;
  border: 2px solid #d1d5db;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.btn-large {
  width: 100%;
  padding: 16px;
  font-size: 16px;
}

.submit-section,
.btn-next {
  margin-top: auto;
}

.btn-submit {
  width: 100%;
}

.btn-next {
  width: 100%;
}

/* ====== RESULTS SCREEN ====== */
.results-screen {
  background: #f9fafb;
}

.results-header {
  text-align: center;
  margin-bottom: 40px;
}

.results-header h2 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
}

.results-header p {
  margin: 0;
  color: #666;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 32px;
}

.results-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.results-card.full-width {
  grid-column: 1 / -1;
}

.results-card h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.stat-value {
  font-weight: 600;
  color: #667eea;
  font-size: 14px;
}

.techniques-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.technique-row {
  display: flex;
  justify-content: space-between;
  padding: 6px;
  background: #f9fafb;
  border-radius: 4px;
  font-size: 13px;
}

.tech-name {
  font-weight: 500;
  color: #333;
}

.tech-count {
  background: #667eea;
  color: white;
  padding: 0 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.no-data {
  color: #999;
  font-size: 13px;
  padding: 12px;
  text-align: center;
}

.objections-table {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 0.8fr;
  gap: 12px;
  background: #667eea;
  color: white;
  padding: 12px;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 0.8fr;
  gap: 12px;
  background: white;
  padding: 12px;
  font-size: 13px;
}

.col-objection {
  color: #333;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-category {
  color: #666;
}

.col-score {
  color: #667eea;
  font-weight: 600;
  text-align: right;
}

.results-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: auto;
}

.results-actions button {
  flex: 1;
  max-width: 300px;
}

/* ====== RESPONSIVE ====== */
@media (max-width: 768px) {
  .screen {
    padding: 20px;
    min-height: auto;
  }

  .setup-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .setup-screen {
    padding: 20px;
  }

  .setup-header h2 {
    font-size: 24px;
  }

  .objection-text {
    font-size: 16px;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1.5fr 1fr 0.8fr;
  }

  .results-actions {
    flex-direction: column;
  }

  .results-actions button {
    max-width: 100%;
  }
}
</style>
