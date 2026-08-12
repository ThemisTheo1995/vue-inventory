<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-indigo-100 overflow-x-hidden transition-colors duration-500">
    
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 w-full z-50 transition-all duration-300" :class="{ 'bg-white/70 dark:bg-[#0A0A0A]/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5': scrolled, 'bg-transparent': !scrolled }">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <!-- Logo -->
        <div class="flex items-center gap-3 cursor-pointer group">
          <div class="relative w-10 h-10 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
            <div class="absolute inset-0 bg-white/20 rounded-xl rounded-b-none h-1/2"></div>
            <svg class="w-5 h-5 text-white relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12L12 2L22 12"/>
              <path d="M12 2v20"/>
              <path d="M2 12h20"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
          </div>
          <span class="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
            SyncFlow<span class="text-brand-600">.</span>
          </span>
        </div>
        
        <!-- Center Nav -->
        <div class="hidden md:flex items-center bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-full px-2 py-1.5 backdrop-blur-md shadow-sm">
          <a href="#features" class="px-5 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">Core Engine</a>
          <a href="#inventory" class="px-5 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">Ecosystem</a>
          <a href="#roadmap" class="px-5 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">Pricing</a>
        </div>

        <!-- Actions & Theme Toggle -->
        <div class="flex items-center gap-3">
          
          <!-- Theme Switcher -->
          <div class="hidden sm:flex items-center p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full">
            <button @click="setTheme('light')" :class="theme === 'light' ? 'bg-white dark:bg-white/10 shadow-sm text-blue-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'" class="p-1.5 rounded-full transition-all">
              <Sun class="w-4 h-4" />
            </button>
            <button @click="setTheme('system')" :class="theme === 'system' ? 'bg-white dark:bg-white/10 shadow-sm text-blue-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'" class="p-1.5 rounded-full transition-all">
              <Monitor class="w-4 h-4" />
            </button>
            <button @click="setTheme('dark')" :class="theme === 'dark' ? 'bg-white dark:bg-white/10 shadow-sm text-blue-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'" class="p-1.5 rounded-full transition-all">
              <Moon class="w-4 h-4" />
            </button>
          </div>

          <div class="w-px h-6 bg-slate-200 dark:bg-white/10 mx-2 hidden sm:block"></div>

          <router-link :to="{ name: 'login' }" class="hidden sm:block text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            Sign In
          </router-link>
          
          <router-link :to="{ name: 'register' }" class="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm overflow-hidden shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] active:scale-95 transition-all duration-200">
            <span class="relative z-10">Get Started</span>
            <ArrowRight class="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwaDIwdjIwSDIwVjIweiIgZmlsbD0icmdiYSgxMjgsIDEyOCwgMTI4LCAwLjAzKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwaDIwdjIwSDIwVjIweiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAyKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-100"></div>
        <div class="absolute top-40 -right-20 w-[500px] h-[500px] bg-violet-500/10 dark:bg-violet-500/15 blur-[100px] rounded-full pointer-events-none opacity-50 dark:opacity-100"></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <!-- Animated Badge -->
        <div class="animate-fade-in-up" style="animation-delay: 0.1s;">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold tracking-wide text-slate-700 dark:text-slate-300 mb-6 shadow-sm backdrop-blur-md">
            <div class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </div>
            SyncFlow Engine v1.0 is now live
          </div>
        </div>

        <h1 class="animate-fade-in-up text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.08] mb-6 drop-shadow-sm" style="animation-delay: 0.2s;">
          The nervous system for<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 bg-300% animate-gradient">
            modern enterprises.
          </span>
        </h1>
        
        <p class="animate-fade-in-up text-base sm:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto mb-8 leading-relaxed" style="animation-delay: 0.3s;">
          Unify your financials, automate your inventory, and command your operations from a singular, lightning-fast core. Engineered for scale, designed for humans.
        </p>

        <div class="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 lg:mb-64" style="animation-delay: 0.4s;">
          <button class="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
            Deploy Workspace <ArrowRight class="w-4 h-4" />
          </button>
          <button class="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-white/10 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md">
            <Play class="w-4 h-4" fill="currentColor" /> Watch the Keynote
          </button>
        </div>

        <!-- Premium UI Dashboard Mockup -->
        <div class="w-full overflow-x-auto pb-4">
            <div class="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <!-- Outer Glow Effect -->
              <div class="relative">
                <div class="absolute -inset-1.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-[2.5rem] opacity-75 blur-lg"></div>
                
                <!-- Main Dashboard Container -->
                <div class="relative bg-white dark:bg-[#0F1115] rounded-[2rem] border border-slate-200/80 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row text-left">
                  
                  <!-- Sidebar / ERP Navigation -->
                  <aside class="w-full lg:w-72 bg-slate-50/50 dark:bg-[#15181E] border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-white/5 p-6 flex flex-col justify-between gap-6">
                    <div>
                      <!-- Company Branding -->
                      <div class="flex items-center gap-3 mb-8">
                        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-brand-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                          <Box class="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span class="font-bold text-slate-900 dark:text-white block leading-tight">Acme ERP</span>
                          <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Enterprise Suite</span>
                        </div>
                        <ChevronDown class="w-4 h-4 text-slate-400 ml-auto cursor-pointer" />
                      </div>

                      <!-- Navigation Links -->
                      <nav class="space-y-1.5">
                        <a href="#" class="px-3 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-3 text-sm shadow-sm border border-indigo-200/50 dark:border-indigo-500/20">
                          <LayoutDashboard class="w-4 h-4" /> Overview
                        </a>
                        <a href="#" class="px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-medium flex items-center justify-between text-sm hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                          <div class="flex items-center gap-3"><ShoppingCart class="w-4 h-4" /> Sell Orders</div>
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">8 New</span>
                        </a>
                        <a href="#" class="px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-medium flex items-center justify-between text-sm hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                          <div class="flex items-center gap-3"><ClipboardList class="w-4 h-4" /> Purchase Orders</div>
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">3 Pending</span>
                        </a>
                        <a href="#" class="px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-medium flex items-center justify-between text-sm hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                          <div class="flex items-center gap-3"><Package class="w-4 h-4" /> Inventory</div>
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">12 Low</span>
                        </a>
                        <a href="#" class="px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-medium flex items-center gap-3 text-sm hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                          <Users class="w-4 h-4" /> Customers
                        </a>
                        <a href="#" class="px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-medium flex items-center gap-3 text-sm hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                          <Truck class="w-4 h-4" /> Suppliers
                        </a>
                        <a href="#" class="px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-medium flex items-center gap-3 text-sm hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                          <LineChart class="w-4 h-4" /> Financials
                        </a>
                      </nav>
                    </div>

                    <!-- User Profile Card -->
                    <div class="pt-4 border-t border-slate-200/80 dark:border-white/5 flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 ring-2 ring-white dark:ring-slate-800 shadow-sm"></div>
                      <div class="flex flex-col">
                        <span class="text-sm font-bold text-slate-900 dark:text-white">Sarah Connor</span>
                        <span class="text-xs text-slate-500">System Admin</span>
                      </div>
                    </div>
                  </aside>

                  <!-- Main Content Area -->
                  <main class="flex-1 flex flex-col min-w-0">
                    
                    <!-- Top Navbar -->
                    <header class="h-16 border-b border-slate-200/80 dark:border-white/5 flex items-center justify-between px-6 sm:px-8 bg-white/50 dark:bg-transparent backdrop-blur-md">
                      <div class="flex items-center gap-2 text-slate-400 text-xs sm:text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        <span>Overview</span> 
                        <ChevronRight class="w-4 h-4 flex-shrink-0" /> 
                        <span class="text-slate-900 dark:text-white font-semibold">Q3 Performance</span>
                      </div>
                      
                      <div class="flex items-center gap-3 sm:gap-4">
                        <div class="relative hidden sm:block">
                          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input type="text" placeholder="Search cmd+k" class="pl-9 pr-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border-none text-sm focus:ring-2 focus:ring-indigo-500 w-40 md:w-48 dark:text-white placeholder:text-slate-400 outline-none transition-all" />
                        </div>
                        <button class="relative text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1">
                          <Bell class="w-5 h-5" />
                          <span class="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-[#0F1115]"></span>
                        </button>
                      </div>
                    </header>

                    <!-- Dashboard Body / Widgets -->
                    <div class="p-6 sm:p-8 bg-slate-50/30 dark:bg-transparent flex-1 relative space-y-6">
                      
                      <!-- Floating Monthly ARR Badge -->
                      <div class="hidden xl:block absolute right-8 -top-3 bg-white/90 dark:bg-[#1E2128]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-xl z-20">
                        <div class="flex items-center gap-4">
                          <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                            <TrendingUp class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Monthly ARR</p>
                            <p class="text-lg font-bold text-slate-900 dark:text-white">$1.24M <span class="text-xs text-emerald-500 ml-1 font-semibold">+14.2%</span></p>
                          </div>
                        </div>
                      </div>

                      <!-- Core Metric Grid -->
                      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div class="bg-white dark:bg-[#1A1D24] rounded-2xl p-5 border border-slate-200/80 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                          <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Total Revenue</p>
                          <p class="text-2xl font-bold text-slate-900 dark:text-white">$124,563.00</p>
                        </div>
                        <div class="bg-white dark:bg-[#1A1D24] rounded-2xl p-5 border border-slate-200/80 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                          <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Active Users</p>
                          <p class="text-2xl font-bold text-slate-900 dark:text-white">4,291</p>
                        </div>
                        <div class="bg-white dark:bg-[#1A1D24] rounded-2xl p-5 border border-slate-200/80 dark:border-white/5 shadow-sm relative overflow-hidden group sm:col-span-2 lg:col-span-1">
                          <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                          <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">System Health</p>
                          <div class="flex items-center gap-2">
                            <p class="text-2xl font-bold text-slate-900 dark:text-white">99.99%</p>
                            <span class="flex h-2.5 w-2.5 relative mt-1">
                              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- SVG Chart Widget -->
                      <div class="bg-white dark:bg-[#1A1D24] rounded-2xl border border-slate-200/80 dark:border-white/5 shadow-sm p-5 sm:p-6 relative overflow-hidden">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                          <h3 class="font-bold text-slate-900 dark:text-white">Revenue Overview</h3>
                          <div class="flex gap-1.5 text-xs font-medium bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                            <button class="px-3 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 transition">1W</button>
                            <button class="px-3 py-1 rounded-lg bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm">1M</button>
                            <button class="px-3 py-1 rounded-lg text-slate-500 hover:bg-white dark:hover:bg-white/10 transition">1Y</button>
                          </div>
                        </div>
                        
                        <div class="h-48 w-full relative">
                          <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            <div class="border-t border-slate-100 dark:border-white/5 w-full"></div>
                            <div class="border-t border-slate-100 dark:border-white/5 w-full"></div>
                            <div class="border-t border-slate-100 dark:border-white/5 w-full"></div>
                            <div class="border-t border-slate-100 dark:border-white/5 w-full"></div>
                          </div>
                          
                          <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="rgb(99, 102, 241)" stop-opacity="0.3" />
                                <stop offset="100%" stop-color="rgb(99, 102, 241)" stop-opacity="0" />
                              </linearGradient>
                            </defs>
                            <path d="M0 150 C 100 120, 200 180, 300 110 C 400 40, 500 130, 600 90 C 700 50, 800 100, 900 30 C 950 -5, 1000 40, 1000 40 L 1000 200 L 0 200 Z" fill="url(#chartGradient)" />
                            <path d="M0 150 C 100 120, 200 180, 300 110 C 400 40, 500 130, 600 90 C 700 50, 800 100, 900 30 C 950 -5, 1000 40, 1000 40" fill="none" stroke="rgb(99, 102, 241)" stroke-width="3" stroke-linecap="round" />
                            
                            <circle cx="300" cy="110" r="4" class="fill-white dark:fill-[#1A1D24] stroke-indigo-500 stroke-[3px]" />
                            <circle cx="600" cy="90" r="4" class="fill-white dark:fill-[#1A1D24] stroke-indigo-500 stroke-[3px]" />
                            <circle cx="900" cy="30" r="4" class="fill-white dark:fill-[#1A1D24] stroke-indigo-500 stroke-[3px]" />
                          </svg>

                          <!-- Chart Callout Tooltip -->
                          <div class="absolute left-[60%] top-[30%] -translate-x-1/2 -translate-y-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold py-1 px-2.5 rounded-lg shadow-xl mb-2 pointer-events-none">
                            $48,201.50
                            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900 dark:bg-white"></div>
                          </div>
                          <div class="absolute left-[60%] top-[45%] bottom-0 border-l border-dashed border-indigo-500/50 pointer-events-none"></div>
                        </div>
                      </div>

                      <!-- Transaction & Order Table -->
                      <div class="bg-white dark:bg-[#1A1D24] rounded-2xl border border-slate-200/80 dark:border-white/5 shadow-sm p-4 overflow-hidden">
                        <div class="flex justify-between items-center mb-4 px-2">
                          <h4 class="font-bold text-slate-900 dark:text-white text-sm">Recent Transactions</h4>
                          <span class="text-xs text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:underline">View All</span>
                        </div>
                        <div class="overflow-x-auto">
                          <table class="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                              <tr class="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-white/5">
                                <th class="font-medium pb-3 px-3">Client / Partner</th>
                                <th class="font-medium pb-3 px-3">Amount</th>
                                <th class="font-medium pb-3 px-3">Status</th>
                              </tr>
                            </thead>
                            <tbody class="text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-white/5">
                              <tr class="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                <td class="py-3 px-3 flex items-center gap-3">
                                  <div class="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shadow-sm">S</div>
                                  <span class="font-medium text-slate-900 dark:text-white">Stripe Inc.</span>
                                </td>
                                <td class="py-3 px-3 font-semibold">$4,500.00</td>
                                <td class="py-3 px-3"><span class="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">Paid</span></td>
                              </tr>
                              <tr class="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                <td class="py-3 px-3 flex items-center gap-3">
                                  <div class="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs shadow-sm">V</div>
                                  <span class="font-medium text-slate-900 dark:text-white">Vercel</span>
                                </td>
                                <td class="py-3 px-3 font-semibold">$1,250.00</td>
                                <td class="py-3 px-3"><span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-semibold">Pending</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  </main>
                </div>
              </div>
            </div>


        </div>
      </div>
    </header>

    <!-- Integrations Teaser -->
    <section id="roadmap" class="py-24 lg:py-32 border-y border-slate-200/50 dark:border-white/5 bg-gradient-to-b from-slate-50 to-white dark:from-[#0F1115] dark:to-[#0A0A0A] relative overflow-hidden">
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div class="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
        <div class="inline-flex items-center justify-center p-4 bg-white dark:bg-[#1A1D24] rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200/80 dark:border-white/10 mb-2 transition-transform duration-500 hover:scale-105">
          <Globe class="w-10 h-10 text-indigo-500" />
        </div>
        <h2 class="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
          A solid core today.<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-300">Your ecosystem tomorrow.</span>
        </h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          We believe in getting the foundation perfect first. The core ERP engine is live. Direct bidirectional sync with <span class="text-slate-900 dark:text-white font-bold">Shopify, WooCommerce, Stripe, and Xero</span> is currently in active development.
        </p>
        
        <div class="pt-6">
          <div class="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900 dark:bg-white/10 text-sm font-bold text-white shadow-lg backdrop-blur-md border border-transparent dark:border-white/10">
            <span class="flex h-2.5 w-2.5 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            View the Public Roadmap
            <ArrowUpRight class="w-4 h-4 text-amber-500" />
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  ArrowRight, 
  ArrowUpRight,
  Box, 
  Globe, 
  Play,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  LayoutDashboard,
  LineChart,
  Package,
  Users,
  Search,
  Bell,
  ChevronRight,
  TrendingUp
} from 'lucide-vue-next'

