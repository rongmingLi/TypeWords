import assert from 'node:assert/strict'
import test from 'node:test'
import { getDictPracticeKey, selectDictPracticeCache } from '../app/core/utils/dict-practice-cache.ts'

test('A -> B -> A restores A even when B was saved more recently', () => {
  const a = { val: { dictKey: 'A', practiceData: { index: 3 } }, version: 2, updated_at: '2026-09-05T01:00:00Z' }
  const b = { val: { dictKey: 'B', practiceData: { index: 1 } }, version: 2, updated_at: '2026-09-05T02:00:00Z' }
  assert.deepEqual(selectDictPracticeCache('A', a, b), a)
  assert.equal(selectDictPracticeCache('B', null, a), null)
  assert.deepEqual(selectDictPracticeCache('A', a, { ...b, val: null }), a)
})

test('a completed task tombstone prevents restoring an older task', () => {
  const old = { val: { dictKey: 'A', taskWordsStr: { new: ['cat'], review: [] } }, version: 2, updated_at: '2026-09-05T01:00:00Z' }
  const cleared = { val: null, version: 2, updated_at: '2026-09-05T02:00:00Z' }
  assert.equal(selectDictPracticeCache('A', cleared, old)?.val, null)
  const remoteClear = { ...cleared, val: { dictKey: 'A', taskWordsStr: { new: [], review: [] } } }
  assert.equal(selectDictPracticeCache('A', old, remoteClear), remoteClear)
  assert.equal(selectDictPracticeCache('B', null, remoteClear), null)
})

test('legacy cache can be claimed by the active dictionary, with stable official identity', () => {
  const legacy = { val: { taskWordsStr: { new: ['cat'], review: [] } }, version: 1 }
  assert.equal(selectDictPracticeCache('A', null, legacy), legacy)
  assert.equal(getDictPracticeKey({ id: '1', enName: 'CET4' }), getDictPracticeKey({ id: 'CET4' }))
  assert.notEqual(getDictPracticeKey({ id: 'custom-1', custom: true, enName: 'CET4' }), 'CET4')
})
