<script setup lang="ts">
defineProps<{ name: string }>()
defineEmits<{ openDictionary: [] }>()
</script>

<template>
  <div>
    <div class="flex justify-end mb-3">
      <NuxtLink to="/word-search" class="color-link">全局搜词</NuxtLink>
    </div>
    <div class="flex gap-3">
      <div class="p-1 center rounded-full bg-white">
        <IconFluentBookNumber20Filled class="text-xl color-link" />
      </div>
      <button type="button" class="text-2xl font-bold cursor-pointer text-left" @click="$emit('openDictionary')">
        {{ name || $t('no_dict_selected') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
button { border: 0; background: transparent; color: inherit; padding: 0; }
button:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
</style>
