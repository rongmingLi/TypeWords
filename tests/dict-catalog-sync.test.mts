import assert from 'node:assert/strict'
import test from 'node:test'
import { removeUnavailableOfficialDictionaries } from '../app/core/utils/dict-study-state.ts'

test('removes a deleted official dictionary when its numeric id is reused', () => {
  const saved = [
    { id: 'collect', enName: 'collect', system: true },
    { id: 'wrong', enName: 'wrong', system: true },
    { id: 'known', enName: 'known', system: true },
    { id: 7, enName: 'pep_grade7_1', name: '旧七年级上册' },
    { id: 1, enName: 'cet4', name: 'CET-4' },
    { id: 'custom-1', enName: '', custom: true },
  ] as any[]
  const catalog = [
    { id: 7, enName: 'pep_grade7_a_new', name: '新版七年级上册' },
    { id: 1, enName: 'cet4', name: 'CET-4' },
  ] as any[]

  const studyIndex = removeUnavailableOfficialDictionaries(saved, catalog, 3)

  assert.deepEqual(saved.map(item => item.enName), ['collect', 'wrong', 'known', 'cet4', ''])
  assert.equal(studyIndex, -1)
})
