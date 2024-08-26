<template>
  <div v-if="!isLoading && lyrics.syncedLyrics" class="flex flex-1 items-center justify-center p-4">
    <p
      v-for="line in lyrics.parsedLyrics"
      v-bind:key="line.id"
      :class="[
        isActiveLine(line.timestamp) ? 'font-bold' : 'hidden',
        'text-center text-6xl select-none w-full'
      ]"
      :style="{ color: getContrastColor(dominantColor) }"
    >
      {{ line.line || '...' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { getContrastColor } from '@/plugins/Colors'
import type { LrcLyrics } from '@/types/LrcLib'
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps(['progressMs', 'dominantColor'])

const lyrics = ref<LrcLyrics>({} as LrcLyrics)
const isLoading = ref(true)

let intervalId: number | undefined

function isActiveLine(timestamp: number) {
  return props.progressMs >= timestamp && props.progressMs < getNextTimestamp(timestamp)
}
function getNextTimestamp(currentTimestamp: number) {
  const currentIndex = lyrics.value.parsedLyrics!.findIndex(
    (line) => line.timestamp === currentTimestamp
  )
  return currentIndex < lyrics.value.parsedLyrics!.length - 1
    ? lyrics.value.parsedLyrics![currentIndex + 1].timestamp
    : Infinity
}

onMounted(async () => {
  const fetchData = async () => {
    const response = await fetch('/api/lyrics', {
      method: 'GET'
    })

    const body = (await response.json()) as LrcLyrics
    if (lyrics.value?.id === body?.id) {
      return
    }

    lyrics.value = body
    isLoading.value = false
  }

  intervalId = setInterval(fetchData, 1000)
})

onUnmounted(async () => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>
