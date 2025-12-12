<template>
	<header class="mb-18">
		<img src="/logo.svg" alt="Cinewatch" class="h-5" />
	</header>

	<main class="mx-auto max-w-3xl px-4">
		<film-finder v-if="isSearch" />
		<film-list v-else-if="isList" />
		<film-sets v-else-if="isSets" />
	</main>

	<modal-controller />
</template>

<script setup>
import FilmFinder from "@/components/film-finder/film-finder.vue";
import FilmList from "@/components/film-list/film-list.vue";
import FilmSets from "@/components/film-sets/film-sets.vue";

import useStageManager from "@/composables/use-stage-manager/use-stage-manager";

const { isSearch, isList, isSets } = useStageManager();
</script>
