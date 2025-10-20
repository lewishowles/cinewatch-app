<template>
	<header class="mb-18">
		<img src="/logo.svg" alt="Cinewatch" class="h-5" />
	</header>

	<main class="mx-auto max-w-3xl">
		<film-finder v-if="!haveBranch" />
		<div v-if="haveBranch">
			Oh branch
		</div>
	</main>
</template>

<script setup>
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";

import FilmFinder from "@/components/film-finder/film-finder.vue";

const { haveBranch } = useFilmFinder();
</script>
