import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'
import { DICT_LIST, ENV } from '@/core/config/env.ts'
import { useBaseStore } from '@/core/stores/base.ts'
import type { DictResource, Word } from '@/core/types/types.ts'
import { isSameDictResource, resourceWrap } from '@/core/utils'
import { buildWordSearchIndex, findReplacementDictionary, loadSearchDictionaries, searchDictionaryKey, searchWordIndex } from '@/core/utils/global-word-search.ts'

export function useGlobalWordSearch() {
  const store = useBaseStore()
  const catalog = shallowRef<DictResource[] | null>(null)
  const cache = new Map<string, Word[]>()
  const revision = ref(0)
  const loading = ref(false)
  const catalogError = ref(false)
  const failed = shallowRef<DictResource[]>([])
  const query = ref('')
  const controller = new AbortController()

  // Local profiles stay reactive; never put private dictionaries in a module-level cache.
  const local = computed(() => store.word.bookList.filter(dict =>
    dict.custom || dict.system || (!(catalog.value ?? []).some(resource => isSameDictResource(resource, dict)) && !findReplacementDictionary(dict, catalog.value ?? []))
  ))
  const remote = computed(() => [
    ...(catalog.value ?? []),
    ...local.value.filter(dict => !dict.custom && !dict.system && dict.url),
  ])
  const dictionaries = computed(() => {
    revision.value
    return [
      ...remote.value.filter(dict => cache.has(searchDictionaryKey(dict)))
        .map(dict => ({ ...dict, words: cache.get(searchDictionaryKey(dict))! })),
      ...local.value.filter(dict => dict.custom || dict.system || !dict.url),
    ]
  })
  const index = computed(() => buildWordSearchIndex(dictionaries.value))
  const results = computed(() => searchWordIndex(index.value, query.value))
  const loadedCount = computed(() => dictionaries.value.length)
  const totalCount = computed(() => remote.value.length + local.value.filter(dict => dict.custom || dict.system || !dict.url).length)

  async function fetchJson(url: string) {
    const response = await fetch(resourceWrap(url), {
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(20000)]),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    if (!Array.isArray(data)) throw new Error('Invalid dictionary data')
    return data
  }

  async function load() {
    if (loading.value || controller.signal.aborted) return
    loading.value = true
    catalogError.value = false
    try {
      if (!catalog.value) {
        try {
          catalog.value = await fetchJson(DICT_LIST.WORD.ALL)
        } catch {
          catalogError.value = true
        }
      }
      failed.value = await loadSearchDictionaries(remote.value, cache, dict =>
        fetchJson(`${ENV.RESOURCE_URL}/dicts/${dict.language}/word/${dict.url}`),
      () => revision.value++, controller.signal)
    } finally {
      loading.value = false
    }
  }

  onBeforeUnmount(() => controller.abort())
  return { catalog, query, results, loading, catalogError, failed, loadedCount, totalCount, load }
}
