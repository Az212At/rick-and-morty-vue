<script setup lang="ts">
import { RouterLink } from "vue-router";
import logo from "@/shared/assets/img/logoA.svg";

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="the-footer">
    <div class="the-footer__container">
      <RouterLink to="/characters" aria-label="К списку персонажей">
        <img
          :src="logo"
          alt="Rick and Morty"
          class="the-footer__logo"
          width="165"
          height="50"
        />
      </RouterLink>
      <p class="the-footer__text">
        {{ currentYear }} · Данные
        <a href="https://rickandmortyapi.com/" target="_blank" rel="noreferrer"
          >The Rick and Morty API</a
        >
      </p>
    </div>
  </footer>
</template>
