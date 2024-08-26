<template>
  <div class="h-screen">
    <div class="flex flex-col relative z-20 py-4 h-full">
      <NowPlayingCard @update-progress="callback" @update-now-playing="changeNowPlaying" />
      <div class="mb-12"></div>
      <NowPlayingLyrics :progress-ms="progressMs" />
    </div>
  </div>
  <div
    class="bg-cover absolute top-0 left-0 right-0 bottom-0 z-10 blur-md bg-black/30 backdrop-blur-lg"
  ></div>
  <div
    :style="{ 'background-image': `url(${nowPlaying?.item.album.images[0].url})` }"
    class="bg-cover absolute top-0 left-0 right-0 bottom-0 z-0"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NowPlayingCard from '@/components/NowPlayingCard.vue'
import NowPlayingLyrics from '@/components/NowPlayingLyrics.vue'
import type { SpotifyCurrentlyPlaying } from '@/types/Spotify'

const progressMs = ref<number | null>(null)
const nowPlaying = ref<SpotifyCurrentlyPlaying | undefined>(undefined)

function callback(ms: number) {
  progressMs.value = ms
}

function changeNowPlaying(song: SpotifyCurrentlyPlaying) {
  nowPlaying.value = song
}
</script>
