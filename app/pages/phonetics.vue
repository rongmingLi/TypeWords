<script setup lang="ts">
import { BasePage, Toast } from '@/base'
import PhoneticDetailDialog from '@/components/phonetics/PhoneticDetailDialog.vue'
import {
  filterPhoneticGroups,
  flattenPhonetics,
  phoneticGroups,
  shufflePhonetics,
  type PhoneticFilter,
  type PhoneticGroup,
  type PhoneticItem,
} from '@/core/data/phonetics.ts'
import { APP_NAME } from '@/core/config/env.ts'

type Density = 'compact' | 'comfortable'

useSeoMeta({
  title: `英语音标学习｜${APP_NAME}`,
  description: '学习英式英语 48 个音标，查看发音要领、辨音提示和常见例词，并逐个播放音标发音。',
  ogTitle: `英语音标学习｜${APP_NAME}`,
  ogDescription: '从 20 个元音到 28 个辅音，系统学习英语音标。',
  twitterTitle: `英语音标学习｜${APP_NAME}`,
  twitterDescription: '从 20 个元音到 28 个辅音，系统学习英语音标。',
})

const activeFilter = ref<PhoneticFilter>('all')
const density = ref<Density>('compact')
const randomMode = ref(false)
const randomItems = ref<PhoneticItem[]>([])
const selectedItem = ref<PhoneticItem | null>(null)
const showDetail = ref(false)
const playingSymbol = ref('')
let audio: HTMLAudioElement | null = null

const filterOptions: { value: PhoneticFilter; label: string; count: number }[] = [
  { value: 'all', label: '全部', count: 48 },
  { value: 'vowel', label: '元音', count: 20 },
  { value: 'consonant', label: '辅音', count: 28 },
]

const filteredGroups = computed(() => filterPhoneticGroups(phoneticGroups, activeFilter.value))
const filteredItems = computed(() => flattenPhonetics(filteredGroups.value))
const visibleGroups = computed<PhoneticGroup[]>(() => {
  if (!randomMode.value) return filteredGroups.value
  return [{
    id: 'random',
    title: '随机练习',
    summary: `已打乱当前 ${filteredItems.value.length} 个音标，点击“随机”可重新排列`,
    kind: activeFilter.value === 'consonant' ? 'consonant' : 'vowel',
    items: randomItems.value,
  }]
})

function reshuffle() {
  randomItems.value = shufflePhonetics(filteredItems.value)
}

function selectFilter(filter: PhoneticFilter) {
  activeFilter.value = filter
  if (randomMode.value) reshuffle()
}

function toggleRandom() {
  randomMode.value = true
  reshuffle()
}

