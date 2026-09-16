import assert from 'node:assert/strict'
import test from 'node:test'
import {
  filterPhoneticGroups,
  flattenPhonetics,
  phoneticGroups,
  shufflePhonetics,
} from '../app/core/data/phonetics.ts'

test('defines the complete 48-symbol phonetic catalog with three examples per symbol', () => {
  assert.deepEqual(phoneticGroups.map(group => group.items.length), [12, 8, 6, 10, 6, 6])

  const items = flattenPhonetics(phoneticGroups)
  assert.equal(items.length, 48)
  assert.equal(new Set(items.map(item => item.symbol)).size, 48)
  assert.equal(new Set(items.map(item => item.video)).size, 48)
  assert.equal(items.flatMap(item => item.examples).length, 144)
  assert.ok(items.every(item => item.tips.length >= 2))
  assert.ok(items.every(item => item.confusion.length > 0))
  assert.ok(items.every(item => item.video.startsWith('/video/phonetics/')))
})

test('filters complete groups into the expected 20 vowels and 28 consonants', () => {
  assert.equal(flattenPhonetics(filterPhoneticGroups(phoneticGroups, 'all')).length, 48)
  assert.equal(flattenPhonetics(filterPhoneticGroups(phoneticGroups, 'vowel')).length, 20)
  assert.equal(flattenPhonetics(filterPhoneticGroups(phoneticGroups, 'consonant')).length, 28)
})

test('shuffles without mutating the source list', () => {
  const source = flattenPhonetics(phoneticGroups).slice(0, 4)
  const symbols = source.map(item => item.symbol)
  const shuffled = shufflePhonetics(source, () => 0)

  assert.deepEqual(source.map(item => item.symbol), symbols)
  assert.deepEqual(shuffled.map(item => item.symbol), [symbols[1], symbols[2], symbols[3], symbols[0]])
})
