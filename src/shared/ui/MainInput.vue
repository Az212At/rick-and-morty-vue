<script setup lang="ts">
import type { InputHTMLAttributes } from "vue";

withDefaults(defineProps<{ type?: InputHTMLAttributes["type"] }>(), {
  type: "text",
});
const model = defineModel<string>({ default: "" });
</script>

<template>
  <input v-model="model" class="main-input" :type="type" />
</template>
