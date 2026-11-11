
<script setup lang="ts" generic="T extends object">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  shallowRef
} from "vue"
import { ChevronDown, LoaderCircle, X } from "lucide-vue-next"

type SearchFunction<T> = (query: string) => Promise<T[]>

const props = withDefaults(defineProps<{
  modelValue: string
  search: SearchFunction<T>
  getItemLabel: (item: T) => string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  fetchOnFocus?: boolean
  minChars?: number
  debounceMs?: number
  maxHeight?: number
  emptyText?: string
  loadingText?: string
  inputClass?: string
  dropdownClass?: string
  closeOnSelect?: boolean
}>(), {
  placeholder: "Search...",
  disabled: false,
  clearable: true,
  fetchOnFocus: true,
  minChars: 0,
  debounceMs: 300,
  maxHeight: 240,
  emptyText: "No results found",
  loadingText: "Searching...",
  inputClass: "",
  dropdownClass: "",
  closeOnSelect: true,
})

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void
  (event: "select", item: T): void
  (event: "clear"): void
  (event: "focus"): void
  (event: "blur"): void
  (event: "search-error", error: unknown): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const results = shallowRef<T[]>([])
const isOpen = ref(false)
const isLoading = ref(false)
const activeIndex = ref(-1)
const dropdownStyle = ref<Record<string, string>>({})

let debounceTimer: ReturnType<typeof setTimeout> | null = null
let requestSequence = 0

const canSearch = computed(
  () => props.modelValue.trim().length >= props.minChars,
)

const cancelPendingSearch = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
}

const updateDropdownPosition = () => {
  const input = inputRef.value
  if (!input || !isOpen.value) return

  const rect = input.getBoundingClientRect()
  const gap = 8
  const viewportPadding = 12

  const spaceBelow = Math.max(
    0,
    window.innerHeight - rect.bottom - gap - viewportPadding,
  )

  const spaceAbove = Math.max(
    0,
    rect.top - gap - viewportPadding,
  )

  const openAbove =
    spaceBelow < Math.min(props.maxHeight, 240) &&
    spaceAbove > spaceBelow

  const availableHeight = Math.max(
    0,
    Math.min(
      props.maxHeight,
      openAbove ? spaceAbove : spaceBelow,
    ),
  )

  const width = Math.min(
    Math.max(rect.width, 220),
    Math.max(0, window.innerWidth - viewportPadding * 2),
  )

  const left = Math.min(
    Math.max(viewportPadding, rect.left),
    Math.max(
      viewportPadding,
      window.innerWidth - width - viewportPadding,
    ),
  )

  dropdownStyle.value = {
    position: "fixed",
    left: `${left}px`,
    width: `${width}px`,
    maxHeight: `${availableHeight}px`,
    zIndex: "99999",
    ...(openAbove
      ? {
          top: "auto",
          bottom: `${window.innerHeight - rect.top + gap}px`,
        }
      : {
          top: `${rect.bottom + gap}px`,
          bottom: "auto",
        }),
  }
}

const runSearch = async (query: string) => {
  cancelPendingSearch()

  const sequence = ++requestSequence

  if (query.trim().length < props.minChars) {
    results.value = []
    isLoading.value = false
    return
  }

  isLoading.value = true
  isOpen.value = true
  activeIndex.value = -1

  await nextTick()
  updateDropdownPosition()

  try {
    const found = await props.search(query.trim())

    if (sequence !== requestSequence) return

    results.value = found
  } catch (error) {
    if (sequence !== requestSequence) return

    results.value = []
    emit("search-error", error)
  } finally {
    if (sequence === requestSequence) {
      isLoading.value = false
      await nextTick()
      updateDropdownPosition()
    }
  }
}

const scheduleSearch = (query: string) => {
  cancelPendingSearch()

  // Invalidate in-flight requests immediately.
  requestSequence++

  if (query.trim().length < props.minChars) {
    results.value = []
    isLoading.value = false
    isOpen.value = false
    return
  }

  isOpen.value = true
  isLoading.value = false
  activeIndex.value = -1

  nextTick(updateDropdownPosition)

  debounceTimer = setTimeout(() => {
    debounceTimer = null
    void runSearch(query)
  }, props.debounceMs)
}

const onInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value

  emit("update:modelValue", value)
  scheduleSearch(value)
}

const onFocus = () => {
  emit("focus")

  isOpen.value = true
  void nextTick(updateDropdownPosition)

  if (props.fetchOnFocus) {
    // Refresh the results whenever the input receives focus.
    void runSearch(props.modelValue)
  }
}

const selectItem = (item: T) => {
  cancelPendingSearch()
  requestSequence++

  emit("update:modelValue", props.getItemLabel(item))
  emit("select", item)

  activeIndex.value = -1

  if (props.closeOnSelect) {
    isOpen.value = false
  }
}