const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

type Theme = 'light' | 'dark' | 'system'
const theme = ref<Theme>('system')

const applyTheme = (t: Theme) => {
  if (typeof window === 'undefined') return
  const isDark = 
    t === 'dark' || 
    (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const setTheme = (t: Theme) => {
  theme.value = t
  localStorage.setItem('syncflow-theme', t)
  applyTheme(t)
}

const mediaQueryList = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null
const handleSystemThemeChange = () => {
  if (theme.value === 'system') applyTheme('system')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  const savedTheme = localStorage.getItem('syncflow-theme') as Theme | null
  if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
    theme.value = savedTheme
  }
  applyTheme(theme.value)
  mediaQueryList?.addEventListener('change', handleSystemThemeChange)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  mediaQueryList?.removeEventListener('change', handleSystemThemeChange)
})
</script>

<style>
html {
  scroll-behavior: smooth;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient {
  background-size: 200% auto;
  animation: gradient 4s linear infinite;
}

@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up { 
  opacity: 0;
  animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
}

@keyframes draw-chart {
  0% { stroke-dasharray: 2000; stroke-dashoffset: 2000; }
  100% { stroke-dasharray: 2000; stroke-dashoffset: 0; }
}
.animate-draw-chart {
  animation: draw-chart 3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes circuit-flow {
  0% { stroke-dasharray: 10 1000; stroke-dashoffset: 1000; }
  100% { stroke-dasharray: 10 1000; stroke-dashoffset: 0; }
}
.animate-circuit-path {
  animation: circuit-flow 10s linear infinite;
}

.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
