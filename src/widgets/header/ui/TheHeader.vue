<script setup lang="ts">
import { RouterLink } from "vue-router";
import logo from "@/shared/assets/img/logoA.svg";
import rickImage from "@/shared/assets/img/HighlightImageRick.png";
</script>

<template>
  <header class="the-header">
    <div class="the-header__container">
      <div class="the-header__top">
        <RouterLink
          to="/characters"
          class="the-header__brand"
          aria-label="Рик и Морти — персонажи"
        >
          <img
            :src="logo"
            alt="Rick and Morty"
            class="the-header__logo"
            width="180"
            height="54"
          />
        </RouterLink>
        <nav class="the-header__nav" aria-label="Основная навигация">
          <RouterLink
            to="/characters"
            class="the-header__link"
            active-class="is-active"
            >Персонажи</RouterLink
          >
          <RouterLink
            to="/episodes"
            class="the-header__link"
            active-class="is-active"
            >Эпизоды</RouterLink
          >
        </nav>
      </div>
      <div class="the-header__main">
        <div class="the-header__text">
          <p class="the-header__eyebrow">Вселенная Рика и Морти</p>
          <h1 class="the-header__title">Всё в одном <span>месте</span>.</h1>
          <p class="the-header__subtitle">
            Персонажи и эпизоды любимой мультивселенной
          </p>
        </div>
        <div class="the-header__image">
          <img :src="rickImage" alt="Рик Санчес" fetchpriority="high" />
        </div>
      </div>
    </div>
  </header>
</template>
