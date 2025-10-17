<template>
	<header class="mb-18">
		<img src="/logo.svg" alt="Cinewatch" class="h-5" />
	</header>

	<main class="mx-auto max-w-3xl">
		<film-finder />
	</main>
</template>

<script setup>
import FilmFinder from "@/components/film-finder/film-finder.vue";
</script>
