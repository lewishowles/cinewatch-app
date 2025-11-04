<template>
	<page-header class="mb-10">
		Best combinations

		<template #actions>
			<ui-button icon-start="icon-arrow-left" class="button--muted" @click="goToSearch">
				Start again
			</ui-button>
		</template>
	</page-header>

	<div class="bg-grey-50 border border-grey-300 p-4 rounded-md text-sm" data-test="film-sets">
		<div class="flex justify-between items-center mb-2">
			You selected {{ selectedFilmsCount }} films:

			<ui-button class="button--muted" @click="goToList">
				Change selection
			</ui-button>
		</div>

		<ul class="flex flex-col gap-4">
			<selected-film v-for="film in selectedFilms" :key="film.id" v-bind="{ film }" />
		</ul>
	</div>

	<pre>{{ filmSets }}</pre>
	<pre>{{ selectedFilmTimes }}</pre>
</template>

<script setup>
import useFilmSetCalculator from "@/composables/use-film-set-calculator/use-film-set-calculator";
import useStageManager from "@/composables/use-stage-manager/use-stage-manager";

import PageHeader from "@/components/layout/page-header/page-header.vue";
import SelectedFilm from "./fragments/selected-film/selected-film.vue";

const { selectedFilms, selectedFilmsCount, selectedFilmTimes, filmSets } = useFilmSetCalculator();
const { goToSearch, goToList } = useStageManager();
</script>
