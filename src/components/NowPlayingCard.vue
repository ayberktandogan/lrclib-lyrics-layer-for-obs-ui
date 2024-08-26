<template>
  <div class="absolute flex flex-col overflow-hidden left-4">
    <div
      class="relative backdrop-blur-md backdrop-opacity-100 shadow-xl sm:min-w-72 sm:max-w-lg lg:max-w-2xl lg:min-w-96"
    >
      <div class="mx-auto sm:rounded-lg overflow-hidden bg-black/50 pr-4">
        <div v-if="isLoading"></div>
        <div v-else-if="isDataAvailable" class="flex items-center gap-4 text-gray-100">
          <img :src="albumArt" class="h-36" alt="Tailwind Play" />
          <div class="min-w-0">
            <h1 class="text-2xl font-bold">{{ playing.item?.name }}</h1>
            <h2 class="text-lg truncate">
              {{ playing.item?.artists?.[0]?.name }} - {{ playing.item?.album?.name }}
            </h2>
            <div>
              {{ formattedProgress }}
              <v-icon v-if="playing.is_playing" name="md-playarrow" />
              <v-icon v-else name="md-pause-sharp" />
              <div
                class="mt-4 relative progress-bar w-full bg-white/50 h-1 rounded-sm overflow-hidden"
              >
                <div
                  class="absolute h-1 left-0 top-0 z-10"
                  :style="{ width: `${progress}%`, 'background-color': dominantColor }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>No music is playing right now...</div>
      </div>
    </div>
  </div>
  <div></div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { SpotifyCurrentlyPlaying } from '@/types/Spotify'

const props = defineProps(['dominantColor'])
const emit = defineEmits(['setProgress', 'updateNowPlaying'])

const playing = ref<SpotifyCurrentlyPlaying>({} as SpotifyCurrentlyPlaying)
const isLoading = ref(true)
const startTime = ref<number | null>(null)
const animationFrameId = ref<number | null>(null)
const currentProgressMs = ref<number | null>(null)

const albumArt = computed(() => {
  return !isLoading.value ? playing.value?.item?.album?.images?.[0]?.url : ''
})
const isDataAvailable = computed(() => {
  return !isLoading.value && playing.value.device
})
const progress = computed(() => {
  return (currentProgressMs.value! * 100) / playing.value.item.duration_ms
})
const formattedProgress = computed(() => {
  if (currentProgressMs.value === null) return ''
  const totalSeconds = Math.floor(currentProgressMs.value / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':')
})
let intervalId: number | undefined = undefined

const fetchData = async () => {
  const response = await fetch('/api/song', {
    method: 'GET'
  })

  const body = (await response.json()) as SpotifyCurrentlyPlaying

  if (
    playing.value?.item?.id === body.item?.id &&
    playing.value?.is_playing === body.is_playing &&
    currentProgressMs.value! - 5000 < body.progress_ms
  ) {
    return
  }

  playing.value = body
  emit('updateNowPlaying', body)
  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value)
  }
  if (body.is_playing) {
    startProgress()
  }
  isLoading.value = false
}

onMounted(async () => {
  setInterval(fetchData, 1000)
})

onUnmounted(() => {
  // Clear the interval when the component is destroyed
  if (intervalId) {
    clearInterval(intervalId)
  }
  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value)
  }
})

function startProgress() {
  startTime.value = performance.now()
  currentProgressMs.value = playing.value.progress_ms
  updateProgress()
}
function updateProgress() {
  if (startTime.value === null) return
  const elapsed = performance.now() - startTime.value
  currentProgressMs.value = playing.value.progress_ms + elapsed
  emit('setProgress', currentProgressMs.value)
  // Request the next frame
  animationFrameId.value = requestAnimationFrame(updateProgress)
}
</script>

<style></style>
