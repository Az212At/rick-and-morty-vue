<script setup lang="ts">
import { useId } from "vue";
import type { Character } from "@/entities/character/model/types";
import MainModal from "@/shared/ui/MainModal.vue";
import planetIcon from "@/shared/assets/icons/icon-planet.svg";
import mapPinIcon from "@/shared/assets/icons/map-pin-1.svg";

defineProps<{ character: Character | null }>();
const emit = defineEmits<{ close: [] }>();
const titleId = useId();
</script>

<template>
  <MainModal
    :is-open="character !== null"
    :labelled-by="titleId"
    @close="emit('close')"
  >
    <div v-if="character" class="character-modal">
      <button
        type="button"
        class="character-modal__close"
        aria-label="Закрыть информацию о персонаже"
        @click="emit('close')"
      >
        ×
      </button>
      <div class="character-modal__content">
        <img
          :src="character.image"
          :alt="character.name"
          class="character-modal__image"
          width="300"
          height="300"
        />
        <div class="character-modal__body">
          <p class="character-modal__eyebrow">Персонаж #{{ character.id }}</p>
          <h2 :id="titleId" class="character-modal__name">
            {{ character.name }}
          </h2>
          <p class="character-modal__episodes">
            Появлений в эпизодах: {{ character.episode.length }}
          </p>
          <dl class="character-modal__badges">
            <div>
              <dt>Статус</dt>
              <dd>
                <span
                  :class="`character-card__dot character-card__dot--${character.status.toLowerCase()}`"
                  aria-hidden="true"
                />{{ character.status }}
              </dd>
            </div>
            <div>
              <dt>Вид</dt>
              <dd>{{ character.species }}</dd>
            </div>
            <div>
              <dt>Пол</dt>
              <dd>{{ character.gender }}</dd>
            </div>
            <div v-if="character.type">
              <dt>Тип</dt>
              <dd>{{ character.type }}</dd>
            </div>
          </dl>
          <div class="character-modal__cards">
            <div class="character-modal__card">
              <img :src="planetIcon" alt="" width="24" height="24" />
              <h3 class="character-modal__card-label">Происхождение</h3>
              <p class="character-modal__card-value">
                {{ character.origin.name }}
              </p>
            </div>
            <div class="character-modal__card">
              <img :src="mapPinIcon" alt="" width="24" height="24" />
              <h3 class="character-modal__card-label">Местоположение</h3>
              <p class="character-modal__card-value">
                {{ character.location.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainModal>
</template>
