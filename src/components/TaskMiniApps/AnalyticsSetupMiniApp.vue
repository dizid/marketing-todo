<template>
  <div class="analytics-wizard">
    <!-- Progress Indicator -->
    <div class="progress-bar">
      <div
        v-for="step in 5"
        :key="step"
        class="progress-step"
        :class="{
          'active': currentStep === step,
          'completed': currentStep > step,
          'clickable': wizardData.selectedPlatform || step === 1
        }"
        @click="handleStepClick(step)"
      >
        <div class="step-number">{{ step }}</div>
        <div class="step-label">{{ getStepLabel(step) }}</div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="step-content">
      <!-- Step 1: Education -->
      <div v-if="currentStep === 1" class="step step-1">
        <div class="education-hero">
          <h2>📊 What is Analytics?</h2>
          <p class="hero-text">
            Analytics shows you <strong>WHO</strong> visits your site,
            <strong>WHAT</strong> they do, and <strong>WHERE</strong> they drop off.
          </p>
        </div>

        <div class="value-cards">
          <div class="value-card">
            <div class="card-icon">👥</div>
            <h3>Who Are Your Users?</h3>
            <p>See demographics, location, and devices</p>
            <div class="example">
              <strong>Example:</strong> "80% of users are on mobile - maybe improve mobile UX?"
            </div>
          </div>

          <div class="value-card">
            <div class="card-icon">📊</div>
            <h3>What Do They Do?</h3>
            <p>Track pageviews, signups, and purchases</p>
            <div class="example">
              <strong>Example:</strong> "200 visitors → 50 signups → 10 paid = 5% conversion"
            </div>
          </div>

          <div class="value-card">
            <div class="card-icon">🔍</div>
            <h3>Where Do They Drop Off?</h3>
            <p>Find where users leave your funnel</p>
            <div class="example">
              <strong>Example:</strong> "Users abandon cart at checkout - maybe simplify the form?"
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn-primary" @click="nextStep">Get Started - Set Up Analytics</button>
        </div>
      </div>

      <!-- Step 2: Platform Selection -->
      <div v-if="currentStep === 2" class="step step-2">
        <h2>Choose Your Analytics Platform</h2>
        <p class="subtitle">Compare the top 2 platforms and pick the best fit for your product</p>

        <div class="platform-comparison">
          <div
            v-for="tool in taskConfig.tools"
            :key="tool.id"
            class="platform-card"
            :class="{ selected: wizardData.selectedPlatform === tool.id, recommended: tool.recommended }"
            @click="wizardData.selectedPlatform = tool.id"
          >
            <div v-if="tool.recommended" class="recommended-badge">✨ Recommended</div>
            <div class="platform-header">
              <span class="platform-icon">{{ tool.icon }}</span>
              <h3>{{ tool.name }}</h3>
            </div>

            <p class="platform-description">{{ tool.description }}</p>

            <div class="platform-details">
              <div class="detail-row">
                <span class="label">Best For:</span>
                <span class="value">{{ tool.bestFor }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Complexity:</span>
                <span class="value">{{ tool.complexity }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Cost:</span>
                <span class="value">{{ tool.cost }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Setup Time:</span>
                <span class="value">{{ tool.setupTime }}</span>
              </div>
            </div>

            <div class="platform-features">
              <div class="features-label">Key Features:</div>
              <ul>
                <li v-for="feature in tool.features" :key="feature">{{ feature }}</li>
              </ul>
            </div>

            <button class="btn-select" :class="{ selected: wizardData.selectedPlatform === tool.id }">
              {{ wizardData.selectedPlatform === tool.id ? '✓ Selected' : 'Select This' }}
            </button>
          </div>
        </div>

        <div v-if="wizardData.selectedPlatform" class="product-type-section">
          <h3>What type of product are you building?</h3>
          <div class="product-type-grid">
            <div
              v-for="type in taskConfig.productTypes"
              :key="type.value"
              class="product-type-card"
              :class="{ selected: wizardData.productType === type.value }"
              @click="wizardData.productType = type.value"
            >
              <span class="type-icon">{{ type.icon }}</span>
              <span class="type-label">{{ type.label }}</span>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn-secondary" @click="prevStep">Back</button>
          <button
            class="btn-primary"
            :disabled="!wizardData.selectedPlatform || !wizardData.productType"
            @click="nextStep"
          >
            Continue
          </button>
        </div>
      </div>

      <!-- Step 3: AI Tracking Plan -->
      <div v-if="currentStep === 3" class="step step-3">
        <h2>Your Custom Tracking Plan</h2>
        <p class="subtitle">AI will generate a personalized tracking plan for your product</p>

        <div v-if="!wizardData.aiTrackingPlan" class="input-form">
          <div class="form-group">
            <label>Product Name *</label>
            <input
              v-model="wizardData.productName"
              type="text"
              placeholder="e.g., TaskMaster Pro"
              class="input"
            />
          </div>

          <div class="form-group">
            <label>Product Description (1 sentence) *</label>
            <textarea
              v-model="wizardData.productDescription"
              placeholder="e.g., A productivity app that helps teams manage tasks and deadlines"
              class="textarea"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Main Goal *</label>
            <div class="goal-grid">
              <div
                v-for="goal in taskConfig.mainGoals"
                :key="goal.value"
                class="goal-card"
                :class="{ selected: wizardData.mainGoal === goal.value }"
                @click="wizardData.mainGoal = goal.value"
              >
                <span class="goal-icon">{{ goal.icon }}</span>
                <span class="goal-label">{{ goal.label }}</span>
              </div>
            </div>
          </div>

          <div v-if="wizardData.mainGoal === 'other'" class="form-group">
            <label>Describe your goal:</label>
            <input
              v-model="wizardData.customGoal"
              type="text"
              placeholder="e.g., Build a community of active users"
              class="input"
            />
          </div>

          <div class="step-actions">
            <button class="btn-secondary" @click="prevStep">Back</button>
            <button
              class="btn-primary"
              :disabled="!canGeneratePlan || isGeneratingPlan"
              @click="generateTrackingPlan"
            >
              {{ isGeneratingPlan ? 'Generating...' : 'Generate My Tracking Plan' }}
            </button>
          </div>
        </div>

        <div v-else class="tracking-plan-output">
          <div class="output-header">
            <h3>📋 Your Custom Analytics Tracking Plan</h3>
            <button class="btn-regenerate" @click="regeneratePlan">
              🔄 Regenerate
            </button>
          </div>

          <div class="plan-content" v-html="renderMarkdown(wizardData.aiTrackingPlan)"></div>

          <div class="step-actions">
            <button class="btn-secondary" @click="prevStep">Back</button>
            <button class="btn-primary" @click="nextStep">Continue to Implementation</button>
          </div>
        </div>

        <div v-if="planError" class="error-message">
          {{ planError }}
        </div>
      </div>

      <!-- Step 4: Implementation Guide -->
      <div v-if="currentStep === 4" class="step step-4">
        <h2>Implementation Guide</h2>
        <p class="subtitle">Follow these step-by-step instructions to install {{ getPlatformName() }}</p>

        <div class="implementation-guide">
          <!-- Google Analytics 4 Guide -->
          <div v-if="wizardData.selectedPlatform === 'ga4'" class="guide ga4-guide">
            <div class="guide-header">
              <span class="guide-icon">📊</span>
              <h3>Google Analytics 4 Setup</h3>
              <span class="time-badge">⏱️ 10 minutes</span>
            </div>

            <div class="guide-section">
              <h4>STEP 1: Create Your GA4 Account</h4>
              <ol>
                <li>Go to: <a href="https://analytics.google.com" target="_blank">analytics.google.com</a></li>
                <li>Click "Start measuring"</li>
                <li>Enter your account name (e.g., "My Product Name")</li>
                <li>Click "Next"</li>
                <li>Enter property name: "My Website"</li>
                <li>Select your timezone and currency</li>
                <li>Click "Create"</li>
              </ol>
            </div>

            <div class="guide-section">
              <h4>STEP 2: Get Your Tracking Code</h4>
              <ol>
                <li>Click "Web" under "Choose a platform"</li>
                <li>Enter your website URL</li>
                <li>Click "Create stream"</li>
                <li>Copy the "Measurement ID" (looks like <code>G-XXXXXXXXXX</code>)</li>
              </ol>
            </div>

            <div class="guide-section">
              <h4>STEP 3: Install Tracking Code</h4>
              <p>Copy this code and paste it in the <code>&lt;head&gt;</code> section of EVERY page on your website:</p>

              <div class="code-block">
                <button class="copy-button" @click="copyCode('ga4-tracking')">
                  {{ copiedCode === 'ga4-tracking' ? '✓ Copied!' : '📋 Copy Code' }}
                </button>
                <pre id="ga4-tracking"><code>&lt;!-- Google Analytics 4 --&gt;
&lt;script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"&gt;&lt;/script&gt;
&lt;script&gt;
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
&lt;/script&gt;</code></pre>
              </div>

              <div class="warning-box">
                <strong>📝 IMPORTANT:</strong> Replace "G-XXXXXXXXXX" with your actual Measurement ID!
              </div>

              <div class="placement-guide">
                <h5>WHERE TO PASTE:</h5>
                <ul>
                  <li><strong>WordPress:</strong> Use "Insert Headers and Footers" plugin</li>
                  <li><strong>Webflow:</strong> Site Settings → Custom Code → Head Code</li>
                  <li><strong>HTML website:</strong> Inside <code>&lt;head&gt;</code> tag of index.html</li>
                  <li><strong>React/Vue:</strong> Inside public/index.html <code>&lt;head&gt;</code> tag</li>
                  <li><strong>Next.js:</strong> Inside pages/_app.js or app/layout.js</li>
                </ul>
              </div>
            </div>

            <div class="guide-section">
              <h4>STEP 4: Track Custom Events (e.g., Signups)</h4>
              <p>Add this code where users complete signup:</p>

              <div class="code-block">
                <button class="copy-button" @click="copyCode('ga4-event')">
                  {{ copiedCode === 'ga4-event' ? '✓ Copied!' : '📋 Copy Code' }}
                </button>
                <pre id="ga4-event"><code>&lt;script&gt;
gtag('event', 'sign_up', {
  'method': 'Email'
});
&lt;/script&gt;</code></pre>
              </div>

              <p class="example-usage"><strong>Example for button click:</strong></p>

              <div class="code-block">
                <button class="copy-button" @click="copyCode('ga4-button')">
                  {{ copiedCode === 'ga4-button' ? '✓ Copied!' : '📋 Copy Code' }}
                </button>
                <pre id="ga4-button"><code>&lt;button onclick="gtag('event', 'sign_up', {'method': 'Email'});"&gt;
  Sign Up
&lt;/button&gt;</code></pre>
              </div>
            </div>

            <div class="guide-section">
              <h4>STEP 5: Verify It's Working</h4>
              <ol>
                <li>Open your website in a new tab</li>
                <li>Go back to Google Analytics</li>
                <li>Click "Reports" → "Realtime"</li>
                <li>You should see "1 user active now" (that's you!)</li>
                <li>✅ Analytics is live!</li>
              </ol>
            </div>

            <div class="troubleshooting">
              <h5>TROUBLESHOOTING:</h5>
              <ul>
                <li>Not seeing data? Wait 24-48 hours for first report</li>
                <li>Still nothing? Check if code is in <code>&lt;head&gt;</code> section</li>
                <li>Use Chrome extension "Google Analytics Debugger" to test</li>
              </ul>
            </div>
          </div>

          <!-- Mixpanel Guide -->
          <div v-if="wizardData.selectedPlatform === 'mixpanel'" class="guide mixpanel-guide">
            <div class="guide-header">
              <span class="guide-icon">🎯</span>
              <h3>Mixpanel Setup</h3>
              <span class="time-badge">⏱️ 15 minutes</span>
            </div>

            <div class="guide-section">
              <h4>STEP 1: Create Mixpanel Account</h4>
              <ol>
                <li>Go to: <a href="https://mixpanel.com/register" target="_blank">mixpanel.com/register</a></li>
                <li>Sign up with email</li>
                <li>Enter project name (e.g., "My Product")</li>
                <li>Select "Web" as platform</li>
                <li>Click "Create Project"</li>
              </ol>
            </div>

            <div class="guide-section">
              <h4>STEP 2: Get Your Project Token</h4>
              <ol>
                <li>Click "Settings" (gear icon)</li>
                <li>Find "Project Token" (looks like: <code>abc123def456</code>)</li>
                <li>Copy this token</li>
              </ol>
            </div>

            <div class="guide-section">
              <h4>STEP 3: Install Mixpanel Script</h4>
              <p>Copy this code and paste it in the <code>&lt;head&gt;</code> section of your website:</p>

              <div class="code-block">
                <button class="copy-button" @click="copyCode('mixpanel-init')">
                  {{ copiedCode === 'mixpanel-init' ? '✓ Copied!' : '📋 Copy Code' }}
                </button>
                <pre id="mixpanel-init"><code>&lt;!-- Mixpanel --&gt;
&lt;script type="text/javascript"&gt;
(function(c,a){if(!a.__SV){var b=window;try{var d,m,j,k=b.location,f=k.hash;d=function(a,b){return(m=a.match(RegExp(b+"=([^&]*)")))?m[1]:null};f&&d(f,"state")&&(j=JSON.parse(decodeURIComponent(d(f,"state"))),"mpeditor"===j.action&&(b.sessionStorage.setItem("_mpcehash",f),history.replaceState(j.desiredHash||"",c.title,k.pathname+k.search)))}catch(n){}var l,h;window.mixpanel=a;a._i=[];a.init=function(b,d,g){function c(b,i){var a=i.split(".");2==a.length&&(b=b[a[0]],i=a[1]);b[i]=function(){b.push([i].concat(Array.prototype.slice.call(arguments,0)))}}var e=a;"undefined"!==typeof g?e=a[g]=[]:g="mixpanel";e.people=e.people||[];e.toString=function(b){var a="mixpanel";"mixpanel"!==g&&(a+="."+g);b||(a+=" (stub)");return a};e.people.toString=function(){return e.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h&lt;l.length;h++)c(e,l[h]);var f="set set_once union unset remove delete".split(" ");e.get_group=function(){function a(c){b[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));e.push([d,call2])}}for(var b={},d=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c&lt;f.length;c++)a(f[c]);return b};a._i.push([b,d,g])};a.__SV=1.2;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===c.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?""https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d)}})(document,window.mixpanel||[]);

mixpanel.init("YOUR_PROJECT_TOKEN");
&lt;/script&gt;</code></pre>
              </div>

              <div class="warning-box">
                <strong>📝 IMPORTANT:</strong> Replace "YOUR_PROJECT_TOKEN" with your actual token!
              </div>
            </div>

            <div class="guide-section">
              <h4>STEP 4: Track Page Views</h4>
              <p>Add this to every page load:</p>

              <div class="code-block">
                <button class="copy-button" @click="copyCode('mixpanel-pageview')">
                  {{ copiedCode === 'mixpanel-pageview' ? '✓ Copied!' : '📋 Copy Code' }}
                </button>
                <pre id="mixpanel-pageview"><code>&lt;script&gt;
  mixpanel.track('Page Viewed', {
    'page': window.location.pathname
  });
&lt;/script&gt;</code></pre>
              </div>
            </div>

            <div class="guide-section">
              <h4>STEP 5: Track Custom Events (e.g., Signups)</h4>
              <p>Add this code when user signs up:</p>

              <div class="code-block">
                <button class="copy-button" @click="copyCode('mixpanel-event')">
                  {{ copiedCode === 'mixpanel-event' ? '✓ Copied!' : '📋 Copy Code' }}
                </button>
                <pre id="mixpanel-event"><code>&lt;script&gt;
mixpanel.track('Sign Up Completed', {
  'method': 'Email',
  'timestamp': new Date().toISOString()
});
&lt;/script&gt;</code></pre>
              </div>
            </div>

            <div class="guide-section">
              <h4>STEP 6: Identify Users</h4>
              <p>After signup, identify the user:</p>

              <div class="code-block">
                <button class="copy-button" @click="copyCode('mixpanel-identify')">
                  {{ copiedCode === 'mixpanel-identify' ? '✓ Copied!' : '📋 Copy Code' }}
                </button>
                <pre id="mixpanel-identify"><code>&lt;script&gt;
mixpanel.identify('user_email@example.com');
mixpanel.people.set({
  '$email': 'user_email@example.com',
  '$name': 'User Name',
  'Sign up date': new Date().toISOString()
});
&lt;/script&gt;</code></pre>
              </div>
            </div>

            <div class="guide-section">
              <h4>STEP 7: Verify It's Working</h4>
              <ol>
                <li>Open your website</li>
                <li>Go to Mixpanel dashboard</li>
                <li>Click "Events" → "Live View"</li>
                <li>You should see events coming in real-time</li>
                <li>✅ Analytics is live!</li>
              </ol>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn-secondary" @click="prevStep">Back</button>
          <button class="btn-primary" @click="nextStep">Continue to Verification</button>
        </div>
      </div>

      <!-- Step 5: Verification Checklist -->
      <div v-if="currentStep === 5" class="step step-5">
        <h2>🎉 Final Step: Verify Analytics Is Working</h2>
        <p class="subtitle">Complete this checklist to confirm everything is set up correctly</p>

        <div class="checklist">
          <label class="checklist-item">
            <input type="checkbox" v-model="wizardData.checklist.codeInstalled" @change="saveProgress" />
            <div class="checklist-content">
              <div class="checklist-title">Analytics code is installed on your website</div>
              <div class="checklist-hint">
                Check: View source code of your site and search for "gtag" (GA4) or "mixpanel" (Mixpanel)
              </div>
            </div>
          </label>

          <label class="checklist-item">
            <input type="checkbox" v-model="wizardData.checklist.realtimeWorking" @change="saveProgress" />
            <div class="checklist-content">
              <div class="checklist-title">You can see yourself in real-time reports</div>
              <div class="checklist-hint">
                <span v-if="wizardData.selectedPlatform === 'ga4'">
                  GA4: Go to Reports → Realtime → Should show "1 user active"
                </span>
                <span v-else>
                  Mixpanel: Go to Events → Live View → Should show your events
                </span>
              </div>
            </div>
          </label>

          <label class="checklist-item">
            <input type="checkbox" v-model="wizardData.checklist.eventsTracking" @change="saveProgress" />
            <div class="checklist-content">
              <div class="checklist-title">Custom events are firing correctly</div>
              <div class="checklist-hint">
                Test your signup/conversion tracking by completing the action and verifying the event appears
              </div>
            </div>
          </label>

          <label class="checklist-item">
            <input type="checkbox" v-model="wizardData.checklist.allPagesTracked" @change="saveProgress" />
            <div class="checklist-content">
              <div class="checklist-title">Analytics is on all important pages</div>
              <div class="checklist-hint">
                Check: Homepage, signup page, pricing, dashboard (if applicable)
              </div>
            </div>
          </label>

          <label class="checklist-item">
            <input type="checkbox" v-model="wizardData.checklist.dashboardBookmarked" @change="saveProgress" />
            <div class="checklist-content">
              <div class="checklist-title">Bookmark your analytics dashboard</div>
              <div class="checklist-hint">
                <span v-if="wizardData.selectedPlatform === 'ga4'">
                  <a href="https://analytics.google.com" target="_blank">analytics.google.com</a>
                </span>
                <span v-else>
                  <a href="https://mixpanel.com" target="_blank">mixpanel.com</a>
                </span>
              </div>
            </div>
          </label>

          <label class="checklist-item">
            <input type="checkbox" v-model="wizardData.checklist.reminderSet" @change="saveProgress" />
            <div class="checklist-content">
              <div class="checklist-title">Set up weekly check-in reminder</div>
              <div class="checklist-hint">
                Add calendar reminder: "Check analytics every Monday at 9am"
              </div>
            </div>
          </label>
        </div>

        <div v-if="isChecklistComplete" class="completion-message">
          <div class="success-icon">✅</div>
          <h3>All Done! Your Analytics Is Live.</h3>
          <p>Great work! You've successfully set up analytics for your product.</p>
        </div>

        <div class="next-steps">
          <h3>NEXT STEPS:</h3>
          <ul>
            <li>Wait 48 hours for data to accumulate</li>
            <li>Check your dashboard weekly</li>
            <li>Look for trends: traffic spikes, conversion drops, user behavior patterns</li>
            <li>Use insights to improve your product</li>
          </ul>
        </div>

        <div class="help-resources">
          <h4>NEED HELP?</h4>
          <ul>
            <li v-if="wizardData.selectedPlatform === 'ga4'">
              <a href="https://support.google.com/analytics" target="_blank">GA4 Help Center</a>
            </li>
            <li v-else>
              <a href="https://docs.mixpanel.com" target="_blank">Mixpanel Docs</a>
            </li>
          </ul>
        </div>

        <div class="step-actions">
          <button class="btn-secondary" @click="prevStep">Back</button>
          <button class="btn-primary" @click="exportGuide">📥 Export Setup Guide</button>
          <button class="btn-primary" @click="markComplete">Mark Complete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { supabase } from '@/utils/supabase'

const props = defineProps({
  taskConfig: {
    type: Object,
    required: true
  },
  taskData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['save'])

const projectStore = useProjectStore()

// Wizard state
const currentStep = ref(1)
const wizardData = ref({
  currentStep: 1,
  selectedPlatform: null,
  productType: null,
  productName: '',
  productDescription: '',
  mainGoal: '',
  customGoal: '',
  aiTrackingPlan: '',
  checklist: {
    codeInstalled: false,
    realtimeWorking: false,
    eventsTracking: false,
    allPagesTracked: false,
    dashboardBookmarked: false,
    reminderSet: false
  },
  setupCompletedAt: null
})

// UI state
const isGeneratingPlan = ref(false)
const planError = ref('')
const copiedCode = ref('')

// Timeout ID for copy feedback cleanup
let copyTimeout

// Load saved data on mount
onMounted(() => {
  if (props.taskData && Object.keys(props.taskData).length > 0) {
    wizardData.value = { ...wizardData.value, ...props.taskData }
    currentStep.value = wizardData.value.currentStep || 1
  }
})

// Auto-save on data change
watch(wizardData, () => {
  saveProgress()
}, { deep: true })

// Computed
const canGeneratePlan = computed(() => {
  return wizardData.value.productName &&
    wizardData.value.productDescription &&
    wizardData.value.mainGoal &&
    (wizardData.value.mainGoal !== 'other' || wizardData.value.customGoal)
})

const isChecklistComplete = computed(() => {
  const checklist = wizardData.value.checklist
  return Object.values(checklist).every(value => value === true)
})

// Methods
const saveProgress = async () => {
  wizardData.value.currentStep = currentStep.value
  emit('save', { ...wizardData.value })
}

const nextStep = () => {
  if (currentStep.value < 5) {
    currentStep.value++
    saveProgress()
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    saveProgress()
  }
}

const handleStepClick = (step) => {
  // Allow clicking on any step if platform is selected or going to step 1
  if (wizardData.value.selectedPlatform || step === 1) {
    currentStep.value = step
    saveProgress()
  }
}

const getStepLabel = (step) => {
  const labels = {
    1: 'Learn',
    2: 'Choose',
    3: 'Plan',
    4: 'Install',
    5: 'Verify'
  }
  return labels[step] || ''
}

const getPlatformName = () => {
  const platform = props.taskConfig.tools.find(t => t.id === wizardData.value.selectedPlatform)
  return platform ? platform.name : 'Analytics'
}

const generateTrackingPlan = async () => {
  isGeneratingPlan.value = true
  planError.value = ''

  try {
    // Get AI config from task config
    const aiConfig = props.taskConfig.ai

    // Prepare prompt with wizard data
    let prompt = aiConfig.template
      .replace('{platform}', getPlatformName())
      .replace('{productType}', wizardData.value.productType)
      .replace('{productName}', wizardData.value.productName)
      .replace('{productDescription}', wizardData.value.productDescription)
      .replace('{mainGoal}', wizardData.value.mainGoal === 'other' ?
        wizardData.value.customGoal :
        props.taskConfig.mainGoals.find(g => g.value === wizardData.value.mainGoal)?.label || wizardData.value.mainGoal
      )

    // Call Claude API
    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: {
        prompt,
        temperature: aiConfig.temperature || 0.7,
        maxTokens: aiConfig.maxTokens || 1500
      }
    })

    if (error) throw error

    wizardData.value.aiTrackingPlan = data.content
    saveProgress()
  } catch (err) {
    console.error('Error generating tracking plan:', err)
    planError.value = 'Failed to generate tracking plan. Please try again.'
  } finally {
    isGeneratingPlan.value = false
  }
}

