<template>
	<div class="flex flex-col gap-10">
		<page-header>
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

		<film-set v-for="(set, filmSetIndex) in usableFilmSets" :key="set.id" v-bind="{ set }">
			<template #title>
				Option {{ filmSetIndex + 1 }}
			</template>
		</film-set>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { get } from "@lewishowles/helpers/object";
import { isNonEmptyArray } from "@lewishowles/helpers/array";

import useFilmSetCalculator from "@/composables/use-film-set-calculator/use-film-set-calculator";
import useStageManager from "@/composables/use-stage-manager/use-stage-manager";

import FilmSet from "./fragments/film-set/film-set.vue";
import PageHeader from "@/components/layout/page-header/page-header.vue";
import SelectedFilm from "./fragments/selected-film/selected-film.vue";

const { selectedFilms, selectedFilmsCount, filmSets } = useFilmSetCalculator();
const { goToSearch, goToList } = useStageManager();

// Our "usable" film sets. Sets with just one film aren't really reasonable, as
// they're not providing any new information.
const usableFilmSets = computed(() => {
	if (!isNonEmptyArray(filmSets.value)) {
		return [];
	}

	return filmSets.value.filter(filmSet => get(filmSet, "films_seen") > 1);
});
</script>
