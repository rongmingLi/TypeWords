import assert from 'node:assert/strict'
import test from 'node:test'
import { mergeDictResourceWithStudyState } from '../app/core/utils/dict-study-state.ts'

test('keeps saved progress when reopening an official dictionary from the catalog', () => {
  const resource = {
    id: 'cet4',
    name: '最新四级词典',
    description: 'new metadata',
    url: 'CET4.json',
    length: 2607,
    category: '考试',
    tags: ['四级'],
    translateLanguage: 'zh-CN',
    language: 'en',
  }
  const saved = {
    ...resource,
    name: '旧名称',
    lastLearnIndex: 321,
    perDayStudyNumber: 35,
    complete: false,
    statistics: [{ startDate: '2026-09-05', spend: 1200 }],
    words: [{ word: 'abandon' }],
    articles: [],
    custom: false,
  }

  const result = mergeDictResourceWithStudyState(resource as any, saved as any)

  assert.equal(result.name, '最新四级词典')
  assert.equal(result.lastLearnIndex, 321)
  assert.equal(result.perDayStudyNumber, 35)
  assert.equal(result.statistics.length, 1)
  assert.equal(result.words[0].word, 'abandon')
})

test('uses fresh defaults when a dictionary has no saved study state', () => {
  const resource = {
    id: 'new-dict',
    name: '新词典',
    description: '',
    url: 'new.json',
    length: 100,
    category: '测试',
    tags: [],
    translateLanguage: 'zh-CN',
    language: 'en',
  }

  const result = mergeDictResourceWithStudyState(resource as any)

  assert.equal(result.lastLearnIndex, 0)
  assert.equal(result.complete, false)
  assert.deepEqual(result.statistics, [])
})