const regeneratePlan = () => {
  wizardData.value.aiTrackingPlan = ''
  planError.value = ''
}

const renderMarkdown = (markdown) => {
  if (!markdown) return ''

  // Simple markdown to HTML conversion
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^## (.*$)/gim, '<h3>$1</h3>')
    .replace(/^# (.*$)/gim, '<h2>$1</h2>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')
    // Checkboxes
    .replace(/\[ \]/gim, '☐')
    .replace(/\[x\]/gim, '☑')
    // Line breaks
    .replace(/\n/gim, '<br>')

  return html
}

const copyCode = async (codeId) => {
  try {
    const codeElement = document.getElementById(codeId)
    const code = codeElement.textContent
    await navigator.clipboard.writeText(code)
    copiedCode.value = codeId
    copyTimeout = setTimeout(() => {
      copiedCode.value = ''
    }, 2000)
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}

const exportGuide = () => {
  // Generate markdown export
  const markdown = generateMarkdownExport()

  // Create download
  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `analytics-setup-guide-${wizardData.value.productName.toLowerCase().replace(/\s+/g, '-')}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const generateMarkdownExport = () => {
  const platform = getPlatformName()
  const productType = props.taskConfig.productTypes.find(t => t.value === wizardData.value.productType)?.label || wizardData.value.productType

  return `# Analytics Setup Guide

**Product:** ${wizardData.value.productName}
**Platform:** ${platform}
**Product Type:** ${productType}
**Date:** ${new Date().toLocaleDateString()}

---

## Your Custom Tracking Plan

${wizardData.value.aiTrackingPlan}

---

## Implementation Checklist

${Object.entries(wizardData.value.checklist).map(([key, value]) => {
  const labels = {
    codeInstalled: 'Analytics code is installed on your website',
    realtimeWorking: 'You can see yourself in real-time reports',
    eventsTracking: 'Custom events are firing correctly',
    allPagesTracked: 'Analytics is on all important pages',
    dashboardBookmarked: 'Bookmark your analytics dashboard',
    reminderSet: 'Set up weekly check-in reminder'
  }
  return `- [${value ? 'x' : ' '}] ${labels[key]}`
}).join('\n')}

---

## Next Steps

- Wait 48 hours for data to accumulate
- Check your dashboard weekly
- Look for trends: traffic spikes, conversion drops, user behavior patterns
- Use insights to improve your product

---

## Resources

${platform === 'Google Analytics 4' ? `- [GA4 Help Center](https://support.google.com/analytics)
- [GA4 Dashboard](https://analytics.google.com)` : `- [Mixpanel Docs](https://docs.mixpanel.com)
- [Mixpanel Dashboard](https://mixpanel.com)`}

---

*Generated by Analytics Setup Wizard*
`
}

const markComplete = () => {
  wizardData.value.setupCompletedAt = new Date().toISOString()
  saveProgress()
  // Optionally close modal or show success message
}

// Cleanup timers on component unmount
onBeforeUnmount(() => {
  if (copyTimeout) clearTimeout(copyTimeout)
})

</script>

<style scoped>
.analytics-wizard {
  max-width: 1200px;
  margin: 0 auto;
}

/* Progress Bar */
.progress-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  padding: 20px 0;
  border-bottom: 2px solid #e5e7eb;
}

.progress-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: default;
}

.progress-step.clickable {
  cursor: pointer;
}

.progress-step.clickable:hover .step-number {
  background: #818cf8;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s;
}

.progress-step.active .step-number {
  background: #6366f1;
  color: white;
  transform: scale(1.1);
}

.progress-step.completed .step-number {
  background: #10b981;
  color: white;
}

.step-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.progress-step.active .step-label {
  color: #6366f1;
  font-weight: 600;
}

/* Step Content */
.step-content {
  min-height: 500px;
}

.step {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Step 1: Education */
.education-hero {
  text-align: center;
  margin-bottom: 40px;
}

.education-hero h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
}

.hero-text {
  font-size: 18px;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.value-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.value-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s;
}

.value-card:hover {
  border-color: #6366f1;
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.1);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.value-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.value-card p {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
}

.example {
  background: #f3f4f6;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #4b5563;
  text-align: left;
}

/* Step 2: Platform Selection */
.step-2 h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 32px;
}

.platform-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.platform-card {
  background: white;
  border: 3px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.platform-card:hover {
  border-color: #a5b4fc;
  transform: translateY(-2px);
}

.platform-card.selected {
  border-color: #6366f1;
  background: #eef2ff;
}

.platform-card.recommended {
  border-color: #fbbf24;
}

.recommended-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: #fbbf24;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.platform-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.platform-icon {
  font-size: 32px;
}

.platform-header h3 {
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
}

.platform-description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
}

.platform-details {
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row .label {
  font-weight: 600;
  color: #4b5563;
  font-size: 13px;
}

.detail-row .value {
  color: #6b7280;
  font-size: 13px;
}

.platform-features {
  margin-bottom: 20px;
}

.features-label {
  font-weight: 600;
  color: #4b5563;
  font-size: 13px;
  margin-bottom: 8px;
}

.platform-features ul {
  list-style: none;
  padding: 0;
}

.platform-features li {
  padding: 6px 0;
  font-size: 13px;
  color: #6b7280;
}

.platform-features li:before {
  content: "✓ ";
  color: #10b981;
  font-weight: bold;
  margin-right: 8px;
}

.btn-select {
  width: 100%;
  padding: 12px;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-select:hover {
  background: #e5e7eb;
}

.btn-select.selected {
  background: #6366f1;
  border-color: #6366f1;
  color: white;
}

.product-type-section {
  margin-top: 40px;
}

.product-type-section h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
}

.product-type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.product-type-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.product-type-card:hover {
  border-color: #a5b4fc;
  transform: translateY(-2px);
}

.product-type-card.selected {
  border-color: #6366f1;
  background: #eef2ff;
}

.type-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 8px;
}

.type-label {
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
}

/* Step 3: Tracking Plan */
.input-form {
  max-width: 700px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  font-size: 14px;
}

.input, .textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  transition: border-color 0.3s;
}

.input:focus, .textarea:focus {
  outline: none;
  border-color: #6366f1;
}

.goal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.goal-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.goal-card:hover {
  border-color: #a5b4fc;
}

.goal-card.selected {
  border-color: #6366f1;
  background: #eef2ff;
}

.goal-icon {
  font-size: 24px;
  display: block;
  margin-bottom: 8px;
}

.goal-label {
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
}

.tracking-plan-output {
  max-width: 800px;
  margin: 0 auto;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.output-header h3 {
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
}

.btn-regenerate {
  padding: 8px 16px;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-regenerate:hover {
  background: #e5e7eb;
}

.plan-content {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  line-height: 1.8;
  color: #374151;
}

.plan-content h2, .plan-content h3, .plan-content h4 {
  color: #1f2937;
  margin-top: 24px;
  margin-bottom: 12px;
}

.plan-content ul {
  list-style-position: inside;
  margin-left: 20px;
}

.error-message {
  background: #fee2e2;
  border: 2px solid #fecaca;
  border-radius: 8px;
  padding: 16px;
  color: #991b1b;
  margin-top: 16px;
}

/* Step 4: Implementation */
.implementation-guide {
  max-width: 900px;
  margin: 0 auto;
}

.guide {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 32px;
}

.guide-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.guide-icon {
  font-size: 32px;
}

.guide-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  flex: 1;
}

.time-badge {
  background: #dbeafe;
  color: #1e40af;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.guide-section {
  margin-bottom: 32px;
}

.guide-section h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.guide-section h5 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  margin-top: 16px;
}

.guide-section ol, .guide-section ul {
  margin-left: 20px;
  color: #4b5563;
}

.guide-section li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.guide-section p {
  color: #4b5563;
  margin-bottom: 12px;
  line-height: 1.6;
}

.code-block {
  position: relative;
  background: #1f2937;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  color: #e5e7eb;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.code-block code {
  color: #e5e7eb;
}

.copy-button {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #374151;
  border: 1px solid #4b5563;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-button:hover {
  background: #4b5563;
}

.warning-box {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 12px 16px;
  margin: 16px 0;
  border-radius: 4px;
  color: #92400e;
}

.placement-guide {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.placement-guide ul {
  margin-top: 12px;
  list-style: none;
}

.placement-guide li {
  padding: 6px 0;
}

.example-usage {
  font-style: italic;
  color: #6b7280;
  margin-top: 20px;
  margin-bottom: 8px;
}

.troubleshooting {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-top: 24px;
}

.troubleshooting ul {
  margin-top: 12px;
}

/* Step 5: Verification */
.checklist {
  max-width: 700px;
  margin: 0 auto 40px;
}

.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.checklist-item:hover {
  border-color: #a5b4fc;
}

.checklist-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin-top: 4px;
  cursor: pointer;
}

.checklist-content {
  flex: 1;
}

.checklist-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.checklist-hint {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

.checklist-hint a {
  color: #6366f1;
  text-decoration: none;
}

.checklist-hint a:hover {
  text-decoration: underline;
}

.completion-message {
  text-align: center;
  background: #d1fae5;
  border: 2px solid #a7f3d0;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 32px;
}

.success-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.completion-message h3 {
  font-size: 24px;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 8px;
}

.completion-message p {
  color: #047857;
}

.next-steps, .help-resources {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.next-steps h3, .help-resources h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.next-steps ul, .help-resources ul {
  margin-left: 20px;
  color: #4b5563;
}

.next-steps li, .help-resources li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.help-resources a {
  color: #6366f1;
  text-decoration: none;
}

.help-resources a:hover {
  text-decoration: underline;
}

/* Step Actions */
.step-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 2px solid #e5e7eb;
}

.btn-primary, .btn-secondary {
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.btn-primary {
  background: #6366f1;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #4b5563;
  border-color: #e5e7eb;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* Responsive */
@media (max-width: 768px) {
  .value-cards {
    grid-template-columns: 1fr;
  }

  .platform-comparison {
    grid-template-columns: 1fr;
  }

  .product-type-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .goal-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .guide {
    padding: 20px;
  }

  .code-block pre {
    font-size: 11px;
  }
}
</style>
