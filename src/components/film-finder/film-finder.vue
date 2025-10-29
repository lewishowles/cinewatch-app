<template>
	<page-header class="mb-10">
		Cinewatch

		<template #introduction>
			Look up listings from your favourite branch of Cineworld, select the films you want to see, and let Cinewatch work out the most efficient way to watch them.
		</template>
	</page-header>

	<div data-test="film-finder">
		<alert-message v-if="errorMessage" class="mb-4" type="error" data-test="film-finder-error">
			{{ errorMessage }}
		</alert-message>

		<form class="flex flex-wrap items-start gap-4" data-test="film-finder-form" @submit.prevent="getFilms">
			<form-field v-model="url" placeholder="e.g. https://www.cineworld.co.uk/cinemas/ashton-under-lyne/068" class="grow" data-test="film-finder-field">
				Cinema listing URL
			</form-field>

			<ui-button
				ref="submit-button"
				type="submit"
				class="button--primary w-full shrink-0 md:mt-7 md:w-auto"
				v-bind="{ reactive: true }"
				data-test="film-finder-button"
			>
				Get films
			</ui-button>
		</form>

		<div v-if="haveFavourites" class="text-sm flex gap-4 mt-4 bg-grey-50 rounded-full px-4 py-2">
			<span class="mt-1">Favourite branches</span>

			<ol class="flex flex-wrap items-center gap-4">
				<li v-for="favourite in userFavourites" :key="favourite.name">
					<ui-button class="button--muted text-xs" @click="quickSearch(favourite.url)">
						{{ favourite.name }}
					</ui-button>
				</li>
			</ol>
		</div>
	</div>
</template>

<script setup>
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";
import useStageManager from "@/composables/use-stage-manager/use-stage-manager";
import { computed, ref, useTemplateRef } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { runComponentMethod } from "@lewishowles/helpers/vue";
import { useStorage } from "@vueuse/core";

import PageHeader from "@/components/layout/page-header/page-header.vue";

// Our film finder, which searches for films for us.
const { branch, findFilms, haveBranch, isLoading } = useFilmFinder();
// Our stage manager, which determines which stage of the process is shown to
// the user.
const { goToList } = useStageManager();

// Our submit button, allowing us to reset its state.
const submitButtonReference = useTemplateRef("submit-button");
// The user-entered URL of the branch.
const url = ref("");
// Any error message to display.
const errorMessage = ref(null);
// The user's favourite branches.
const userFavourites = useStorage("cinewatch:branches", []);
// Whether the user has any favourites.
const haveFavourites = computed(() => isNonEmptyArray(userFavourites.value));

/**
 * Retrieve the available films to display from the provided URL, store the
 * resulting branch as a favourite, and navigate to the results display.
 */
async function getFilms() {
	if (isLoading.value) {
		return;
	}

	try {
		errorMessage.value = null;

		await findFilms(url.value);

		storeFavouriteBranch();

		goToList();
	} catch(error) {
		errorMessage.value = error.message;

		runComponentMethod(submitButtonReference.value, "reset");
	}
}

/**
 * Perform a quick-search with a given URL. This is used by our list of
 * user-favourite branches.
 *
 * @param  {string}  url
 *     The URL to perform a search on.
 */
function quickSearch(urlToSearch) {
	if (!isNonEmptyString(urlToSearch)) {
		return;
	}

	runComponentMethod(submitButtonReference.value, "react");

	url.value = urlToSearch;

	getFilms();
}

/**
 * Given the details of the current branch, store it for later selection. We
 * store branches as a name and URL, which can be selected to quickly load films
 * at that branch. We also store the number of times a branch has been accessed,
 * so that we can order by that figure, showing the most frequent branches
 * first.
 */
function storeFavouriteBranch() {
	if (!haveBranch.value) {
		return;
	}

	// If our favourite already exists, update its count.
	const currentFavourite = userFavourites.value.find(favourite => favourite.name === branch.value.name);

	if (currentFavourite) {
		currentFavourite.count++;
	} else {
		userFavourites.value.push({
			name: branch.value.name,
			url: branch.value.url,
			count: 1,
		});
	}

	userFavourites.value.sort((a, b) => b.count - a.count);
}
</script>
