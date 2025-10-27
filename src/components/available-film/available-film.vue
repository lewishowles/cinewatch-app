<template>
	<div v-if="haveFilm" class="flex gap-8" data-test="showing-film">
		<link-tag v-if="haveFilmTitle" v-bind="{ href: filmUrl, external: true, showExternalIcon: false }">
			<image-tag v-bind="{ src: posterUrl, alt: `Poster for ${film.title}` }" class="w-25 h-38" />
		</link-tag>

		<div class="flex flex-col">
			<link-tag v-if="haveFilmTitle" class="text-xl font-bold no-underline text-grey-950 hocus:text-purple-800 hocus:underline" v-bind="{ href: filmUrl, external: true }" data-test="showing-film-title">
				{{ film.title }}

				<span class="sr-only">View more details on the Cineworld website</span>
			</link-tag>

			<div class="flex items-center gap-2 text-sm text-grey-500">
				<template v-for="(item, index) in metadata" :key="index">
					<span v-if="index > 0">•</span>

					<component :is="item.component" v-bind="item.props">
						{{ item.text }}
					</component>
				</template>
			</div>

			<film-screenings v-if="haveScreenings" v-model="selectedScreeningTypes" v-bind="{ screenings: film.screenings }" class="mt-4" />
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { get, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";

import FilmScreenings from "./fragments/film-screenings/film-screenings.vue";

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
// The URL for our film.
const filmUrl = computed(() => get(props.film, "url"));
// The URL for our film's poster.
const posterUrl = computed(() => get(props.film, "poster.url"));
// Whether our film has a title.
const haveFilmTitle = computed(() => isNonEmptyString(get(props.film, "title")));
// Whether our film has an appropriate rating.
const haveRating = computed(() => isNonEmptyString(get(props.film, "rating.url")) && isNonEmptyString(get(props.film, "rating.alt")));
// Whether our film has a listed genre.
const haveGenre = computed(() => isNonEmptyString(get(props.film, "genre")));
// Whether our film has a listed duration.
const haveDuration = computed(() => get(props.film, "duration_minutes") > 0);
// Whether this film has screenings. If it doesn't, we have problems, but just in case.
const haveScreenings = computed(() => isNonEmptyArray(get(props.film, "screenings")));

// The selected screening types, used to calculate what times to use for this
// film.
const selectedScreeningTypes = defineModel({
	type: Object,
	default: {},
});

// Metadata items to display under our film title.
const metadata = computed(() => {
	const items = [];

	if (haveRating.value) {
		items.push({
			component: "image-tag",
			props: {
				"src": props.film.rating.url,
				"alt": props.film.rating.alt,
				"class": "size-5",
				"data-test": "showing-film-rating",
			},
		});
	}

	if (haveGenre.value) {
		items.push({
			component: "span",
			text: props.film.genre,
			props: {
				"data-test": "showing-film-genre",
			},
		});
	}

	if (haveDuration.value) {
		items.push({
			component: "span",
			text: `${props.film.duration_minutes} mins`,
			props: {
				"data-test": "showing-film-duration",
			},
		});
	}

	return items;
});
</script>