async function scrollToGroup(groupId: string) {
  randomMode.value = false
  await nextTick()
  document.getElementById(`phoneme-group-${groupId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function playPhonetic(item: PhoneticItem) {
  audio?.pause()
  audio = new Audio(item.video)
  playingSymbol.value = item.symbol
  audio.addEventListener('ended', () => {
    if (playingSymbol.value === item.symbol) playingSymbol.value = ''
  }, { once: true })
  try {
    await audio.play()
  } catch (error) {
    playingSymbol.value = ''
    console.error('音标播放失败:', error)
    Toast.warning('音标音频播放失败，请检查网络后重试')
  }
}

function openDetail(item: PhoneticItem) {
  selectedItem.value = item
  showDetail.value = true
}

onUnmounted(() => {
  audio?.pause()
  audio = null
})
</script>

<template>
  <BasePage>
    <main class="phonetics-page" :class="density" aria-labelledby="phonetics-title">
      <section class="card hero-card">
        <div class="hero-icon" aria-hidden="true">
          <IconFluentSoundWaveCircle20Regular />
        </div>
        <div class="hero-copy">
          <h1 id="phonetics-title">英语音标</h1>
          <p>从 20 个元音到 28 个辅音，点击音标即可听发音，更多讲解请进入详情。</p>
        </div>
        <div class="hero-count" aria-label="共 48 个音标">
          <strong>48</strong>
          <span>个音标</span>
        </div>
      </section>

      <section class="card toolbar-card" aria-label="音标筛选与显示方式">
        <fieldset class="control-group">
          <legend>音标类型</legend>
          <div class="segmented-control">
            <button
              v-for="option in filterOptions"
              :key="option.value"
              type="button"
              :class="{ active: activeFilter === option.value }"
              :aria-pressed="activeFilter === option.value"
              @click="selectFilter(option.value)"
            >
              {{ option.label }} <small>{{ option.count }}</small>
            </button>
          </div>
        </fieldset>

        <fieldset class="control-group">
          <legend>显示方式</legend>
          <div class="segmented-control">
            <button type="button" :class="{ active: density === 'compact' }" :aria-pressed="density === 'compact'" @click="density = 'compact'">紧凑</button>
            <button type="button" :class="{ active: density === 'comfortable' }" :aria-pressed="density === 'comfortable'" @click="density = 'comfortable'">宽松</button>
          </div>
        </fieldset>

        <fieldset class="control-group">
          <legend>练习模式</legend>
          <button type="button" class="random-button" :class="{ active: randomMode }" :aria-pressed="randomMode" @click="toggleRandom">
            <IconFluentArrowShuffle20Regular aria-hidden="true" />
            {{ randomMode ? '重新随机' : '随机' }}
          </button>
        </fieldset>
      </section>

      <nav class="group-nav" aria-label="音标分组；随机练习时点击分组可返回">
        <button v-for="group in filteredGroups" :key="group.id" type="button" @click="scrollToGroup(group.id)">
          {{ group.title }}<small>{{ group.items.length }}</small>
        </button>
      </nav>

      <div class="phonetic-sections" aria-live="polite">
        <section
          v-for="group in visibleGroups"
          :id="`phoneme-group-${group.id}`"
          :key="group.id"
          class="phoneme-section"
          :aria-labelledby="`phoneme-title-${group.id}`"
        >
          <header class="section-heading">
            <div>
              <h2 :id="`phoneme-title-${group.id}`">{{ group.title }}</h2>
              <p>{{ group.summary }}</p>
            </div>
            <span>{{ group.items.length }} 个</span>
          </header>

          <div class="phoneme-grid">
            <article v-for="phonetic in group.items" :key="phonetic.symbol" class="phoneme-card">
              <button
                type="button"
                class="phoneme-play-area"
                :class="{ playing: playingSymbol === phonetic.symbol }"
                :aria-label="`播放音标 ${phonetic.symbol}`"
                @click="playPhonetic(phonetic)"
              >
                <span class="phoneme-symbol">{{ phonetic.symbol }}</span>
                <IconBxVolumeFull aria-hidden="true" />
              </button>
              <button type="button" class="detail-control" :aria-label="`查看音标 ${phonetic.symbol} 的发音详情`" @click="openDetail(phonetic)">
                详情
              </button>
            </article>
          </div>
        </section>
      </div>
    </main>

    <PhoneticDetailDialog
      v-model="showDetail"
      :item="selectedItem"
      :playing="playingSymbol === selectedItem?.symbol"
      @play="playPhonetic"
    />
  </BasePage>
</template>

<style scoped lang="scss">
.phonetics-page {
  width: 100%;
  padding: 2.75rem 0 3rem;
  box-sizing: border-box;
  color: var(--color-main-text);
}

.card {
  margin-bottom: 0.9rem;
  box-shadow: rgb(0 0 0 / 5%) 0 4px 14px;
}

.hero-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
}

.hero-icon {
  display: grid;
  place-items: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  color: var(--color-select-bg);
  background: var(--color-third);

  svg { font-size: 1.75rem; }
}

.hero-copy {
  h1 { margin: 0; font-size: clamp(1.45rem, 3vw, 2rem); }
  p { margin: 0.4rem 0 0; line-height: 1.65; color: var(--color-sub-text); }
}

.hero-count {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  white-space: nowrap;
  color: var(--color-sub-text);

  strong { font-size: 2rem; color: var(--color-select-bg); }
}

.toolbar-card {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1.25rem 2rem;
}

.control-group {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;

  legend { margin-bottom: 0.5rem; font-size: 0.82rem; color: var(--color-sub-text); }
}

.segmented-control {
  display: flex;
  padding: 0.2rem;
  border-radius: 0.55rem;
  background: var(--color-third);

  button {
    min-height: 36px;
    padding: 0.35rem 0.75rem;
    border: 0;
    border-radius: 0.4rem;
    color: var(--color-main-text);
    background: transparent;
    cursor: pointer;

    small { margin-left: 0.2rem; color: var(--color-sub-text); }
    &.active { color: var(--color-select-bg); background: var(--color-card-bg); box-shadow: rgb(0 0 0 / 8%) 0 1px 4px; }
    &:focus-visible { outline: 2px solid var(--color-select-bg); outline-offset: 2px; }
  }
}

.random-button,
.group-nav button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: 40px;
  border: 1px solid var(--color-item-border);
  border-radius: 0.5rem;
  color: var(--color-main-text);
  background: var(--color-card-bg);
  cursor: pointer;

  &:hover,
  &:focus-visible,
  &.active { outline: none; border-color: var(--color-select-bg); color: var(--color-select-bg); }
}

.random-button { padding: 0.45rem 0.8rem; }

.group-nav {
  display: flex;
  gap: 0.5rem;
  margin: 0.2rem 0 1rem;
  overflow-x: auto;
  scrollbar-width: thin;

  button { flex: 0 0 auto; padding: 0.4rem 0.75rem; }
  small { color: var(--color-sub-text); }
}

.phoneme-section {
  scroll-margin-top: 1rem;
  margin-bottom: 1.4rem;
  padding: 1rem;
  border: 1px solid var(--color-item-border);
  border-radius: 0.75rem;
  background: var(--color-second);
}

.section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.85rem;

  h2 { margin: 0; font-size: 1.15rem; }
  p { margin: 0.25rem 0 0; color: var(--color-sub-text); font-size: 0.9rem; }
  > span { flex: 0 0 auto; font-size: 0.85rem; color: var(--color-sub-text); }
}

.phoneme-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.65rem;
}

.phoneme-card {
  overflow: hidden;
  border: 1px solid var(--color-item-border);
  border-radius: 0.65rem;
  background: var(--color-card-bg);
  transition: transform 0.2s, border-color 0.2s;

  &:hover { transform: translateY(-2px); border-color: var(--color-select-bg); }
}

.phoneme-play-area,
.detail-control {
  width: 100%;
  border: 0;
  color: var(--color-main-text);
  background: transparent;
  cursor: pointer;

  &:focus-visible { outline: 2px solid var(--color-select-bg); outline-offset: -2px; }
}

.phoneme-play-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-height: 4.5rem;

  svg { opacity: 0; color: var(--color-select-bg); transition: opacity 0.2s; }
  &:hover svg,
  &:focus-visible svg,
  &.playing svg { opacity: 1; }
}

.phoneme-symbol {
  font-family: var(--word-font-family);
  font-size: 1.55rem;
  color: var(--color-main-text);
}

.detail-control {
  min-height: 36px;
  border-top: 1px solid var(--color-item-border);
  color: var(--color-sub-text);

  &:hover { color: var(--color-select-bg); background: var(--color-third); }
}

.comfortable {
  .phoneme-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.9rem; }
  .phoneme-play-area { min-height: 6.5rem; }
  .phoneme-symbol { font-size: 1.9rem; }
}

@media (max-width: 1024px) {
  .phoneme-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .comfortable .phoneme-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 768px) {
  .phonetics-page { padding: 1.5rem 0 2rem; }
  .hero-card { grid-template-columns: auto 1fr; }
  .hero-count { grid-column: 2; }
  .toolbar-card { gap: 1rem; }
  .phoneme-grid,
  .comfortable .phoneme-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 480px) {
  .hero-card { grid-template-columns: 1fr auto; }
  .hero-icon { display: none; }
  .hero-count { grid-column: 2; grid-row: 1 / span 2; }
  .toolbar-card { display: grid; grid-template-columns: 1fr; }
  .segmented-control { width: 100%; }
  .segmented-control button { flex: 1; }
  .phoneme-grid,
  .comfortable .phoneme-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .section-heading p { font-size: 0.82rem; }
}

@media (prefers-reduced-motion: reduce) {
  .phoneme-card { transition: none; }
  .group-nav { scroll-behavior: auto; }
}
</style>
