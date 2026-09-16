import type { DictResource, Word } from '../types/types.ts'

export type SearchDictionary = DictResource & { words: Word[] }
export type WordSearchSource = { dict: DictResource; word: Word }
export type WordSearchEntry = {
  key: string
  normalized: string
  sources: WordSearchSource[]
  translations: string[]
}
export type WordSearchResult = WordSearchEntry & { word: Word; rank: number }

const LEGACY_REPLACEMENTS: Record<string, string> = {
  pep_grade7_1: 'pep_grade7_a_new',
}

export function findReplacementDictionary(dict: DictResource, catalog: DictResource[]): DictResource | undefined {
  const replacementName = LEGACY_REPLACEMENTS[dict.enName ?? '']
  return replacementName ? catalog.find(item => item.enName === replacementName) : undefined
}

export function findSavedDictionary(resource: DictResource, saved: DictResource[], catalog: DictResource[]): DictResource | undefined {
  const direct = saved.find(item => searchDictionaryKey(item) === searchDictionaryKey(resource))
  if (direct) return direct
  const legacy = saved.find(item => findReplacementDictionary(item, catalog)?.enName === resource.enName)
  return legacy
}

export function searchDictionaryKey(dict: DictResource): string {
  return `${dict.language}:${dict.id}:${dict.url ?? ''}`
}

export function buildWordSearchIndex(dictionaries: SearchDictionary[]): WordSearchEntry[] {
  const entries = new Map<string, WordSearchEntry>()
  for (const dict of dictionaries) {
    for (const word of dict.words) {
      const normalized = word.word?.trim().toLowerCase()
      if (!normalized) continue
      const key = `${dict.language}:${normalized}`
      let entry = entries.get(key)
      if (!entry) {
        entry = { key, normalized, sources: [], translations: [] }
        entries.set(key, entry)
      }
      // Keep distinct definitions, including duplicate spellings within a dictionary.
      entry.sources.push({ dict, word })
      entry.translations.push((word.trans ?? []).map(t => t.cn).join('\n').toLowerCase())
    }
  }
  return [...entries.values()]
}

export function searchWordIndex(index: WordSearchEntry[], query: string): WordSearchResult[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []
  const results: WordSearchResult[] = []
  for (const entry of index) {
    const translationIndex = entry.translations.findIndex(text => text.includes(normalized))
    const rank = entry.normalized === normalized ? 0
      : entry.normalized.startsWith(normalized) ? 1
      : entry.normalized.includes(normalized) ? 2
      : translationIndex >= 0 ? 3 : -1
    if (rank < 0) continue
    const seen = new Set<string>()
    results.push({
      ...entry,
      rank,
      word: entry.sources[translationIndex >= 0 ? translationIndex : 0].word,
      sources: entry.sources.filter(source => {
        const key = searchDictionaryKey(source.dict)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      }),
    })
  }
  return results.sort((a, b) => a.rank - b.rank || a.normalized.localeCompare(b.normalized))
}

// Cache only successful loads so a retry can fill gaps without downloading everything again.
export async function loadSearchDictionaries(
  dictionaries: DictResource[],
  cache: Map<string, Word[]>,
  load: (dict: DictResource) => Promise<Word[]>,
  onProgress: () => void = () => {},
  signal?: AbortSignal
): Promise<DictResource[]> {
  const pending = dictionaries.filter(dict => !cache.has(searchDictionaryKey(dict)))
  const failed: DictResource[] = []
  let cursor = 0
  await Promise.all(Array.from({ length: Math.min(3, pending.length) }, async () => {
    while (cursor < pending.length && !signal?.aborted) {
      const dict = pending[cursor++]
      try {
        const words = await load(dict)
        if (!Array.isArray(words)) throw new Error('Invalid dictionary')
        cache.set(searchDictionaryKey(dict), words)
      } catch {
        failed.push(dict)
      }
      onProgress()
    }
  }))
  return failed
}
