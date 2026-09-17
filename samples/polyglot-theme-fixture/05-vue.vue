<script setup lang="ts">
import { computed, ref } from "vue";

const firstName = ref("Grace");
const greeting = computed(() => `Hello, ${firstName.value}!`);
</script>

<template>
  <label>{{ greeting }} <input v-model="firstName" /></label>
</template>
