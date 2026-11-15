<script setup lang="ts">
defineProps<{ isLoading: boolean; error: string | null; isEmpty: boolean }>();
const emit = defineEmits<{ retry: []; reset: [] }>();
</script>

<template>
  <div v-if="isLoading" class="query-state" role="status">
    <span class="spinner" aria-hidden="true" />
    Загружаем данные…
  </div>
  <div v-else-if="error" class="query-state" role="alert">
    <h3>Не получилось открыть портал</h3>
    <p>{{ error }}</p>
    <button class="button" type="button" @click="emit('retry')">
      Попробовать снова
    </button>
  </div>
  <div v-else-if="isEmpty" class="query-state" role="status">
    <h3>Ничего не найдено</h3>
    <p>Попробуйте другое имя или сбросьте фильтры.</p>
    <button
      class="button button--secondary"
      type="button"
      @click="emit('reset')"
    >
      Сбросить фильтры
    </button>
  </div>
</template>
