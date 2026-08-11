<template>
  <div class="flex min-h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
    <div class="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-brand-500 to-brand-900 dark:from-brand-700 dark:to-slate-900 overflow-hidden">
      
      <svg class="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g class="text-white/10" stroke="currentColor" stroke-width="4" fill="none">
          <path d="M-100,200 H250 a30,30 0 0,1 30,30 V500 a30,30 0 0,0 30,30 H900" />
          <path d="M450,-100 V350 a30,30 0 0,0 30,30 H900" />
          <path d="M-100,600 H150 a30,30 0 0,0 30,-30 V400 a30,30 0 0,1 30,-30 H350 a30,30 0 0,0 30,-30 V-100" />
          <path d="M-100,400 H100 a30,30 0 0,1 30,30 V750 a30,30 0 0,0 30,30 H900" />
          <path d="M600,900 V650 a30,30 0 0,1 30,-30 H900" />
        </g>

        <g filter="url(#glow)">
          <path class="pipe-flow-1" stroke="#93C5FD" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="40 160" d="M-100,200 H250 a30,30 0 0,1 30,30 V500 a30,30 0 0,0 30,30 H900" />
          <path class="pipe-flow-2" stroke="#60A5FA" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="40 160" d="M450,-100 V350 a30,30 0 0,0 30,30 H900" />
          <path class="pipe-flow-3" stroke="#BFDBFE" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="60 200" d="M-100,600 H150 a30,30 0 0,0 30,-30 V400 a30,30 0 0,1 30,-30 H350 a30,30 0 0,0 30,-30 V-100" />
          <path class="pipe-flow-4" stroke="#93C5FD" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="30 150" d="M-100,400 H100 a30,30 0 0,1 30,30 V750 a30,30 0 0,0 30,30 H900" />
          <path class="pipe-flow-5" stroke="#60A5FA" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="50 150" d="M600,900 V650 a30,30 0 0,1 30,-30 H900" />
        </g>

        <g fill="#1E3A8A" stroke="rgba(255,255,255,0.3)" stroke-width="2">
          <circle cx="280" cy="200" r="6" />
          <circle cx="280" cy="530" r="6" />
          <circle cx="450" cy="380" r="6" />
          <circle cx="180" cy="600" r="6" />
          <circle cx="180" cy="370" r="6" />
          <circle cx="380" cy="370" r="6" />
          <circle cx="130" cy="400" r="6" />
          <circle cx="130" cy="780" r="6" />
          <circle cx="600" cy="620" r="6" />
        </g>
      </svg>

      <div class="relative z-10 flex flex-col justify-between p-12 lg:p-20 w-full text-white h-full">
        <div>
          <h1 class="text-4xl font-black tracking-tighter drop-shadow-md">SyncFlow<span class="text-brand-300">.</span></h1>
        </div>
        
        <div class="max-w-md mb-20 p-8 rounded-3xl bg-black/50 backdrop-blur-md shadow-2xl">
          <h2 class="text-3xl font-bold mb-4 tracking-tight text-white drop-shadow-sm">
            Streamline your integrations.
          </h2>
          <p class="text-white/90 text-lg leading-relaxed drop-shadow-sm">
            Connect your favorite platforms in seconds. SyncFlow monitors your data pipelines effortlessly.
          </p>
        </div>
        
        <div class="text-white/60 text-sm font-medium drop-shadow-sm">&copy; {{ new Date().getFullYear() }} SyncFlow Inc.</div>
      </div>
    </div>

    <div class="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
      <div class="w-full max-w-md space-y-8">
        
        <div class="text-center lg:text-left">
          <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-all">
            {{ isLogin ? 'Welcome back' : 'Create an account' }}
          </h2>
          <div v-if="!isLogin" class="flex gap-2 mt-4">
             <div class="h-1 flex-1 rounded-full transition-all duration-500" :class="signupStep >= 1 ? 'bg-brand-600' : 'bg-slate-200'"></div>
             <div class="h-1 flex-1 rounded-full transition-all duration-500" :class="signupStep >= 2 ? 'bg-brand-600' : 'bg-slate-200'"></div>
             <div class="h-1 flex-1 rounded-full transition-all duration-500" :class="signupStep === 3 ? 'bg-brand-600' : 'bg-slate-200'"></div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="relative">
          <Transition name="fade-slide" mode="out-in">
            <div :key="isLogin ? 'login' : `signup-${signupStep}`" class="space-y-5">
              
              <template v-if="isLogin">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700">Email</label>
                  <input v-model="loginForm.email" type="email" required class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="you@company.com">
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700">Password</label>
                  <input v-model="loginForm.password" type="password" required class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="••••••••">
                </div>
              </template>

              <template v-else-if="signupStep === 1">
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">First Name</label>
                    <input v-model="form.user.first_name" required type="text" class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="John">
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Last Name</label>
                    <input v-model="form.user.last_name" required type="text" class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="Doe">
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700">Email</label>
                  <input v-model="form.user.email" required type="email" class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="john@example.com">
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Password</label>
                    <input v-model="form.user.password" required type="password" class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="••••••••">
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Confirm Password</label>
                    <input v-model="form.user.confirm_password" required type="password" class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="••••••••">
                  </div>
                </div>
                <p v-if="passwordError" class="text-sm text-red-500">{{ passwordError }}</p>
              </template>

              <template v-else-if="signupStep === 2">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700">Workspace Name</label>
                  <input v-model="form.workspace.name" required type="text" class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="Acme Corp">
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700">Workspace Email</label>
                  <input v-model="form.workspace.email" required type="email" class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="contact@acme.com">
                </div>
              </template>

              <template v-else-if="signupStep === 3">
                <label class="text-sm font-medium text-slate-700 block mb-1">Select your Product Tier</label>
                <div class="space-y-3">
                  <div 
                    @click="form.plan = 'growth'"
                    :class="['p-4 border rounded-xl cursor-pointer transition-all flex justify-between items-center', form.plan === 'growth' ? 'border-brand-600 bg-brand-50/30 ring-2 ring-brand-500/10' : 'border-slate-200 hover:border-slate-300']"
                  >
                    <div>
                      <p class="font-bold text-slate-900 dark:text-white text-sm">Growth Plan</p>
                      <p class="text-xs text-slate-500">Up to 2,500 listings & 250k API hits</p>
                    </div>
                    <span class="font-black text-slate-950 dark:text-white text-base">$49<span class="text-xs font-normal text-slate-400">/mo</span></span>
                  </div>

                  <div 
                    @click="form.plan = 'pro'"
                    :class="['p-4 border rounded-xl cursor-pointer transition-all flex justify-between items-center', form.plan === 'pro' ? 'border-brand-600 bg-brand-50/30 ring-2 ring-brand-500/10' : 'border-slate-200 hover:border-slate-300']"
                  >
                    <div>
                      <p class="font-bold text-slate-900 dark:text-white text-sm">Pro Production</p>
                      <p class="text-xs text-slate-500">Up to 10,000 listings & 1.5M API hits</p>
                    </div>
                    <span class="font-black text-slate-950 dark:text-white text-base">$99<span class="text-xs font-normal text-slate-400">/mo</span></span>
                  </div>

                  <div 
                    @click="form.plan = 'enterprise'"
                    :class="['p-4 border rounded-xl cursor-pointer transition-all flex justify-between items-center', form.plan === 'enterprise' ? 'border-brand-600 bg-brand-50/30 ring-2 ring-brand-500/10' : 'border-slate-200 hover:border-slate-300']"
                  >
                    <div>
                      <p class="font-bold text-slate-900 dark:text-white text-sm">Enterprise Tier</p>
                      <p class="text-xs text-slate-500">Custom volume structures for scale</p>
                    </div>
                    <span class="font-black text-slate-950 dark:text-white text-base">$299<span class="text-xs font-normal text-slate-400">/mo</span></span>
                  </div>
                </div>
              </template>

              <button 
                type="button"
                v-if="!isLogin && signupStep === 1"
                @click="handleNextStep"
                class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all active:scale-[0.98]"
              >
                Continue to Workspace Details <ArrowRight class="w-4 h-4" />
              </button>

              <button 
                type="button"
                v-else-if="!isLogin && signupStep === 2"
                @click="signupStep = 3"
                class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all active:scale-[0.98]"
              >
                Continue to Plan Selection <ArrowRight class="w-4 h-4" />
              </button>

              <button 
                v-else
                type="submit" 
                class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all active:scale-[0.98]"
                :disabled="isLoading"
              >
                <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
                <span v-else>{{ isLogin ? 'Sign In' : 'Complete Registration' }}</span>
              </button>

              <button 
                v-if="!isLogin && signupStep > 1"
                type="button"
                @click="signupStep--"
                class="w-full py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                &larr; Back to {{ signupStep === 3 ? 'Workspace Details' : 'Personal Details' }}
              </button>
            </div>
          </Transition>
        </form>

        <div class="text-center text-sm text-slate-500 pt-8 border-t">
          {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          <button @click="toggleMode" class="font-semibold text-brand-600 ml-1">{{ isLogin ? 'Sign up' : 'Sign in' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Loader2 } from 'lucide-vue-next'
import { type AuthResponse, authService } from '../services/auth.service'
import type { PricingPlan } from '../types'

const router = useRouter()
const isLogin = ref<boolean>(true)
const signupStep = ref<number>(1)
const isLoading = ref<boolean>(false)
const passwordError = ref<string>('')

const loginForm = reactive({ email: '', password: '' })
const form = reactive({
  user: { first_name: '', last_name: '', email: '', password: '', confirm_password: '' },
  workspace: { name: '', email: '' },
  plan: 'growth' as PricingPlan
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
  signupStep.value = 1
  passwordError.value = ''
}

const handleNextStep = () => {
  if (form.user.password !== form.user.confirm_password) {
    passwordError.value = 'Passwords do not match'
    return
  }
  if (!form.user.password || !form.user.confirm_password) {
    passwordError.value = 'Please enter a password'
    return
  }
  
  passwordError.value = ''
  signupStep.value = 2
}

const handleSubmit = async () => {
  isLoading.value = true
  try {
    let response: AuthResponse

    if (isLogin.value) {
      response = await authService.login(loginForm)
    } else {
      response = await authService.register(form)
    }

    const targetWorkspaceId = response.workspace_id

    router.push({ 
      name: 'dashboard', 
      params: { workspaceId: targetWorkspaceId } 
    })

  } catch (err) {
    console.error('Authentication process failed.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Transition Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Pipeline CSS Animations */
.pipe-flow-1 { animation: flow-1 4s linear infinite; } 
@keyframes flow-1 { to { stroke-dashoffset: -200; } }

.pipe-flow-2 { animation: flow-2 5s linear infinite; } 
@keyframes flow-2 { to { stroke-dashoffset: -200; } }

.pipe-flow-3 { animation: flow-3 6s linear infinite; } 
@keyframes flow-3 { to { stroke-dashoffset: 260; } }

.pipe-flow-4 { animation: flow-4 4.5s linear infinite; } 
@keyframes flow-4 { to { stroke-dashoffset: -180; } }

.pipe-flow-5 { animation: flow-5 3.5s linear infinite; } 
@keyframes flow-5 { to { stroke-dashoffset: -200; } }
</style>
