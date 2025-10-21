<template>
	<h1 class="mb-4 text-4xl font-bold text-purple-800">
		Cinewatch
	</h1>

	<p class="max-w-prose">
		Look up listings from your favourite branch of Cineworld, select the films you want to see, and let Cinewatch work out the most efficient way to watch them.
	</p>

	<div class="mt-10 flex flex-wrap items-start gap-4" data-test="film-finder">
		<form-field v-model="listingUrl" placeholder="e.g. https://www.cineworld.co.uk/cinemas/ashton-under-lyne/068" class="grow" data-test="film-finder-field">
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

const router = useRouter();
const { findFilms, branch, films, haveBranch, haveFilms } = useFilmFinder();

const submitButtonReference = useTemplateRef("submit-button");

const listingUrl = ref("");

/**
 * Retrieve the available films to display from the provided URL.
 */
async function getFilms() {
	try {
		await findFilms(listingUrl.value);

		console.log({
			branch: branch.value, films: films.value, haveBranch: haveBranch.value, haveFilms: haveFilms.value,
		});

		router.push({ name: "branch" });
	} catch {
		runComponentMethod(submitButtonReference.value, "reset");
	}
}
</script>
