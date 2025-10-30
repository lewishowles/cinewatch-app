<template>
	<li v-if="haveFilm" class="flex gap-2 items-center" data-test="selected-film">
		<image-tag v-bind="{ src: posterUrl, alt: `Poster for ${film.title}` }" class="w-7 h-10 rounded" />

		<div class="flex flex-col">
			<span class="font-semibold text-grey-950">{{ film.title }}</span>
			<span class="text-xs text-grey-500">{{ selectedScreeningTypes }}</span>
		</div>
	</li>
</template>

<script setup>
import { computed } from "vue";
import { get, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import useFilmSetCalculator from "@/composables/use-film-set-calculator/use-film-set-calculator";

const props = defineProps({
	/**
	 * The details of the film to display.
	 */
	film: {
		type: Object,
		default: () => ({}),
	},
});

const { selectedFilmScreeningTypes } = useFilmSetCalculator();
// Whether we have details for a film.
const haveFilm = computed(() => isNonEmptyObject(props.film));
// The URL to the poster of the film.
const posterUrl = computed(() => get(props.film, "poster.url"));

// A list of the selected screening type IDs for the current film.
const selectedScreeningTypeIDs = computed(() => {
	if (!haveFilm.value) {
		return null;
	}

	return get(selectedFilmScreeningTypes.value, props.film.id);
});

// The screening types for the current film, e.g. IMAX • 2D
const selectedScreeningTypes = computed(() => {
	if (!haveFilm.value || !isNonEmptyArray(selectedScreeningTypeIDs.value)) {
		return "";
	}

	return selectedScreeningTypeIDs.value.map(screeningID => {
		const screenings = props.film.screenings;

		if (!isNonEmptyArray(screenings)) {
			return "";
		}

		const screening = screenings.find(screening => screening.id === screeningID);

		if (!isNonEmptyObject(screening)) {
			return "";
		}

		return get(screening, "label");
	}).filter(item => item).join(" • ");
});
</script>
