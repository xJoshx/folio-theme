<script setup lang="ts">
const { data, status } = await useFetch<{ message: string }>("/api/hello");
</script>

<template>
  <main><h1>Nuxt</h1><p v-if="status === 'pending'">Loading…</p><p v-else>{{ data?.message }}</p></main>
</template>
