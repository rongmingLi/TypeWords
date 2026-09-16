<script setup lang="ts">
import { Dialog } from '@/base'
import type { PhoneticItem } from '@/core/data/phonetics.ts'

const props = defineProps<{
  modelValue: boolean
  item: PhoneticItem | null
  playing: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'play', item: PhoneticItem): void
}>()

const dialogTitle = computed(() => (props.item ? `${props.item.symbol} 发音讲解` : '发音讲解'))
</script>

<template>
  <Dialog
    :modelValue="modelValue"
    :title="dialogTitle"
    :padding="true"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <div v-if="item" class="phonetic-detail">
      <div class="detail-hero">
        <strong class="detail-symbol">{{ item.symbol }}</strong>
        <button
          type="button"
          class="replay-button"
          :aria-label="`播放音标 ${item.symbol}`"
          :aria-pressed="playing"
          @click="emit('play', item)"
        >
          <IconBxVolumeFull aria-hidden="true" />
          <span>{{ playing ? '播放中' : '点击播放' }}</span>
        </button>
      </div>

      <section class="detail-section video-section" aria-labelledby="phonetic-video-title">
        <h3 id="phonetic-video-title">发音演示</h3>
        <video
          :key="item.video"
          class="phonetic-video"
          :src="item.video"
          :aria-label="`${item.symbol} 发音演示视频`"
          controls
          playsinline
          preload="metadata"
        ></video>
      </section>

      <section class="detail-section" aria-labelledby="phonetic-tips-title">
        <h3 id="phonetic-tips-title">发音要领</h3>
        <ul>
          <li v-for="tip in item.tips" :key="tip">{{ tip }}</li>
        </ul>
      </section>

      <aside class="confusion-note" aria-labelledby="phonetic-confusion-title">
        <IconFluentLightbulb20Regular aria-hidden="true" />
        <div>
          <strong id="phonetic-confusion-title">辨音提示</strong>
          <p>{{ item.confusion }}</p>
        </div>
      </aside>

      <section class="detail-section" aria-labelledby="phonetic-examples-title">
        <h3 id="phonetic-examples-title">常见例词</h3>
        <ul class="example-list">
          <li v-for="example in item.examples" :key="example.word" class="example-item">
            <span><strong>{{ example.word }}</strong> <small>{{ example.phonetic }}</small></span>
            <span>{{ example.meaning }}</span>
          </li>
        </ul>
      </section>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
.phonetic-detail {
  width: min(36rem, calc(100vw - 2rem));
  max-height: 78vh;
  overflow-y: auto;
  padding: 1rem 0 1.25rem;
}

.detail-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: var(--color-third);
}

.detail-symbol {
  font-family: var(--word-font-family);
  font-size: clamp(2rem, 8vw, 3.5rem);
  line-height: 1;
  color: var(--color-main-text);
}

.replay-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0.5rem 0.85rem;
  border: 1px solid var(--color-item-border);
  border-radius: 0.5rem;
  color: var(--color-main-text);
  background: var(--color-card-bg);
  cursor: pointer;

  &:hover,
  &:focus-visible,
  &[aria-pressed='true'] {
    outline: none;
    border-color: var(--color-select-bg);
    color: var(--color-select-bg);
  }
}

.detail-section {
  margin-top: 1.25rem;

  h3 {
    margin: 0 0 0.6rem;
    font-size: 1rem;
    color: var(--color-main-text);
  }

  ul {
    margin: 0;
    padding-left: 1.25rem;
    line-height: 1.75;
  }
}

.phonetic-video {
  display: block;
  width: 100%;
  max-height: 17rem;
  border-radius: 0.75rem;
  background: #000;
}

.confusion-note {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding: 0.85rem 1rem;
  border-left: 3px solid var(--color-select-bg);
  border-radius: 0.5rem;
  background: var(--color-fifth);

  svg {
    flex: 0 0 auto;
    margin-top: 0.15rem;
  }

  p {
    margin: 0.3rem 0 0;
    line-height: 1.6;
  }
}

.example-list {
  display: grid;
  gap: 0.5rem;
  padding: 0 !important;
  list-style: none;
}

.example-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 0.85rem;
  border: 1px solid var(--color-item-border);
  border-radius: 0.5rem;

  small {
    margin-left: 0.35rem;
    color: var(--color-sub-text);
  }
}

@media (max-width: 480px) {
  .phonetic-detail {
    width: calc(100vw - 1.5rem);
  }

  .detail-hero,
  .example-item {
    align-items: flex-start;
  }

  .detail-hero {
    flex-direction: column;
  }
}
</style>
