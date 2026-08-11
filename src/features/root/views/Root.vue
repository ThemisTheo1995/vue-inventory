<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-950 transition-colors duration-300 overflow-x-hidden">
    
    <nav class="border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md fixed top-0 left-0 w-full z-50">
      <div class="max-w-7xl mx-auto px-6 py-5 lg:py-6 flex items-center justify-between">
        <div class="flex items-center gap-10">
          <span class="text-xl font-black tracking-tighter text-slate-950 dark:text-white">
            SyncFlow<span class="text-slate-400 dark:text-slate-600">/</span>Core
          </span>
          <div class="hidden md:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <a href="#erp" class="hover:text-slate-900 dark:hover:text-white transition">01 // ERP Ledger</a>
            <a href="#ebay" class="hover:text-slate-900 dark:hover:text-white transition">02 // eBay Link</a>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <router-link :to="{ name: 'auth' }" class="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-950 dark:hover:text-white transition">
            Sign In
          </router-link>
          <router-link :to="{ name: 'auth' }" class="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold py-3 px-5 rounded-xl transition active:scale-[0.98] shadow-sm text-xs uppercase tracking-wider">
            Provision Core
          </router-link>
        </div>
      </div>
    </nav>

    <header class="relative pt-40 pb-28 border-b border-slate-800/40 bg-slate-900 dark:bg-slate-950 transition-colors duration-300 text-white">
      
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiLz48L3N2Zz4=')]"></div>

      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wOCkiLz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center animate-slide-up-fade">
        <div class="space-y-6 lg:col-span-7">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 dark:bg-white/5 text-slate-200 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-white/10">
            <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Standalone Operational Node
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[1.05]">
            The isolated ERP core.<br />
            Synchronized with eBay<span class="text-slate-500">.</span>
          </h1>
          <p class="text-slate-300 dark:text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
            A high-throughput merchant ecosystem. Route external eBay transactional dictionaries straight into a localized double-entry financial journal and atomic SKU inventory ledger.
          </p>
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <router-link :to="{ name: 'auth' }" class="bg-white hover:bg-slate-100 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition active:scale-[0.98] shadow-md text-xs uppercase tracking-wider text-center">
              Deploy Framework Core
            </router-link>
            <a href="#erp" class="px-6 py-3.5 rounded-xl bg-white/5 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition text-center border border-white/10">
              Read Technical Spec
            </a>
          </div>
        </div>

        <div class="lg:col-span-5 hidden lg:block">
          <div class="bg-slate-950/40 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-sm space-y-4 relative">
             <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom_right,white,transparent)] pointer-events-none rounded-2xl"></div>
            
            <div class="relative z-10 space-y-4">
              <div class="flex items-center justify-between border-b border-white/5 pb-3">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">// SYSTEM_CORE_MONITOR</span>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-md border border-emerald-500/20">ACTIVE</span>
              </div>
              
              <div class="space-y-2.5">
                <div class="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-white/5 relative overflow-hidden group">
                   <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span class="text-xs font-bold text-slate-300 relative z-10">Inbound Adapter Reconcile</span>
                  <span class="text-xs font-mono font-bold text-slate-500 relative z-10">0.00ms Delta</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-white/5 relative overflow-hidden group">
                  <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span class="text-xs font-bold text-slate-300 relative z-10">Ledger Balance Assurance</span>
                  <span class="text-xs font-mono font-bold text-white relative z-10">100% Parity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section id="erp" class="py-24 max-w-7xl mx-auto px-6 space-y-12">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div class="space-y-1">
          <h2 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">01 // Standalone ERP Engine</h2>
          <p class="text-slate-500 dark:text-slate-400 font-medium text-sm">
            Isolated system records configured for transactional immutability.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        <div class="bg-white dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200/70 dark:border-slate-700/70 flex gap-4">
          <div class="p-3 bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 rounded-xl text-purple-700 dark:text-purple-400 h-fit">
            <span class="text-xs font-black uppercase tracking-wider font-mono">LGR</span>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Double-Entry Ledger</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-normal font-medium">
              Transactions settle into an authenticated local journal. Track multi-currency balance valuations instantly across all internal tables.
            </p>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200/70 dark:border-slate-700/70 flex gap-4">
          <div class="p-3 bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 rounded-xl text-sky-700 dark:text-sky-400 h-fit">
            <span class="text-xs font-black uppercase tracking-wider font-mono">GRD</span>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Privilege Safeguards</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-normal font-medium">
              Enforce system-level security guards. Rank immunity rules stop lower-tier tokens from mutating parameters or accessing protected logs.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section id="ebay" class="bg-white dark:bg-slate-900 border-y border-slate-200/60 dark:border-slate-800/60 py-24 transition-colors duration-300 relative overflow-hidden">
       <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMikiLz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiLz48L3N2Zz4=')] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div class="space-y-5">
          <span class="px-2.5 py-1 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 rounded-md uppercase tracking-wider">
            eBay Adapter Loop
          </span>
          <h3 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
            Direct inventory orchestration.
          </h3>
          <p class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-medium max-w-xl">
            Our mapping pipeline handles deep variations and safeguards data boundaries natively. When an inbound checkout event strikes, the dictionary evaluates soft-deleted profile indexes to recover user tracking contexts automatically.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 rounded-2xl overflow-hidden shadow-inner relative">
           <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 pointer-events-none rounded-2xl"></div>

          <div class="p-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/30 text-xs font-bold uppercase tracking-wider text-slate-400 relative z-10">// PIPELINE_TOPOLOGY</div>
          <div class="divide-y divide-slate-100 dark:divide-slate-700/40 text-xs font-medium relative z-10">
            <div class="p-4 flex items-center justify-between group">
              <span class="font-mono text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">EBAY_GATEWAY_SOURCE</span>
              <div class="h-0.5 bg-slate-200 dark:bg-slate-700 flex-1 mx-4 relative overflow-hidden">
                <div class="absolute inset-0 w-8 bg-slate-400 dark:bg-slate-500 animate-stream-flow"></div>
              </div>
              <span class="font-bold text-slate-900 dark:text-white">Mapped Object Shell</span>
            </div>
            <div class="p-4 flex items-center justify-between group">
              <span class="font-mono text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">MAPPED_OBJECT_SHELL</span>
              <div class="h-0.5 bg-slate-200 dark:bg-slate-700 flex-1 mx-4 relative overflow-hidden">
                <div class="absolute inset-0 w-8 bg-slate-400 dark:bg-slate-500 animate-stream-flow [animation-delay:1.5s]"></div>
              </div>
              <span class="font-bold text-slate-900 dark:text-white">ERP Database Ledger</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="py-24 text-center space-y-6 max-w-4xl mx-auto px-6 relative overflow-hidden">
       <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMikiLz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiLz48L3N2Zz4=')] pointer-events-none"></div>

      <h2 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white relative z-10">
        Deploy your isolated instance environment.
      </h2>
      <p class="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-xs font-medium leading-relaxed relative z-10">
        Spin up an internal workspace configuration group in under two minutes. Run operations with total structural boundary compliance.
      </p>
      <div class="pt-2 relative z-10">
        <router-link :to="{ name: 'auth' }" class="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold py-3 px-6 rounded-xl transition active:scale-[0.98] shadow-sm text-xs uppercase tracking-wider">
          Establish Workspace Connection
        </router-link>
      </div>
      <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400 pt-20 relative z-10 border-t border-slate-100 dark:border-slate-800 mt-10">
        &copy; {{ new Date().getFullYear() }} SyncFlow Architecture Inc. Structural Compliance Guarantees.
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
// NOTE: ArrowRight import is currently unused in this layout but preserved.
import { ArrowRight } from 'lucide-vue-next'
</script>

<style scoped>
/* 🎯 ADJUSTMENT: Removed wave-drift keyframes and animation classes for a cleaner, industrial framework aesthetic. */

@keyframes stream-flow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
@keyframes slide-up-fade {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-stream-flow {
  animation: stream-flow 3.5s infinite cubic-bezier(0.16, 1, 0.3, 1);
}
.animate-slide-up-fade {
  animation: slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
