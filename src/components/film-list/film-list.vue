<template>
	<div data-test="film-list">
		<loading-indicator v-if="isLoading" :large="true" data-test="film-list-loading">
			Loading films…
		</loading-indicator>

		<template v-else-if="!haveFilms">
			<page-header class="mb-10" data-test="film-list-not-found">
				Films not found

				<template #introduction>
					No films could be found for the provided URL. Please try again.
				</template>
			</page-header>

			<ui-button icon-start="icon-arrow-left" class="button--muted" @click="goToSearch">
				Choose another branch
			</ui-button>
		</template>

		<template v-else-if="haveFilms">
			<div class="flex flex-col gap-4 mb-10">
				<page-header v-if="haveBranch">
					{{ branch.name }}

					<template #introduction>
						{{ branch.description }}
					</template>

					<template #actions>
						<ui-button icon-start="icon-arrow-left" class="button--muted" @click="goToSearch">
							Choose another branch
						</ui-button>
					</template>
				</page-header>

				<p>When selecting films to watch, you select individual types of screening, rather than films as a whole. This lets you prioritise, or disallow, IMAX, for example. To continue, select two or more films.</p>
			</div>

			<div class="flex flex-col gap-4" data-test="film-list-list">
				<p class="text-sm">
					{{ availableFilmsCount }} films showing on this date. {{ totalFilmsCount }} total films available to book.
				</p>

				<div class="flex flex-col gap-16">
					<available-film v-for="film in availableFilms" :key="film.id" v-model="selectedFilmScreenings[film.id]" v-bind="{ film }" />
				</div>
			</div>

			<div class="fixed inset-x-0 bottom-0 mb-4 bg-white/60">
				<div class="mx-auto max-w-3xl px-4 py-2 rounded-full bg-white/30 backdrop-blur-lg outline outline-grey-300 border border-white flex items-center justify-between text-grey-500">
					<span class="text-shadow-2xs text-shadow-white">
						{{ selectedFilmCount }} selected

						<template v-if="selectedFilmCount === 1">
							film
						</template>
						<template v-else>
							films
						</template>
					</span>

					<ui-button class="button--primary rounded-full animate-opacity -me-2" :class="{ 'opacity-0': selectedFilmCount < 2, 'opacity-1': selectedFilmCount > 1 }">
						Get best times
					</ui-button>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup>
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";
import useStageManager from "@/composables/use-stage-manager/use-stage-manager";
import { isNonEmptyObject } from "@lewishowles/helpers/object";

import AvailableFilm from "@/components/available-film/available-film.vue";
import PageHeader from "@/components/layout/page-header/page-header.vue";

import { computed, ref } from "vue";
// The branch and film details retrieved by our film finder.
const { isLoading, branch, haveBranch, haveFilms, totalFilmsCount, availableFilms, availableFilmsCount } = useFilmFinder();
// Allow the user to go back and pick another branch.
const { goToSearch } = useStageManager();
// The selected screening types, grouped by film ID.
const selectedFilmScreenings = ref({});

// The number of films selected by the user to watch.
const selectedFilmCount = computed(() => {
	if (!isNonEmptyObject(selectedFilmScreenings.value)) {
		return 0;
	}

	return Object.values(selectedFilmScreenings.value).reduce((count, film) => {
		if (Object.values(film).some(Boolean)) {
			count++;
		}

		return count;
	}, 0);
});

// Initialise our selected screenings.
if (haveFilms.value) {
	availableFilms.value.forEach(film => {
		selectedFilmScreenings.value[film.id] = {};
	});
}
</script>
