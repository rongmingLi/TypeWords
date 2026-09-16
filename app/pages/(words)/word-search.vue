<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BaseInput, BasePage } from '@/base'
import WordItem from '@/components/word/WordItem.vue'
import { useGlobalWordSearch } from '@/core/composables/useGlobalWordSearch.ts'
import { useBaseStore } from '@/core/stores/base.ts'
import { useRuntimeStore } from '@/core/stores/runtime.ts'
import { getDefaultDict, getDefaultWord } from '@/core/types/func.ts'
import type { DictResource } from '@/core/types/types.ts'
import { mergeDictResourceWithStudyState } from '@/core/utils/dict-study-state.ts'
import { findSavedDictionary, searchDictionaryKey } from '@/core/utils/global-word-search.ts'

const route = useRoute()
const router = useRouter()
const store = useBaseStore()
const runtime = useRuntimeStore()
const { catalog, query, results, loading, catalogError, failed, loadedCount, totalCount, load } = useGlobalWordSearch()
const input = ref(typeof route.query.q === 'string' ? route.query.q : '')
const page = ref(1)
const pageSize = 30
const pageCount = computed(() => Math.max(1, Math.ceil(results.value.length / pageSize)))
const visible = computed(() => results.value.slice((page.value - 1) * pageSize, page.value * pageSize))
let timer: ReturnType<typeof setTimeout>

function search() {
  clearTimeout(timer)
  query.value = input.value.trim()
  page.value = 1
  router.replace({ query: query.value ? { q: query.value } : {} })
  if (query.value) load()
}

watch(input, (_, __, onCleanup) => {
  // Clear immediately so old results are never shown for an empty input.
  if (!input.value.trim()) search()
  else timer = setTimeout(search, 250)
  onCleanup(() => clearTimeout(timer))
})
onMounted(() => { if (input.value.trim()) search() })

function openDictionary(dict: DictResource) {
  const saved = findSavedDictionary(dict, store.word.bookList, catalog.value ?? [])
  runtime.editDict = getDefaultDict(mergeDictResourceWithStudyState(dict, saved))
  router.push({ path: '/dict', query: { from: 'list' } })
}
</script>

<template>
  <BasePage>
    <div class="card global-word-search">
      <header class="flex items-center gap-4 mb-4">
        <button type="button" class="color-link shrink-0" @click="router.back()">返回</button>
        <h1 class="text-xl font-bold">全局搜词</h1>
      </header>
      <form class="flex gap-2" role="search" @submit.prevent="search">
        <BaseInput v-model="input" type="search" aria-label="搜索所有词典" placeholder="输入单词或中文释义" autofocus />
        <button type="submit" class="search-button">搜索</button>
      </form>
      <p class="text-sm color-gray mt-2">搜索全部词典及当前用户的自建词典、收藏和错词，点击来源可查看词典。</p>

      <div class="my-4 text-sm" role="status" aria-live="polite">
        <template v-if="!query">输入单词或释义，开始全局搜索。</template>
        <template v-else-if="loading">正在加载词典 {{ loadedCount }} / {{ totalCount }}，已找到 {{ results.length }} 个单词…</template>
        <template v-else>已搜索 {{ loadedCount }} 本词典，找到 {{ results.length }} 个单词。</template>
      </div>
      <div v-if="query && (catalogError || failed.length) && !loading" class="search-error mb-4" role="alert">
        <p>{{ catalogError ? '词典目录加载失败，当前结果不完整。' : `有 ${failed.length} 本词典加载失败，当前结果不完整。` }}</p>
        <p v-if="failed.length" class="text-sm mt-1">{{ failed.map(dict => dict.name).join('、') }}</p>
        <button type="button" class="color-link mt-2" @click="load">重试加载</button>
      </div>
      <p v-if="query && !loading && !results.length" class="py-8 text-center color-gray">
        {{ catalogError || failed.length ? '已加载的词典中没有匹配结果，请重试或更换关键词。' : '没有找到相关单词，试试其他拼写或中文释义。' }}
      </p>
      <ul v-if="query" class="search-results" :aria-busy="loading">
        <li v-for="result in visible" :key="result.key" class="search-result">
          <WordItem :item="getDefaultWord(result.word)" :show-option="false" />
          <div class="flex flex-wrap items-center gap-2 mt-2 text-sm">
            <span class="color-gray">来自 {{ result.sources.length }} 本词典：</span>
            <button v-for="source in result.sources" :key="searchDictionaryKey(source.dict)" type="button"
              class="source-link color-link" @click="openDictionary(source.dict)">{{ source.dict.name }}</button>
          </div>
        </li>
      </ul>
      <nav v-if="query && pageCount > 1" class="flex justify-center items-center gap-4 mt-4" aria-label="搜索结果分页">
        <button type="button" class="color-link" :disabled="page === 1" @click="page--">上一页</button>
        <span>{{ page }} / {{ pageCount }}</span>
        <button type="button" class="color-link" :disabled="page === pageCount" @click="page++">下一页</button>
      </nav>
    </div>
  </BasePage>
</template>

<style scoped lang="scss">
.global-word-search { min-height: 70vh; }
button { border: 0; background: transparent; font: inherit; cursor: pointer; }
.search-button {
  background: var(--btn-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;
  flex-shrink: 0;
}
.search-results { list-style: none; padding: 0; margin: 0; }
.search-result { padding: 1rem 0; border-bottom: 1px solid var(--color-item-border); }
.source-link { text-align: left; overflow-wrap: anywhere; text-decoration: underline; text-underline-offset: 0.2rem; }
.search-error { padding: 0.75rem; border: 1px solid var(--color-item-border); border-radius: 0.3rem; }
button:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
button:disabled { opacity: 0.4; cursor: default; }
:deep(.common-list-item) { padding: 0.5rem; cursor: default; }
:deep(.common-list-item svg) { opacity: 1; }
:deep(.item-title) { flex-wrap: wrap; }
:deep(.item-title span) { flex-shrink: 1; overflow-wrap: anywhere; }
@media (max-width: 480px) {
  .global-word-search { padding: 0.75rem; }
}
</style>
