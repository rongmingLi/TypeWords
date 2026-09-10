export const LOCAL_PROFILE_REGISTRY_KEY = 'typewords:local-profiles:v1'
export const LOCAL_PROFILE_ACTIVE_KEY = 'typewords:active-local-profile'
export const DEFAULT_LOCAL_PROFILE_ID = 'default'
export const LOCAL_PROFILE_NAME_MAX_LENGTH = 32

export interface LocalProfile {
  id: string
  name: string
  createdAt: number
  updatedAt: number
}

export interface LocalProfileState {
  activeProfileId: string
  profiles: LocalProfile[]
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

type CreateProfileOptions = {
  id?: string
  now?: number
}

function browserStorage(): StorageLike | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

function normalizeProfileName(name: string): string {
  const normalized = String(name ?? '')
    .trim()
    .replace(/\s+/g, ' ')
  if (!normalized) throw new Error('PROFILE_NAME_REQUIRED')
  if ([...normalized].length > LOCAL_PROFILE_NAME_MAX_LENGTH) throw new Error('PROFILE_NAME_TOO_LONG')
  return normalized
}

function isProfile(value: unknown): value is LocalProfile {
  if (!value || typeof value !== 'object') return false
  const profile = value as Partial<LocalProfile>
  return (
    typeof profile.id === 'string' &&
    /^[a-zA-Z0-9_-]+$/.test(profile.id) &&
    typeof profile.name === 'string' &&
    !!profile.name.trim() &&
    [...profile.name.trim()].length <= LOCAL_PROFILE_NAME_MAX_LENGTH &&
    typeof profile.createdAt === 'number' &&
    Number.isFinite(profile.createdAt) &&
    typeof profile.updatedAt === 'number' &&
    Number.isFinite(profile.updatedAt)
  )
}

function defaultProfile(now = Date.now()): LocalProfile {
  return {
    id: DEFAULT_LOCAL_PROFILE_ID,
    name: '默认用户',
    createdAt: now,
    updatedAt: now,
  }
}

function persistProfileState(state: LocalProfileState, storage: StorageLike) {
  storage.setItem(LOCAL_PROFILE_REGISTRY_KEY, JSON.stringify(state.profiles))
  storage.setItem(LOCAL_PROFILE_ACTIVE_KEY, state.activeProfileId)
}

export function getLocalProfileState(storage: StorageLike = browserStorage() as StorageLike): LocalProfileState {
  if (!storage) {
    return { activeProfileId: DEFAULT_LOCAL_PROFILE_ID, profiles: [defaultProfile(0)] }
  }

  let profiles: LocalProfile[] = []
  try {
    const raw = storage.getItem(LOCAL_PROFILE_REGISTRY_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (Array.isArray(parsed)) profiles = parsed.filter(isProfile)
  } catch {
    profiles = []
  }

  if (!profiles.length) profiles = [defaultProfile()]
  try {
    const requestedActiveId = storage.getItem(LOCAL_PROFILE_ACTIVE_KEY)
    const activeProfileId = profiles.some(profile => profile.id === requestedActiveId)
      ? (requestedActiveId as string)
      : profiles[0].id
    const state = { activeProfileId, profiles }
    persistProfileState(state, storage)
    return state
  } catch {
    return { activeProfileId: DEFAULT_LOCAL_PROFILE_ID, profiles: [defaultProfile(0)] }
  }
}

export function getActiveLocalProfile(storage?: StorageLike): LocalProfile {
  try {
    const state = getLocalProfileState(storage ?? (browserStorage() as StorageLike))
    return state.profiles.find(profile => profile.id === state.activeProfileId) ?? state.profiles[0]
  } catch {
    return defaultProfile(0)
  }
}

export function getActiveLocalProfileId(storage?: StorageLike): string {
  if (!storage && !browserStorage()) return DEFAULT_LOCAL_PROFILE_ID
  return getActiveLocalProfile(storage).id
}

export function getProfileStorageKey(baseKey: string, profileId = getActiveLocalProfileId()): string {
  if (profileId === DEFAULT_LOCAL_PROFILE_ID) return baseKey
  if (!/^[a-zA-Z0-9_-]+$/.test(profileId)) throw new Error('INVALID_PROFILE_ID')
  return `typewords:profile:${profileId}:${baseKey}`
}

function createProfileId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function ensureUniqueName(name: string, profiles: LocalProfile[], ignoredId?: string) {
  const comparable = name.toLocaleLowerCase()
  if (profiles.some(profile => profile.id !== ignoredId && profile.name.toLocaleLowerCase() === comparable)) {
    throw new Error('PROFILE_NAME_EXISTS')
  }
}

export function createLocalProfile(
  name: string,
  storage: StorageLike = browserStorage() as StorageLike,
  options: CreateProfileOptions = {}
): LocalProfile {
  const state = getLocalProfileState(storage)
  const normalizedName = normalizeProfileName(name)
  ensureUniqueName(normalizedName, state.profiles)
  const now = options.now ?? Date.now()
  const profile: LocalProfile = {
    id: options.id ?? createProfileId(),
    name: normalizedName,
    createdAt: now,
    updatedAt: now,
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(profile.id) || state.profiles.some(item => item.id === profile.id)) {
    throw new Error('INVALID_PROFILE_ID')
  }
  state.profiles.push(profile)
  persistProfileState(state, storage)
  return profile
}

export function renameLocalProfile(
  profileId: string,
  name: string,
  storage: StorageLike = browserStorage() as StorageLike,
  now = Date.now()
): LocalProfile {
  const state = getLocalProfileState(storage)
  const profile = state.profiles.find(item => item.id === profileId)
  if (!profile) throw new Error('PROFILE_NOT_FOUND')
  const normalizedName = normalizeProfileName(name)
  ensureUniqueName(normalizedName, state.profiles, profileId)
  profile.name = normalizedName
  profile.updatedAt = now
  persistProfileState(state, storage)
  return profile
}

export function switchLocalProfile(profileId: string, storage: StorageLike = browserStorage() as StorageLike) {
  const state = getLocalProfileState(storage)
  if (!state.profiles.some(profile => profile.id === profileId)) throw new Error('PROFILE_NOT_FOUND')
  state.activeProfileId = profileId
  persistProfileState(state, storage)
}

export function deleteLocalProfile(profileId: string, storage: StorageLike = browserStorage() as StorageLike): string {
  const state = getLocalProfileState(storage)
  if (state.profiles.length === 1) throw new Error('LAST_PROFILE_DELETE_FORBIDDEN')
  const index = state.profiles.findIndex(profile => profile.id === profileId)
  if (index === -1) throw new Error('PROFILE_NOT_FOUND')
  state.profiles.splice(index, 1)
  if (state.activeProfileId === profileId) state.activeProfileId = state.profiles[0].id
  persistProfileState(state, storage)
  return state.activeProfileId
}
