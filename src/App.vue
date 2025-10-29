<template>
	<header class="mb-18">
		<img src="/logo.svg" alt="Cinewatch" class="h-5" />
	</header>

	<main class="mx-auto max-w-3xl px-4">
		<film-finder v-if="isSearch" />
		<film-list v-else-if="isResults" />
	</main>
</template>

<script setup>
import FilmFinder from "@/components/film-finder/film-finder.vue";
import FilmList from "@/components/film-list/film-list.vue";

import useStageManager from "@/composables/use-stage-manager/use-stage-manager";

const { isSearch, isResults } = useStageManager();
</script>
