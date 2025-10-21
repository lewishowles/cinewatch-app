<template>
	<page-header>
		Cinewatch

		<template #introduction>
			Look up listings from your favourite branch of Cineworld, select the films you want to see, and let Cinewatch work out the most efficient way to watch them.
		</template>
	</page-header>

	<div class="mt-10 flex flex-wrap items-start gap-4" data-test="film-finder">
		<alert-message v-if="errorMessage" type="error" class="w-full" data-test="film-finder-error">
			{{ errorMessage }}
		</alert-message>

		<form-field v-model="url" placeholder="e.g. https://www.cineworld.co.uk/cinemas/ashton-under-lyne/068" class="grow" data-test="film-finder-field">
			Cinema listing URL
		</form-field>

		<ui-button ref="submit-button" class="button--primary w-full shrink-0 md:mt-7 md:w-auto" v-bind="{ reactive: true }" data-test="film-finder-button" @click="getFilms">
			Get films
		</ui-button>
	</div>
</template>

<script setup>
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";
import { ref, useTemplateRef } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";
import { useRouter } from "vue-router";

import PageHeader from "@/components/layout/page-header/page-header.vue";

const router = useRouter();
const { findFilms } = useFilmFinder();

const submitButtonReference = useTemplateRef("submit-button");

// The user-entered URL of the branch.
const url = ref("");
// Any error message to display.
const errorMessage = ref(null);

/**
 * Retrieve the available films to display from the provided URL.
 */
async function getFilms() {
	try {
		errorMessage.value = null;

		await findFilms(url.value);

		router.push({ name: "branch" });
	} catch(error) {
		errorMessage.value = error.message;

		runComponentMethod(submitButtonReference.value, "reset");
	}
}
</script>
