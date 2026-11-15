<script setup lang="ts">
import type { Character } from "../model/types";
import humanIcon from "@/shared/assets/icons/icon-human.svg";
import planetIcon from "@/shared/assets/icons/icon-planet.svg";
import infoIcon from "@/shared/assets/icons/icon-info.svg";

defineProps<{ character: Character }>();
const emit = defineEmits<{ details: [character: Character] }>();
</script>

<template>
  <article class="character-card">
    <img
      :src="character.image"
      :alt="character.name"
      class="character-card__image"
      width="300"
      height="300"
      loading="lazy"
      decoding="async"
    />
    <div class="character-card__body">
      <h3 class="character-card__name">{{ character.name }}</h3>
      <p class="character-card__row">
        <span
          :class="`character-card__dot character-card__dot--${character.status.toLowerCase()}`"
          aria-hidden="true"
        />
        <span><span class="sr-only">Статус: </span>{{ character.status }}</span>
      </p>
      <p class="character-card__row">
        <img :src="humanIcon" alt="" width="16" height="16" />
        <span><span class="sr-only">Вид: </span>{{ character.species }}</span>
      </p>
      <p class="character-card__row">
        <img :src="planetIcon" alt="" width="16" height="16" />
        <span
          ><span class="sr-only">Происхождение: </span
          >{{ character.origin.name }}</span
        >
      </p>
      <button
        type="button"
        class="character-card__more-btn"
        :aria-label="`Узнать больше: ${character.name}`"
        @click="emit('details', character)"
      >
        <img :src="infoIcon" alt="" width="16" height="16" />
        Узнать больше
      </button>
    </div>
  </article>
</template>
