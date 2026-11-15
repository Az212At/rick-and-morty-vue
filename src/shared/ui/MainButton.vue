<script setup lang="ts">
withDefaults(
  defineProps<{ type?: "button" | "submit" | "reset"; disabled?: boolean }>(),
  {
    type: "button",
    disabled: false,
  }
);
</script>

<template>
  <button class="main-button" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>
