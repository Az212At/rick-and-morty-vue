import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
  type RouterHistory,
} from "vue-router";
import MainLayout from "@/app/layouts/MainLayout.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", redirect: { name: "characters" } },
      {
        path: "characters",
        name: "characters",
        component: () => import("@/pages/characters/ui/CharactersPage.vue"),
      },
      {
        path: "episodes",
        name: "episodes",
        component: () => import("@/pages/episodes/ui/EpisodesPage.vue"),
      },
      {
        path: ":pathMatch(.*)*",
        name: "not-found",
        component: () => import("@/pages/not-found/ui/NotFoundPage.vue"),
      },
    ],
  },
];

export function createAppRouter(
  history: RouterHistory = createWebHashHistory(import.meta.env.BASE_URL)
) {
  return createRouter({
    history,
    routes,
    scrollBehavior(to, from, savedPosition) {
      return savedPosition ?? (to.path !== from.path ? { top: 0 } : false);
    },
  });
}
