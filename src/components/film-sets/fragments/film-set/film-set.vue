<template>
	<div v-if="havePath" data-test="film-set">
		<div class="flex flex-wrap items-center justify-between mb-2">
			<h2 class="text-lg font-bold text-grey-950" :class="{ 'text-yellow-800': !includesAllFilms }">
				Option {{ set.continuous_index }}
			</h2>

			<ui-button class="link text-sm" icon-end="icon-external" @click="openBookingPages">
				Open booking pages
			</ui-button>
		</div>

		<film-set-metadata v-bind="{ set }" />

		<ul class="film-set-films flex flex-col gap-6" data-test="film-set-chart">
			<li v-for="item in pathWithWaitTimes" :key="item.id">
				<film-set-film v-if="item.type === 'film'" v-bind="{ film: item }" />

				<div v-else-if="item.type === 'wait'" class="text-grey-500" data-test="film-set-wait">
					{{ item.wait_time }} wait
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { get, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyArray, pluck } from "@lewishowles/helpers/array";
import { nanoid } from "nanoid";
import useFilmSetCalculator from "@/composables/use-film-set-calculator/use-film-set-calculator";
import useDateHelpers from "@/composables/use-date-helpers/use-date-helpers";

import FilmSetFilm from "./fragments/film-set-film/film-set-film.vue";
import FilmSetMetadata from "./fragments/film-set-metadata/film-set-metadata.vue";

const props = defineProps({
	/**
	 * The details of a single film set, which is a sequence of films to watch,
	 * and the order to watch them.
	 */
	set: {
		type: Object,
		default: () => ({}),
	},
});

const { selectedFilmsCount } = useFilmSetCalculator();
const { dateDifference } = useDateHelpers();
// Our path, extracted from the provided set.
const path = computed(() => get(props.set, "path"));
// Whether we have a path for this set.
const havePath = computed(() => isNonEmptyArray(path.value));
// Whether this set contains all of the selected films.
const includesAllFilms = computed(() => get(props.set, "films_seen") === selectedFilmsCount.value);

// Add "wait time" elements to our path. We separate films from waits with a
// "type" property.
const pathWithWaitTimes = computed(() => {
	if (!havePath.value) {
		return [];
	}

	return path.value.flatMap((film, index) => {
		const nextFilm = path.value[index + 1];

		if (!isNonEmptyObject(nextFilm)) {
			return { ...film, type: "film" };
		}

		return [
			{
				...film,
				type: "film",
			},
			{
				id: nanoid(),
				wait_time: getWaitBetweenFilms(film, nextFilm),
				type: "wait",
			},
		];
	});
});

/**
 * Get the time between two films in a human-readable form.
 *
 * @param  {object}  firstFilm
 *     The details of a film, containing an "end.value"
 * @param  {object}  secondFilm
 *     The details of a film, containing a "start.value"
 */
function getWaitBetweenFilms(firstFilm, secondFilm) {
	const start = get(secondFilm, "start.value");
	const startDate = new Date(start);
	const end = get(firstFilm, "end.value");
	const endDate = new Date(end);

	if (start === null || end === null) {
		return "Unknown";
	}

	return dateDifference(startDate, endDate);
}

/**
 * Find and open the list of booking URLs for the films in the current set.
 */
function openBookingPages() {
	if (!havePath.value) {
		return;
	}

	pluck(path.value, "booking_url").forEach(url => {
		window.open(url, "_blank");
	});
}
</script>

<style>
@reference "@/assets/css/main.css";

.film-set-films {
	@apply relative;

	&::before {
		@apply w-px absolute start-0 inset-y-0 my-5 bg-grey-200 ms-1 -z-1;

		content: "";
	}

	li {
		@apply flex items-center;

		&::before {
			@apply bg-grey-500 rounded-full me-8;

			block-size: 9px;
			inline-size: 9px;

			content: "";
		}

		&:nth-child(even) {
			&::before {
				@apply bg-grey-200;
			}
		}
	}
}
</style>
