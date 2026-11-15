<script setup lang="ts">
defineProps<{ page: number; pages: number }>();
const emit = defineEmits<{ pageChange: [page: number] }>();
</script>

<template>
  <nav v-if="pages > 1" class="pagination" aria-label="Пагинация">
    <button
      class="button button--secondary"
      type="button"
      aria-label="Предыдущая страница"
      :disabled="page <= 1"
      @click="emit('pageChange', page - 1)"
    >
      <span aria-hidden="true">←</span> Назад
    </button>
    <span class="pagination__info" aria-live="polite"
      >Страница {{ page }} из {{ pages }}</span
    >
    <button
      class="button button--secondary"
      type="button"
      aria-label="Следующая страница"
      :disabled="page >= pages"
      @click="emit('pageChange', page + 1)"
    >
      Далее <span aria-hidden="true">→</span>
    </button>
  </nav>
</template>