const clear = () => {
  cancelPendingSearch()
  requestSequence++

  emit("update:modelValue", "")
  emit("clear")

  results.value = []
  activeIndex.value = -1
  isOpen.value = true

  // Clearing fetches the unfiltered list immediately.
  void runSearch("")

  nextTick(() => inputRef.value?.focus())
}

const close = () => {
  isOpen.value = false
  activeIndex.value = -1
  emit("blur")
}

const onDocumentPointerDown = (event: PointerEvent) => {
  const target = event.target as Element | null

  if (!target) return

  if (rootRef.value?.contains(target)) return

  if (target.closest(".js-base-autocomplete-dropdown")) return

  close()
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    if (isOpen.value) {
      event.preventDefault()
      close()
    }

    return
  }

  if (event.key === "ArrowDown") {
    if (!isOpen.value) {
      isOpen.value = true
      void nextTick(updateDropdownPosition)
    }

    if (results.value.length) {
      event.preventDefault()

      activeIndex.value =
        (activeIndex.value + 1) % results.value.length
    }

    return
  }

  if (event.key === "ArrowUp" && results.value.length) {
    event.preventDefault()

    activeIndex.value =
      activeIndex.value <= 0
        ? results.value.length - 1
        : activeIndex.value - 1

    return
  }

  if (
    event.key === "Enter" &&
    isOpen.value &&
    activeIndex.value >= 0
  ) {
    event.preventDefault()

    const item = results.value[activeIndex.value]

    if (item) {
      selectItem(item)
    }
  }
}

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) close()
  },
)

const onViewportChange = () => {
  updateDropdownPosition()
}

onMounted(() => {
  window.addEventListener("pointerdown", onDocumentPointerDown)
  window.addEventListener("scroll", onViewportChange, true)
  window.addEventListener("resize", onViewportChange)
})

onBeforeUnmount(() => {
  cancelPendingSearch()
  requestSequence++

  window.removeEventListener("pointerdown", onDocumentPointerDown)
  window.removeEventListener("scroll", onViewportChange, true)
  window.removeEventListener("resize", onViewportChange)
})
</script>

<template>
  <div ref="rootRef" class="relative w-full">
    <div class="relative">
      <input
        ref="inputRef"
        :value="modelValue"
        :disabled="disabled"
        :placeholder="placeholder"
        :class="[
          'w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 pr-10 text-sm font-medium text-slate-900 dark:text-white shadow-sm outline-none transition-all placeholder:font-normal placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60',
          inputClass,
        ]"
        autocomplete="off"
        @input="onInput"
        @focus="onFocus"
        @keydown="onKeydown"
      />

      <div
        class="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1"
      >
        <LoaderCircle
          v-if="isLoading"
          class="h-4 w-4 animate-spin text-brand-500"
        />

        <button
          v-else-if="clearable && modelValue"
          type="button"
          class="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Clear search"
          title="Clear"
          @pointerdown.prevent
          @click="clear"
        >
          <X class="h-4 w-4" />
        </button>

        <ChevronDown
          v-else
          class="h-4 w-4 text-slate-400"
        />
      </div>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="translate-y-1 scale-[0.98] opacity-0"
        enter-to-class="translate-y-0 scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="translate-y-0 scale-100 opacity-100"
        leave-to-class="translate-y-1 scale-[0.98] opacity-0"
      >
        <div
          v-if="isOpen && !disabled"
          :style="dropdownStyle"
          class="js-base-autocomplete-dropdown overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-800/95"
          :class="dropdownClass"
          role="listbox"
        >
          <div
            v-if="isLoading && results.length === 0"
            class="p-5 text-center text-sm font-medium text-slate-400"
          >
            {{ loadingText }}
          </div>

          <div
            v-else-if="results.length === 0"
            class="p-5 text-center text-sm font-medium text-slate-400"
          >
            {{ emptyText }}
          </div>

          <ul
            v-else
            class="divide-y divide-slate-100 py-1 dark:divide-slate-700/60"
          >
            <li
              v-for="(item, index) in results"
              :key="index"
              role="option"
              :aria-selected="activeIndex === index"
              :class="[
                'cursor-pointer flex flex-col gap-0.5 px-4 py-3 text-sm transition-colors',
                activeIndex === index
                    ? 'bg-brand-50 dark:bg-brand-500/10'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/60',
                ]"
              @pointerdown.prevent="selectItem(item)"
              @mouseenter="activeIndex = index"
            >
              <slot
                name="option"
                :item="item"
                :index="index"
                :active="activeIndex === index"
              >
                <span class="font-medium text-slate-900 dark:text-white">
                  {{ getItemLabel(item) }}
                </span>
              </slot>
            </li>
          </ul>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
