<template>
  <div v-if="!isLoading && lyrics.syncedLyrics">
    <p v-for="line in lyrics.parsedLyrics" v-bind:key="line.id">
      {{ line.line }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const lyrics = ref({
  syncedLyrics: '',
  parsedLyrics: [
    {
      id: 1,
      line: '',
      timestamp: 0
    }
  ]
})
const isLoading = ref(true)

onMounted(async () => {
  const response = await fetch('/api/lyrics', {
    method: 'GET'
  })

  const body = await response.json()

  lyrics.value = body
  isLoading.value = false
})
</script>
