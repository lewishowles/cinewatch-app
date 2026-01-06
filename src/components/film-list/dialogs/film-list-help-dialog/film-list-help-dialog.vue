<template>
	<div data-test="film-list-help-dialog">
		<modal-dialog-title>
			The film list
		</modal-dialog-title>

		<div class="flex flex-col gap-4">
			<p>The film list allows you to select which films you want to watch on the selected day, with each film looking something like this.</p>

			<div class="p-6 rounded-md bg-grey-50 border border-grey-200">
				<available-film :key="firstFilm.id" v-bind="{ film: firstFilm }" class="pointer-events-none" aria-hidden="true" />
			</div>

			<p>For each film, we present the option to select the individual "screening types"—such as 2D or IMAX—provided by the cinema. This allows more freedom than selecting a film as a whole. For example, you can ensure you see a film you're excited about in IMAX, or select regular 2D to avoid any uplift costs. If you don't mind what kind of screening you watch, simply select all types for a film.</p>

			<p>Selecting more than one type at a time only changes the number of screenings available to pick from, it doesn't include a film more than once, for example.</p>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { firstDefined } from "@lewishowles/helpers/array";
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";

import AvailableFilm from "@/components/available-film/available-film.vue";

const { availableFilms } = useFilmFinder();

const firstFilm = computed(() => firstDefined(availableFilms.value));
</script>
