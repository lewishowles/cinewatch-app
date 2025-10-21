import { createRouter, createWebHistory } from "vue-router";
import PageHome from "@/views/page-home/page-home.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: PageHome,
		},
		{
			path: "/branch",
			name: "branch",
			component: () => import("@/views/page-branch/page-branch.vue"),
		},
		//{
		//	path: "/results",
		//	name: "results",
		//	component: () => import("@/views/page-results/page-results.vue"),
		//},
	],
	scrollBehavior(to, from, savedPosition) {
		if (to.hash) {
			return { el: to.hash };
		}

		if (savedPosition) {
			return savedPosition;
		}

		return { top: 0 };
	},
});

export default router;
