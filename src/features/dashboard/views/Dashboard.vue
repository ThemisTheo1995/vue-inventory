<template>
  <div class="space-y-8 pb-24 relative">
    
    <!-- Welcome Header & Quick Action Hub -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-card-1">
      <div>
        <div class="flex flex-wrap items-center gap-2 mb-1">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span class="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            SyncFlow Engine Active
          </span>
          <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Updated just now</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-black tracking-wider text-slate-900 dark:text-white">
          Overview
        </h1>
      </div>
    </div>

    <!-- KPI Metric Cards Grid (Optimized breakpoints to prevent squeezing) -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      
      <!-- Card 1: Revenue -->
      <div class="relative group bg-white dark:bg-slate-800/80 backdrop-blur-xl border dark:border-slate-200/70 border-slate-700/20 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 ease-out hover:-translate-y-1 p-6 animate-card-1">
        <div class="absolute inset-0 z-0 rounded-2xl bg-gradient-to-br from-transparent to-brand-50/30 dark:to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Revenue</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-1">$142,500.00</h3>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 transition-transform duration-300 group-hover:scale-105">
            <DollarSign class="w-6 h-6" />
          </div>
        </div>
        <div class="relative z-10 mt-4 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          <TrendingUp class="w-3.5 h-3.5 mr-1" />
          <span>+14.2%</span>
          <span class="text-slate-500 dark:text-slate-400 font-normal ml-1.5">vs last month</span>
        </div>
      </div>

      <!-- Card 2: Inventory Valuation -->
      <div class="relative group bg-white dark:bg-slate-800/80 backdrop-blur-xl border dark:border-slate-200/70 border-slate-700/20 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 ease-out hover:-translate-y-1 p-6 animate-card-2">
        <div class="absolute inset-0 z-0 rounded-2xl bg-gradient-to-br from-transparent to-brand-50/30 dark:to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Inventory Assets</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-1">$84,210.50</h3>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 transition-transform duration-300 group-hover:scale-105">
            <Package class="w-6 h-6" />
          </div>
        </div>
        <div class="relative z-10 mt-4 flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span class="text-slate-900 dark:text-white font-bold mr-1">412 SKUs</span> active in warehouse
        </div>
      </div>

      <!-- Card 3: Pending Purchase Orders -->
      <div class="relative group bg-white dark:bg-slate-800/80 backdrop-blur-xl border dark:border-slate-200/70 border-slate-700/20 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 ease-out hover:-translate-y-1 p-6 animate-card-3">
        <div class="absolute inset-0 z-0 rounded-2xl bg-gradient-to-br from-transparent to-brand-50/30 dark:to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending POs</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-1">8 Orders</h3>
          </div>
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 transition-transform duration-300 group-hover:scale-105">
            <Truck class="w-6 h-6" />
          </div>
        </div>
        <div class="relative z-10 mt-4 flex items-center text-xs text-amber-600 dark:text-amber-400 font-semibold">
          <Clock class="w-3.5 h-3.5 mr-1" />
          <span>$18,400.00</span>
          <span class="text-slate-500 dark:text-slate-400 font-normal ml-1.5">in transit</span>
        </div>
      </div>

      <!-- Card 4: Active Network -->
      <div class="relative group bg-white dark:bg-slate-800/80 backdrop-blur-xl border dark:border-slate-200/70 border-slate-700/20 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 ease-out hover:-translate-y-1 p-6 animate-card-4">
        <div class="absolute inset-0 z-0 rounded-2xl bg-gradient-to-br from-transparent to-brand-50/30 dark:to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Trading Partners</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-1">180 Total</h3>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20 transition-transform duration-300 group-hover:scale-105">
            <Users class="w-6 h-6" />
          </div>
        </div>
        <div class="relative z-10 mt-4 flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span class="text-slate-900 dark:text-white font-bold mr-1">148</span> Customers • <span class="text-slate-900 dark:text-white font-bold ml-1">32</span> Suppliers
        </div>
      </div>

    </div>

    <!-- Main Content Split Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-0">
      
      <!-- Left Column: Recent Orders Activity Stream (Spans 2 Cols) -->
      <div class="xl:col-span-2 space-y-6 animate-card-3">
        
        <div class="relative group bg-white dark:bg-slate-800/80 backdrop-blur-xl border dark:border-slate-200/70 border-slate-700/20 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ease-out p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Latest sell and purchase orders processed across workspace</p>
            </div>
            <router-link to="/sell-orders" class="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center pointer-events-auto">
              View All <ArrowUpRight class="w-3.5 h-3.5 ml-0.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </router-link>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-max">
              <thead>
                <tr class="border-b border-slate-200/70 dark:border-slate-700/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th class="pb-3 font-semibold">Reference</th>
                  <th class="pb-3 font-semibold">Type</th>
                  <th class="pb-3 font-semibold">Partner</th>
                  <th class="pb-3 font-semibold">Status</th>
                  <th class="pb-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm">
                
                <tr class="group/row hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors duration-200">
                  <td class="py-3.5 font-bold text-slate-900 dark:text-white">SO-2026-089</td>
                  <td class="py-3.5">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      Sell Order
                    </span>
                  </td>
                  <td class="py-3.5 text-slate-600 dark:text-slate-300 font-medium">Acme Corp Ltd.</td>
                  <td class="py-3.5">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                      Draft
                    </span>
                  </td>
                  <td class="py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">$4,250.00</td>
                </tr>

                <tr class="group/row hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors duration-200">
                  <td class="py-3.5 font-bold text-slate-900 dark:text-white">PO-2026-044</td>
                  <td class="py-3.5">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      Purchase Order
                    </span>
                  </td>
                  <td class="py-3.5 text-slate-600 dark:text-slate-300 font-medium">Global Supply Co.</td>
                  <td class="py-3.5">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                      Received
                    </span>
                  </td>
                  <td class="py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">$12,890.00</td>
                </tr>

                <tr class="group/row hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors duration-200">
                  <td class="py-3.5 font-bold text-slate-900 dark:text-white">SO-2026-088</td>
                  <td class="py-3.5">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      Sell Order
                    </span>
                  </td>
                  <td class="py-3.5 text-slate-600 dark:text-slate-300 font-medium">Vertex Technologies</td>
                  <td class="py-3.5">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400">
                      Confirmed
                    </span>
                  </td>
                  <td class="py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">$1,450.00</td>
                </tr>

                <tr class="group/row hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors duration-200">
                  <td class="py-3.5 font-bold text-slate-900 dark:text-white">PO-2026-043</td>
                  <td class="py-3.5">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      Purchase Order
                    </span>
                  </td>
                  <td class="py-3.5 text-slate-600 dark:text-slate-300 font-medium">Precision Parts Inc.</td>
                  <td class="py-3.5">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      Sent
                    </span>
                  </td>
                  <td class="py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">$8,300.00</td>
                </tr>

              </tbody>
            </table>
          </div>

        </div>

      </div>

      <!-- Right Column: Low Stock Warnings & Shortcuts -->
      <div class="space-y-6 animate-card-4">
        
        <!-- Inventory Stock Alerts Card -->
        <div class="relative group bg-white dark:bg-slate-800/80 backdrop-blur-xl border dark:border-slate-200/70 border-slate-700/20 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ease-out p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <AlertTriangle class="w-4 h-4" />
              </div>
              <h2 class="text-base font-bold text-slate-900 dark:text-white">Low Stock Alerts</h2>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">3 Items</span>
          </div>

          <div class="space-y-3">
            
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between transition-all duration-200 hover:border-rose-500/30 hover:bg-slate-100/80 dark:hover:bg-slate-700/50">
              <div class="flex-1 min-w-0 pr-4">
                <p class="text-xs font-bold text-slate-900 dark:text-white truncate">Industrial Bolt M8</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">SKU: BOLT-M8-01</p>
              </div>
              <div class="text-right shrink-0">
                <span class="inline-block px-2 py-0.5 rounded text-xs font-black bg-rose-500/10 text-rose-600 dark:text-rose-400">4 left</span>
                <p class="text-[10px] text-slate-400 mt-0.5">Min: 15</p>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between transition-all duration-200 hover:border-rose-500/30 hover:bg-slate-100/80 dark:hover:bg-slate-700/50">
              <div class="flex-1 min-w-0 pr-4">
                <p class="text-xs font-bold text-slate-900 dark:text-white truncate">Aluminum Sheet 2mm</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">SKU: ALU-SHT-2</p>
              </div>
              <div class="text-right shrink-0">
                <span class="inline-block px-2 py-0.5 rounded text-xs font-black bg-rose-500/10 text-rose-600 dark:text-rose-400">2 left</span>
                <p class="text-[10px] text-slate-400 mt-0.5">Min: 10</p>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between transition-all duration-200 hover:border-rose-500/30 hover:bg-slate-100/80 dark:hover:bg-slate-700/50">
              <div class="flex-1 min-w-0 pr-4">
                <p class="text-xs font-bold text-slate-900 dark:text-white truncate">Copper Wire Spool 50m</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">SKU: COP-WIR-50</p>
              </div>
              <div class="text-right shrink-0">
                <span class="inline-block px-2 py-0.5 rounded text-xs font-black bg-rose-500/10 text-rose-600 dark:text-rose-400">1 left</span>
                <p class="text-[10px] text-slate-400 mt-0.5">Min: 5</p>
              </div>
            </div>

          </div>

          <router-link
            to="/inventory"
            class="mt-4 w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors border border-slate-200/70 dark:border-slate-700 pointer-events-auto"
          >
            Manage Inventory Catalog
          </router-link>
        </div>

      </div>

    </div>

    <!-- MOCK DATA OVERLAY (Scoped specifically to main content area instead of fixed viewport) -->
    <div class="absolute inset-0 z-40 pointer-events-none flex items-start justify-center pt-24 rounded-2xl overflow-hidden">
      <!-- Blue tint overlay covering only the dashboard content -->
      <div class="absolute inset-0 bg-blue-900/10 dark:bg-blue-900/25 backdrop-blur-[1px]"></div>
      
      <!-- Centered Mock Data Badge -->
      <div class="relative z-10 bg-blue-900/90 dark:bg-slate-800/95 backdrop-blur-md border border-blue-400/30 dark:border-blue-500/30 text-white px-6 py-4 rounded-2xl shadow-2xl flex flex-col items-center gap-2">
        <div class="flex items-center gap-3">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          <h2 class="text-lg md:text-xl font-black tracking-wide text-blue-50">Mock Data Preview</h2>
        </div>
        <p class="text-xs md:text-sm text-blue-200/80 font-medium text-center max-w-[250px]">
          All dashboard metrics and transactions are simulated for demonstration purposes.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { 
  Truck, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  AlertTriangle 
} from 'lucide-vue-next'
</script>

<style scoped>
@keyframes slide-in-left {
  0% {
    opacity: 0;
    transform: translateX(-24px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-card-1 {
  animation: slide-in-left 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
}
.animate-card-2 {
  animation: slide-in-left 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both;
}
.animate-card-3 {
  animation: slide-in-left 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.19s both;
}
.animate-card-4 {
  animation: slide-in-left 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.26s both;
}
</style>
