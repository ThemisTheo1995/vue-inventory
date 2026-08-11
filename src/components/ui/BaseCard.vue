<template>
  <div class="print:!block print:!h-auto relative group bg-white dark:bg-slate-800/80 backdrop-blur-xl border dark:border-slate-200/70 border-slate-700/20 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 p-6">
    
    <div class="absolute inset-0 z-0 rounded-2xl bg-gradient-to-br from-transparent to-brand-50/30 dark:to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    
    <slot></slot>
  </div>
</template>
