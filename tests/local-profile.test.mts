import assert from 'node:assert/strict'
import test from 'node:test'
import {
  DEFAULT_LOCAL_PROFILE_ID,
  createLocalProfile,
  deleteLocalProfile,
  getActiveLocalProfileId,
  getLocalProfileState,
  getProfileStorageKey,
  renameLocalProfile,
  switchLocalProfile,
} from '../app/core/utils/local-profile.ts'

class MemoryStorage implements Storage {
  private values = new Map<string, string>()

  get length() {
    return this.values.size
  }

  clear() {
    this.values.clear()
  }

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null
  }

  removeItem(key: string) {
    this.values.delete(key)
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }
}

test('creates a default profile without moving legacy data keys', () => {
  const storage = new MemoryStorage()

  const state = getLocalProfileState(storage)

  assert.equal(state.activeProfileId, DEFAULT_LOCAL_PROFILE_ID)
  assert.equal(state.profiles.length, 1)
  assert.equal(state.profiles[0].name, '默认用户')
  assert.equal(getProfileStorageKey('typing-word-dict', DEFAULT_LOCAL_PROFILE_ID), 'typing-word-dict')
})

test('creates and switches to a profile with isolated storage keys', () => {
  const storage = new MemoryStorage()

  const profile = createLocalProfile('　 Alice  Zhang 　', storage, {
    id: 'alice',
    now: 100,
  })
  switchLocalProfile(profile.id, storage)

  assert.equal(profile.name, 'Alice Zhang')
  assert.equal(getLocalProfileState(storage).activeProfileId, 'alice')
  assert.equal(getProfileStorageKey('typing-word-dict', 'alice'), 'typewords:profile:alice:typing-word-dict')
})

test('rejects blank, duplicate, and overlong profile names', () => {
  const storage = new MemoryStorage()
  createLocalProfile('Alice', storage, { id: 'alice', now: 100 })

  assert.throws(() => createLocalProfile('  ', storage), /PROFILE_NAME_REQUIRED/)
  assert.throws(() => createLocalProfile('alice', storage), /PROFILE_NAME_EXISTS/)
  assert.throws(() => createLocalProfile('a'.repeat(33), storage), /PROFILE_NAME_TOO_LONG/)
})

test('renames a profile while keeping its id and storage namespace', () => {
  const storage = new MemoryStorage()
  const profile = createLocalProfile('Alice', storage, { id: 'alice', now: 100 })

  const renamed = renameLocalProfile(profile.id, 'Alicia', storage, 200)

  assert.equal(renamed.id, 'alice')
  assert.equal(renamed.name, 'Alicia')
  assert.equal(renamed.updatedAt, 200)
  assert.equal(getProfileStorageKey('PracticeSaveWord', renamed.id), 'typewords:profile:alice:PracticeSaveWord')
})

test('deletes a profile, selects a fallback, and protects the last profile', () => {
  const storage = new MemoryStorage()
  const second = createLocalProfile('Alice', storage, { id: 'alice', now: 100 })
  switchLocalProfile(second.id, storage)

  const nextActiveId = deleteLocalProfile(second.id, storage)

  assert.equal(nextActiveId, DEFAULT_LOCAL_PROFILE_ID)
  assert.equal(getLocalProfileState(storage).activeProfileId, DEFAULT_LOCAL_PROFILE_ID)
  assert.throws(() => deleteLocalProfile(DEFAULT_LOCAL_PROFILE_ID, storage), /LAST_PROFILE_DELETE_FORBIDDEN/)
})

test('keeps the app on the legacy profile when browser storage cannot be written', () => {
  const blockedStorage = {
    getItem: () => null,
    removeItem: () => undefined,
    setItem: () => {
      throw new Error('storage blocked')
    },
  } as Storage

  assert.equal(getLocalProfileState(blockedStorage).activeProfileId, DEFAULT_LOCAL_PROFILE_ID)
  assert.equal(getActiveLocalProfileId(blockedStorage), DEFAULT_LOCAL_PROFILE_ID)
})
