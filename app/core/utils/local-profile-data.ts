import { del, keys } from 'idb-keyval'
import { getProfileStorageKey } from './local-profile.ts'

const PROFILE_IDB_BASE_KEYS = [
  'type-words-app-version',
  'typing-word-dict',
  'typing-word-setting',
  'typing-word-files',
  'PracticeSaveWord',
  'PracticeSaveArticle',
  'PracticeSaveSentence',
  'type-words-backup-index',
]

const PROFILE_LOCAL_STORAGE_BASE_KEYS = [
  'PracticeSaveWord',
  'PracticeSaveArticle',
  'PracticeSaveSentence',
  'PracticeFlowV2',
  'supabase_config',
]

export async function deleteLocalProfileData(profileId: string): Promise<void> {
  const exactKeys = new Set(PROFILE_IDB_BASE_KEYS.map(key => getProfileStorageKey(key, profileId)))
  const practicePrefix = getProfileStorageKey('PracticeSaveWord:dict:', profileId)
  const backupPrefix = getProfileStorageKey('type-words-backup-', profileId)
  const storedKeys = await keys()

  for (const key of storedKeys) {
    if (typeof key !== 'string') continue
    if (exactKeys.has(key) || key.startsWith(backupPrefix) || key.startsWith(practicePrefix)) await del(key)
  }

  for (const key of PROFILE_LOCAL_STORAGE_BASE_KEYS) {
    localStorage.removeItem(getProfileStorageKey(key, profileId))
  }
}

/** Clear unfinished word tasks when the user resets the active profile's learning data. */
export async function clearLocalDictPracticeData(): Promise<void> {
  const prefix = getProfileStorageKey('PracticeSaveWord:dict:')
  for (const key of await keys()) {
    if (typeof key === 'string' && key.startsWith(prefix)) await del(key)
  }
}
