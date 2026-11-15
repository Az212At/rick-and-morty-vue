<script setup lang="ts">
import type { Episode } from "../model/types";

defineProps<{ episode: Episode }>();
</script>

<template>
  <article class="episode-card">
    <p class="episode-card__code">
      <span class="sr-only">Сезон и эпизод: </span>{{ episode.episode }}
    </p>
    <h3 class="episode-card__name">{{ episode.name }}</h3>
    <p class="episode-card__date">
      <span class="sr-only">Дата выхода: </span>{{ episode.air_date }}
    </p>
    <p class="episode-card__characters">
      Персонажей: {{ episode.characters.length }}
    </p>
  </article>
</template>
