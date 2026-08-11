import { ref, watch } from "vue"

export function useSearch(
  fetchCallback: (term: string) => Promise<void>,
  minLength = 3,
  debounceMs = 300
) {
  const searchQuery = ref("")
  const isSearching = ref(false)

  let timeout: ReturnType<typeof setTimeout>

  watch(searchQuery, (value) => {
    clearTimeout(timeout)

    const term = value.trim()

    if (term.length > 0 && term.length < minLength) {
      return
    }

    timeout = setTimeout(async () => {
      isSearching.value = true

      try {
        await fetchCallback(term)
      } finally {
        isSearching.value = false
      }
    }, debounceMs)
  })

  return {
    searchQuery,
    isSearching,
  }
}
