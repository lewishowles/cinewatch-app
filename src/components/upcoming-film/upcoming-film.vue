<template>
	<div v-if="haveFilm" data-test="upcoming-film">
		Upcoming film
	</div>
</template>

<script setup>
import { computed } from "vue";
import { isNonEmptyObject } from "@lewishowles/helpers/object";

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
</script>
