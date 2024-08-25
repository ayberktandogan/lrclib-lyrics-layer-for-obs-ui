<template>
  <div class="relative flex flex-col justify-center overflow-hidden">
    <div
      class="relative overflow-hidden bg-black/50 backdrop-blur-md backdrop-opacity-100 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:min-w-72 sm:max-w-lg sm:rounded-lg lg:max-w-2xl lg:min-w-96"
    >
      <div class="mx-auto">
        <div v-if="isLoading"></div>
        <div v-else class="flex items-center gap-4 text-gray-100">
          <img :src="albumArt" class="h-36" alt="Tailwind Play" />
          <div class="min-w-0">
            <h1 class="text-2xl">{{ playing.item.name }}</h1>
            <h2 class="text-lg truncate">
              {{ playing.item.name }} - {{ playing.item.album.name }}
            </h2>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div></div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { SpotifyCurrentlyPlaying } from '@/types/Spotify'

const playing = ref<SpotifyCurrentlyPlaying>({} as SpotifyCurrentlyPlaying)
const isLoading = ref(true)
const albumArt = computed(() => {
  return !isLoading.value ? playing.value.item.album.images[0].url : ''
})
let intervalId: number | undefined = undefined

const fetchData = async () => {
  const response = await fetch('/api/song', {
    method: 'GET'
  })

  const body = await response.json()

  playing.value = body

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
})
</script>

<style></style>
