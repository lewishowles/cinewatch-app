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

		<none-found v-if="!haveFilmSets">
			<template #title>
				No suggestions found
			</template>

			We couldn't find any suggestions based on the selected films.

			<template #actions>
				<ui-button class="button--muted" @click="goToList">
					Change film selection
				</ui-button>
			</template>
		</none-found>

		<film-set v-for="set in fullFilmSets" :key="set.id" v-bind="{ set }" />

		<template v-if="havePartialFilmSets">
			<alert-message type="warning">
				The following options do not contain all {{ selectedFilmsCount }} films.
			</alert-message>

			<film-set v-for="set in partialFilmSets" :key="set.id" v-bind="{ set }" />
		</template>
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

// Film sets that contain all of the films the user wanted to watch.
const fullFilmSets = computed(() => {
	if (!isNonEmptyArray(filmSets.value)) {
		return [];
	}

	return filmSets.value.filter(filmSet => {
		const filmsSeen = get(filmSet, "films_seen");

		return filmsSeen === selectedFilmsCount.value;
	});
});

// Film sets that contain some of the selected films, but more than one, as a
// set with a single film isn't providing anything new.
const partialFilmSets = computed(() => {
	if (!isNonEmptyArray(filmSets.value)) {
		return [];
	}

	return filmSets.value.filter(filmSet => {
		const filmsSeen = get(filmSet, "films_seen");

		return filmsSeen < selectedFilmsCount.value && filmsSeen > 1;
	});
});

// Whether we have any partial film sets to display.
const havePartialFilmSets = computed(() => isNonEmptyArray(partialFilmSets.value));
</script>
