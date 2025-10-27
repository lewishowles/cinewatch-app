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
			<page-header v-if="haveBranch" class="mb-10">
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

			<div data-test="film-list-list">
				<p class="text-xs mb-4">
					{{ showingFilmsCount }} films showing on this date. {{ totalFilmsCount }} total films available to book.
				</p>

				<div class="flex flex-col gap-16">
					<available-film v-for="film in availableFilms" :key="film.id" v-bind="{ film }" />
				</div>
			</div>
		</template>
	</div>
</template>

<script setup>
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";
import useStageManager from "@/composables/use-stage-manager/use-stage-manager";

import AvailableFilm from "@/components/available-film/available-film.vue";
import PageHeader from "@/components/layout/page-header/page-header.vue";

// The branch and film details retrieved by our film finder.
const { isLoading, branch, haveBranch, haveFilms, totalFilmsCount, availableFilms, showingFilmsCount } = useFilmFinder();
// Allow the user to go back and pick another branch.
const { goToSearch } = useStageManager();
</script>
