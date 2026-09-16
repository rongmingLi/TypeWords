import assert from 'node:assert/strict'
import test from 'node:test'
import { buildWordSearchIndex, findReplacementDictionary, findSavedDictionary, searchWordIndex, loadSearchDictionaries } from '../app/core/utils/global-word-search.ts'

const word = (text: string, cn = '') => ({ word: text, trans: [{ pos: 'n.', cn }] }) as any
const dict = (id: string, words: any[], language = 'en') => ({ id, name: id, language, words }) as any

test('searches all dictionaries, merges duplicate words and retains every source', () => {
  const index = buildWordSearchIndex([
    dict('first', [word('Apple', '苹果'), word('apple', '苹果')]),
    dict('second', [word('apple', '苹果公司'), word('pear', '梨')]),
  ])
  const results = searchWordIndex(index, ' APPLE ')
  assert.equal(results.length, 1)
  assert.deepEqual(results[0].sources.map(s => s.dict.id), ['first', 'second'])
  assert.equal(searchWordIndex(index, '梨')[0].word.word, 'pear')
  assert.equal(searchWordIndex(index, '公司')[0].word.trans[0].cn, '苹果公司')
})

test('ranks exact words before prefixes, substrings and translations; ignores empty queries', () => {
  const index = buildWordSearchIndex([dict('one', [
    word('pineapple'), word('fruit', 'apple'), word('apples'), word('apple'),
  ])])
  assert.deepEqual(searchWordIndex(index, 'apple').map(r => r.word.word), ['apple', 'apples', 'pineapple', 'fruit'])
  assert.deepEqual(searchWordIndex(index, '  '), [])
  assert.deepEqual(searchWordIndex(index, 'no-such-word'), [])
})

test('keeps different languages separate and includes local-only words without changing them', () => {
  const dictionaries = [dict('english', [word('gift')]), dict('german', [word('Gift')], 'de'), dict('custom', [word('my phrase')])]
  const before = JSON.stringify(dictionaries)
  const index = buildWordSearchIndex(dictionaries)
  assert.equal(searchWordIndex(index, 'gift').length, 2)
  assert.equal(searchWordIndex(index, 'my phrase')[0].sources[0].dict.id, 'custom')
  assert.equal(JSON.stringify(dictionaries), before)
})

test('loads with bounded concurrency, preserves successes after failure and retries only missing dictionaries', async () => {
  const dictionaries = ['a', 'b', 'c', 'd', 'e'].map(id => dict(id, []))
  const cache = new Map()
  let active = 0
  let maxActive = 0
  const failed = await loadSearchDictionaries(dictionaries, cache, async d => {
    active++
    maxActive = Math.max(maxActive, active)
    await new Promise(resolve => setTimeout(resolve, 5))
    active--
    if (d.id === 'b') throw new Error('unavailable')
    return [word(d.id as string)]
  })
  assert.deepEqual(failed.map(d => d.id), ['b'])
  assert.equal(cache.size, 4)
  assert.ok(maxActive <= 3)
  const retried: unknown[] = []
  const failures = await loadSearchDictionaries(dictionaries, cache, async d => {
    retried.push(d.id)
    return [word('recovered')]
  })
  assert.deepEqual(retried, ['b'])
  assert.deepEqual(failures, [])
  assert.equal(cache.size, 5)
})

test('maps the removed Grade 7 dictionary to the new catalog entry and keeps saved progress', () => {
  const legacy = dict('4', [word('old')])
  legacy.enName = 'pep_grade7_1'
  legacy.url = 'PEP_Grade7_1.json'
  const current = dict('7', [word('new')])
  current.enName = 'pep_grade7_a_new'
  current.url = 'PEP_Grade7_A_New.json'
  assert.equal(findReplacementDictionary(legacy, [current])?.url, current.url)
  assert.equal(findSavedDictionary(current, [legacy], [current]), legacy)
})
