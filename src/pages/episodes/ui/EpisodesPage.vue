<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { EpisodeCard, episodeListPath, type Episode } from "@/entities/episode";
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
const draftName = ref(name.value);
const { data, isLoading, error, retry } = useResource<
  PaginatedResponse<Episode>
>(() => episodeListPath({ page: page.value, name: name.value }));
const episodes = computed(() => data.value?.results ?? []);
const hasFilters = computed(() => Boolean(name.value || page.value > 1));

watch(
  () => route.fullPath,
  () => {
    draftName.value = name.value;
  },
  { flush: "sync" }
);

function search() {
  draftName.value = draftName.value.trim();
  void router.push({ query: draftName.value ? { name: draftName.value } : {} });
}

function reset() {
  draftName.value = "";
  void router.push({ query: {} });
}

function changePage(nextPage: number) {
  void router.push({ query: { ...route.query, page: String(nextPage) } });
}
</script>

<template>
  <section class="catalog" aria-labelledby="episodes-title">
    <div class="catalog__heading">
      <div>
        <p class="eyebrow">Ещё одно приключение</p>
        <h2 id="episodes-title">Эпизоды</h2>
      </div>
      <p v-if="data" class="catalog__count">Найдено: {{ data.info.count }}</p>
    </div>
    <form
      class="filters"
      role="search"
      aria-label="Поиск эпизодов"
      @submit.prevent="search"
    >
      <div class="field field--search">
        <label for="episode-name">Поиск по имени</label>
        <input
          id="episode-name"
          v-model="draftName"
          name="name"
          type="search"
          placeholder="Например, Pilot"
          maxlength="100"
        />
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
        :is-empty="!episodes.length"
        @retry="retry"
        @reset="reset"
      />
      <template v-if="data && !isLoading && !error && episodes.length">
        <div class="episode-grid">
          <EpisodeCard
            v-for="episode in episodes"
            :key="episode.id"
            :episode="episode"
          />
        </div>
        <MainPagination
          :page="page"
          :pages="data.info.pages"
          @page-change="changePage"
        />
      </template>
    </div>
  </section>
</template>
