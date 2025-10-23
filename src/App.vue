<template>
	<header class="mb-18">
		<img src="/logo.svg" alt="Cinewatch" class="h-5" />
	</header>

	<main class="mx-auto max-w-3xl">
		<film-finder v-if="isSearch" />
	</main>
</template>

<script setup>
import FilmFinder from "@/components/film-finder/film-finder.vue";

import useStageManager from "@/composables/use-stage-manager/use-stage-manager";

const { isSearch } = useStageManager();
</script>
