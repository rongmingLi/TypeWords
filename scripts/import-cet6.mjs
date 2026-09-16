import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Download source: https://raw.githubusercontent.com/kajweb/dict/master/book/1521164633851_CET6_3.zip
const archive = process.argv[2]
assert.ok(archive, 'Usage: node scripts/import-cet6.mjs <CET6_3.zip>')
const root = resolve(import.meta.dirname, '..')
const raw = execFileSync('unzip', ['-p', archive, 'CET6_3.json'], { maxBuffer: 16 * 1024 * 1024 }).toString('utf8')
const records = raw.split(/\r?\n/).filter(line => line.trim()).map(line => JSON.parse(line))
const text = value => typeof value === 'string' ? value.trim() : ''
const pos = value => text(value).replace(/\.$/, '') + (text(value) ? '.' : '')
const words = records.map(record => {
  assert.equal(record.bookId, 'CET6_3')
  const source = record.content.word.content
  return {
    id: record.content.word.wordId,
    word: text(record.headWord),
    phonetic0: text(source.ukphone),
    phonetic1: text(source.usphone),
    trans: (source.trans ?? []).map(t => ({ pos: pos(t.pos), cn: text(t.tranCn) })),
    sentences: (source.sentence?.sentences ?? []).map(s => ({ c: text(s.sContent), cn: text(s.sCn) })),
    phrases: (source.phrase?.phrases ?? []).map(p => ({ c: text(p.pContent), cn: text(p.pCn) })),
    synos: (source.syno?.synos ?? []).map(s => ({ pos: pos(s.pos), cn: text(s.tran), ws: s.hwds.map(w => text(w.w)) })),
    relWords: {
      root: text(source.relWord?.root),
      rels: (source.relWord?.rels ?? []).map(r => ({ pos: pos(r.pos), words: r.words.map(w => ({ c: text(w.hwd), cn: text(w.tran) })) })),
    },
    etymology: source.remMethod?.val ? [{ t: '词汇助记（原词书）', d: text(source.remMethod.val) }] : [],
  }
})
assert.equal(words.length, 2345)
assert.equal(new Set(words.map(w => w.id)).size, words.length)
assert.equal(new Set(words.map(w => w.word.toLowerCase())).size, words.length)
for (const word of words) {
  assert.ok(word.word && word.trans.length && word.trans.every(t => t.cn), `Missing word/definition: ${word.id}`)
  for (const s of [...word.sentences, ...word.phrases]) assert.ok(s.c, `Missing English text: ${word.word}`)
}
const lists = ['word', 'recommend_word'].map(name => ({
  path: resolve(root, `public/list/${name}.json`),
  data: JSON.parse(readFileSync(resolve(root, `public/list/${name}.json`), 'utf8')),
}))
for (const { data } of lists) assert.ok(!data.some(d => String(d.id) === '19' && d.enName !== 'cet6'), 'Dictionary id 19 is occupied')
const metadata = {
  ...lists[0].data.find(d => d.enName === 'cet4'),
  id: 19,
  enName: 'cet6',
  name: 'CET-6（新东方六级词汇）',
  description: '新东方六级词汇，共2345词。来源：kajweb/dict 的 CET6_3 数据包，保留原词书释义、英美音标、例句、短语和助记。文本可离线使用，发音需要联网。',
  url: 'CET6_3.json',
  length: words.length,
  cover: null,
  tags: ['大学英语', '六级', '新东方'],
  createdAt: '2026-09-14 00:00:00.000000',
  updatedAt: '2026-09-14 00:00:00.000000',
}
writeFileSync(resolve(root, 'public/dicts/en/word/CET6_3.json'), JSON.stringify(words) + '\n')
for (const { path, data } of lists) {
  const existing = data.findIndex(d => d.enName === 'cet6')
  if (existing >= 0) data[existing] = metadata
  else data.splice(data.findIndex(d => d.enName === 'cet4') + 1, 0, metadata)
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
}
console.log(JSON.stringify({
  count: words.length,
  untranslatedSentences: words.flatMap(w => w.sentences.filter(s => !s.cn).map(s => ({ word: w.word, sentence: s.c }))),
  sha256: createHash('sha256').update(readFileSync(archive)).digest('hex'),
  coverage: Object.fromEntries(['phonetic0', 'phonetic1', 'sentences', 'phrases', 'synos', 'etymology'].map(key => [key, words.filter(w => w[key].length).length])),
}, null, 2))
