<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from "vue-router";
import TheHeader from "@/widgets/header/ui/TheHeader.vue";
import TheFooter from "@/widgets/footer/ui/TheFooter.vue";

const mainContent = ref<HTMLElement | null>(null);
</script>

<template>
  <div class="main-layout">
    <a
      class="skip-link"
      href="#main-content"
      @click.prevent="mainContent?.focus()"
    >
      К содержимому
    </a>
    <TheHeader />
    <main
      id="main-content"
      ref="mainContent"
      class="page-container"
      tabindex="-1"
    >
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>
