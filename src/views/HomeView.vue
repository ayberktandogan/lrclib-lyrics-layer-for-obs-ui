<template>
  <div class="h-screen">
    <div class="flex flex-col relative z-20 py-4 h-full">
      <NowPlayingCard
        @set-progress="callback"
        @update-now-playing="changeNowPlaying"
        :dominant-color="dominantColor"
      />
      <div class="mb-12"></div>
      <NowPlayingLyrics :progress-ms="progressMs" :dominant-color="dominantColor" />
    </div>
  </div>
  <div
    class="bg-cover absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm"
    :style="{ 'background-color': dominantColor }"
  ></div>
  <div
    :style="{ 'background-image': `url(${nowPlaying?.item?.album?.images?.[0]?.url})` }"
    class="bg-cover bg-center absolute top-0 left-0 right-0 bottom-0 z-0"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NowPlayingCard from '@/components/NowPlayingCard.vue'
import NowPlayingLyrics from '@/components/NowPlayingLyrics.vue'
import type { SpotifyCurrentlyPlaying } from '@/types/Spotify'
import { getDominantColor } from '@/plugins/Colors'

const progressMs = ref<number | null>(null)
const nowPlaying = ref<SpotifyCurrentlyPlaying | undefined>(undefined)
const dominantColor = ref<string | undefined>(undefined)

function getColor() {
  if (!nowPlaying.value?.item?.album?.images?.[0]?.url) return

  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.src = nowPlaying.value?.item?.album?.images?.[0]?.url
  image.onload = () => {
    dominantColor.value = getDominantColor(image, 0.8)
  }
}

function callback(ms: number) {
  progressMs.value = ms
}

function changeNowPlaying(song: SpotifyCurrentlyPlaying) {
  nowPlaying.value = song
  getColor()
}
</script>
