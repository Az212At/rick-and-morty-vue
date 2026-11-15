<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  CharacterCard,
  characterListPath,
  type Character,
} from "@/entities/character";
import { CharacterDetailModal } from "@/features/character-details";
import type { PaginatedResponse } from "@/shared/api/types";
import { useResource } from "@/shared/lib/useResource";
import { readPage } from "@/shared/lib/pagination";
import { readQueryString } from "@/shared/lib/routeQuery";
import MainPagination from "@/shared/ui/MainPagination.vue";
import QueryState from "@/shared/ui/QueryState.vue";

const route = useRoute();
const router = useRouter();
const page = computed(() => readPage(readQueryString(route.query.page)));
const name = computed(() => readQueryString(route.query.name));
const status = computed(() => {
  const value = readQueryString(route.query.status);
  return ["alive", "dead", "unknown"].includes(value) ? value : "";
});
const draftName = ref(name.value);
const draftStatus = ref(status.value);
const selectedCharacter = shallowRef<Character | null>(null);
const { data, isLoading, error, retry } = useResource<
  PaginatedResponse<Character>
>(() =>
  characterListPath({
    page: page.value,
    name: name.value,
    status: status.value,
  })
);
const characters = computed(() => data.value?.results ?? []);
const hasFilters = computed(() =>
  Boolean(name.value || status.value || page.value > 1)
);

// URL navigation also resets drafts and closes details from the previous query.
watch(
  () => route.fullPath,
  () => {
    draftName.value = name.value;
    draftStatus.value = status.value;
    selectedCharacter.value = null;
  },
  { flush: "sync" }
);

function search() {
  draftName.value = draftName.value.trim();
  void router.push({
    query: {
      ...(draftName.value ? { name: draftName.value } : {}),
      ...(draftStatus.value ? { status: draftStatus.value } : {}),
    },
  });
}

function reset() {
  draftName.value = "";
  draftStatus.value = "";
  selectedCharacter.value = null;
  void router.push({ query: {} });
}

function changePage(nextPage: number) {
  void router.push({ query: { ...route.query, page: String(nextPage) } });
}
</script>

<template>
  <section class="catalog" aria-labelledby="characters-title">
    <div class="catalog__heading">
      <div>
        <p class="eyebrow">Исследуйте мультивселенную</p>
        <h2 id="characters-title">Персонажи</h2>
      </div>
      <p v-if="data" class="catalog__count">Найдено: {{ data.info.count }}</p>
    </div>
    <form
      class="filters"
      role="search"
      aria-label="Поиск персонажей"
      @submit.prevent="search"
    >
      <div class="field field--search">
        <label for="character-name">Поиск по имени</label>
        <input
          id="character-name"
          v-model="draftName"
          name="name"
          type="search"
          placeholder="Например, Rick Sanchez"
          maxlength="100"
        />
      </div>
      <div class="field">
        <label for="character-status">Статус</label>
        <select id="character-status" v-model="draftStatus" name="status">
          <option value="">Любой статус</option>
          <option value="alive">Жив</option>
          <option value="dead">Мёртв</option>
          <option value="unknown">Неизвестен</option>
        </select>
      </div>
      <button class="button" type="submit">Найти</button>
      <button
        v-if="hasFilters"
        class="button button--secondary"
        type="button"
        @click="reset"
      >
        Сбросить
      </button>
    </form>
    <div :aria-busy="isLoading">
      <QueryState
        :is-loading="isLoading"
        :error="error"
        :is-empty="!characters.length"
        @retry="retry"
        @reset="reset"
      />
      <template v-if="data && !isLoading && !error && characters.length">
        <div class="character-grid">
          <CharacterCard
            v-for="character in characters"
            :key="character.id"
            :character="character"
            @details="selectedCharacter = $event"
          />
        </div>
        <MainPagination
          :page="page"
          :pages="data.info.pages"
          @page-change="changePage"
        />
      </template>
    </div>
    <CharacterDetailModal
      :character="selectedCharacter"
      @close="selectedCharacter = null"
    />
  </section>
</template>
