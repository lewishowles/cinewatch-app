<template>
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

	<div data-test="film-list">
		<pre>{{ { isLoading, haveFilms } }}</pre>
		<loading-indicator v-if="isLoading" :large="true" data-test="film-list-loading">
			Loading films…
		</loading-indicator>

		<alert-message v-else-if="!haveFilms" type="warning" data-test="film-list-warning">
			No films could be found. Did you use the correct URL?
		</alert-message>

		<div v-else-if="haveFilms" data-test="film-list-list">
			<p class="text-xs">
				{{ availableFilmCount }} films showing on this date. {{ totalFilmCount }} total films available to book.
			</p>

			<pre>{{ films }}</pre>
		</div>
	</div>
</template>

<script setup>
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";
import useStageManager from "@/composables/use-stage-manager/use-stage-manager";

import PageHeader from "@/components/layout/page-header/page-header.vue";

// The branch and film details retrieved by our film finder.
const { isLoading, branch, haveBranch, films, haveFilms, totalFilmCount, availableFilmCount } = useFilmFinder();
// Allow the user to go back and pick another branch.
const { goToSearch } = useStageManager();
</script>
