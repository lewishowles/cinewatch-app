<template>
	<div v-if="haveFilm" class="flex gap-2 items-center" data-test="film-set-film">
		<image-tag v-bind="{ src: posterUrl, alt: `Poster for ${film.title}` }" class="w-7 h-10 rounded" data-test="film-set-film-poster" />

		<div class="flex flex-col">
			<span class="font-semibold text-grey-950" data-test="film-set-film-title">{{ film.title }}</span>
			<span v-if="hasScreeningTime" class="text-xs text-grey-500 flex items-baseline gap-2">
				<span data-test="film-set-film-times">{{ film.start.label }}–{{ film.end.label }}</span>
				<span aria-hidden="true">•</span>
				<span data-test="film-set-film-screening-type">{{ film.screening_type }}</span>
			</span>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { get, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";

const props = defineProps({
	/**
	 * The details of the film to display.
	 */
	film: {
		type: Object,
		default: () => ({}),
	},
});

// Whether we have details for a film.
const haveFilm = computed(() => isNonEmptyObject(props.film));
// The URL to the poster of the film.
const posterUrl = computed(() => get(props.film, "poster.url"));

// Whether the film has both a start time and end time to display.
const hasScreeningTime = computed(() => {
	return isNonEmptyString(get(props.film, "start.label")) &&
		isNonEmptyString(get(props.film, "end.label"));
});
</script>
