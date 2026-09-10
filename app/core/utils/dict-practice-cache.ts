type CacheEntry = { val: unknown; version: number; updated_at?: string }

export function getDictPracticeKey(dict: { id?: string | number; enName?: string; custom?: boolean }): string {
  return String((!dict.custom && dict.enName) || dict.id || '')
}

/** The archive is already scoped by dictionary; shared/remote caches must match its owner. */
export function selectDictPracticeCache<T extends CacheEntry>(key: string, archived: T | null, ...candidates: (T | null)[]): T | null {
  let selected = archived
  for (const candidate of candidates) {
    if (!candidate?.val || typeof candidate.val !== 'object') continue
    const owner = (candidate.val as { dictKey?: string }).dictKey
    if (owner && owner !== key) continue
    // Untagged legacy data belongs to the active dictionary only before archiving.
    if (!owner && archived) continue
    if (!selected || (Date.parse(candidate.updated_at ?? '') || 0) > (Date.parse(selected.updated_at ?? '') || 0)) selected = candidate
  }
  return selected
}
