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
						<blockquote>{{ branch.description }}</blockquote>
					</template>

					<template #actions>
						<ui-button icon-start="icon-arrow-left" class="button--muted" @click="goToSearch">
							Choose another branch
						</ui-button>
					</template>
				</page-header>

				<ui-button class="button--muted text-sm self-start" @click="openModal(FilmListHelpDialog)">
					Get help
				</ui-button>
			</div>

			<div class="flex flex-col gap-4 mb-20" data-test="film-list-list">
				<p class="text-sm">
					{{ availableFilmsCount }} films showing on this date. {{ totalFilmsCount }} total films available to book.
				</p>

				<div class="flex flex-col gap-16">
					<available-film v-for="film in availableFilms" :key="film.id" v-model="filmScreeningTypes[film.id]" v-bind="{ film }" />
				</div>
			</div>

			<div class="fixed inset-x-0 bottom-0 mb-4 bg-white/60">
				<div class="mx-auto max-w-3xl px-4 py-2 rounded-full bg-white/30 backdrop-blur-lg outline outline-grey-300 border border-white flex items-center justify-between text-grey-500">
					<span class="text-shadow-2xs text-shadow-white">
						{{ selectedFilmsCount }} selected

						<template v-if="selectedFilmsCount === 1">
							film
						</template>
						<template v-else>
							films
						</template>
					</span>

					<ui-button class="button--primary rounded-full animate-opacity -me-2" :class="{ 'opacity-0 pointer-events-none': selectedFilmsCount < 2, 'opacity-100': selectedFilmsCount > 1 }" @click="selectFilms">
						Get best times
					</ui-button>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup>
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";
import useFilmSetCalculator from "@/composables/use-film-set-calculator/use-film-set-calculator";
import useStageManager from "@/composables/use-stage-manager/use-stage-manager";
import { useModalDialog } from "@lewishowles/components";

import AvailableFilm from "@/components/available-film/available-film.vue";
import FilmListHelpDialog from "./dialogs/film-list-help-dialog/film-list-help-dialog.vue";
import PageHeader from "@/components/layout/page-header/page-header.vue";

const { openModal } = useModalDialog();
// The branch and film details retrieved by our film finder.
const { isLoading, branch, haveBranch, haveFilms, totalFilmsCount, availableFilms, availableFilmsCount } = useFilmFinder();
// Allow the user to go back and pick another branch.
const { goToSearch, goToSets } = useStageManager();
// Set up the process of calculating the best film sets.
const { filmScreeningTypes, selectedFilmsCount } = useFilmSetCalculator();

// Initialise our selected screenings.
if (haveFilms.value) {
	availableFilms.value.forEach(film => {
		if (!Object.hasOwn(filmScreeningTypes.value, film.id)) {
			filmScreeningTypes.value[film.id] = {};
		}
	});
}

/**
 * Mark the selected films and navigate to our details screen to display the
 * results.
 */
function selectFilms() {
	goToSets();
}
</script>
