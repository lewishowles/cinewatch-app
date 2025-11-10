<template>
	<div v-if="havePath" data-test="film-set">
		<h2 v-if="haveTitle" class="text-lg font-bold text-grey-950 mb-2">
			<slot name="title" />
		</h2>

		<film-set-metadata v-bind="{ set }" />

		<ul class="film-set-films flex flex-col gap-6">
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
import { computed, useSlots } from "vue";
import { get, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";
import { nanoid } from "nanoid";
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

const { dateDifference } = useDateHelpers();
const slots = useSlots();
// Whether a title has been provided. This is provided by the parent, as the
// parent controls how sets are displayed, and can provide an index to
// differentiate sets.
const haveTitle = computed(() => isNonEmptySlot(slots.title));
// Our path, extracted from the provided set.
const path = computed(() => get(props.set, "path"));
// Whether we have a path for this set.
const havePath = computed(() => isNonEmptyArray(path.value));

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
