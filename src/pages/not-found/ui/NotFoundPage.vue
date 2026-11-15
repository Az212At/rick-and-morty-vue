<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <section class="empty-state" aria-labelledby="not-found-title">
    <p class="eyebrow">404 · Неизвестное измерение</p>
    <h2 id="not-found-title">Страница не найдена</h2>
    <p>В этом измерении пока ничего нет. Вернитесь к персонажам.</p>
    <RouterLink class="button" to="/characters">К персонажам</RouterLink>
  </section>
</template>
