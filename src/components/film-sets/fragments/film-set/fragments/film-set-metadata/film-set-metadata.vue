<template>
	<dl v-if="haveSet" class="film-set-metadata flex items-center text-sm gap-2 mb-3" data-test="film-set-metadata">
		<template v-if="!includesAllFilms">
			<dt class="text-yellow-800">
				Films
			</dt>
			<dd class="text-yellow-800">
				{{ set.films_seen }} / {{ selectedFilmsCount }}
			</dd>
		</template>

		<dt>Total time</dt>
		<dd class="font-bold">
			{{ totalTime }}
		</dd>

		<dt>Starts</dt>
		<dd class="font-bold">
			{{ startTime }}
		</dd>

		<dt>Ends</dt>
		<dd class="font-bold">
			{{ endTime }}
		</dd>

		<dt>Total wait time</dt>
		<dd class="font-bold">
			{{ totalWaitTime }}
		</dd>
	</dl>

	<div v-if="havePath" class="h-2.5 rounded-full bg-grey-100 mb-6 relative" aria-hidden="true" data-test="film-set-time-chart">
		<div v-for="segment in dayChart" :key="segment.film_id" class="h-2.5 rounded-full bg-purple-600 absolute inset-y-0" :style="{ 'inset-inline-start': segment.start, 'inset-inline-end': segment.end }" />
	</div>
</template>

<script setup>
import { computed } from "vue";
import { firstDefined, isNonEmptyArray, lastDefined } from "@lewishowles/helpers/array";
import { get, isNonEmptyObject } from "@lewishowles/helpers/object";
import { round } from "@lewishowles/helpers/number";
import useDateHelpers from "@/composables/use-date-helpers/use-date-helpers";
import useFilmSetCalculator from "@/composables/use-film-set-calculator/use-film-set-calculator";

const props = defineProps({
	/**
	 * The film set, from which we determine our metadata.
	 */
	set: {
		type: Object,
		default: () => ({}),
	},
});

const { dateDifference, getDayProgress, millisecondsToHumanTime } = useDateHelpers();
const { selectedFilmsCount } = useFilmSetCalculator();
// Whether we have a set that seems valid.
const haveSet = computed(() => isNonEmptyObject(props.set));
// The total wait time of our set, in human-readable form.
const totalWaitTime = computed(() => millisecondsToHumanTime(get(props.set, "total_wait")));
// Our path
const path = computed(() => get(props.set, "path"));
// Whether a path has been found.
const havePath = computed(() => isNonEmptyArray(path.value));
// The first film in the provided set.
const firstFilm = computed(() => firstDefined(path.value));
// The last film in the provided set.
const lastFilm = computed(() => lastDefined(path.value));
// Whether this set contains all of the selected films.
const includesAllFilms = computed(() => get(props.set, "films_seen") === selectedFilmsCount.value);

// The total time, from the start of the first film, to the end of the last.
const totalTime = computed(() => {
	if (!havePath.value) {
		return "Unknown";
	}

	const start = get(firstFilm.value, "start.value");
	const end = get(lastFilm.value, "end.value");

	if (start === null || end === null) {
		return "Unknown";
	}

	return dateDifference(new Date(start), new Date(end));
});

// The start time of the first film in this set.
const startTime = computed(() => {
	if (!havePath.value) {
		return "Unknown";
	}

	return get(firstFilm.value, "start.label") || "Unknown";
});

// The end time of the last film in this set.
const endTime = computed(() => {
	if (!havePath.value) {
		return "Unknown";
	}

	return get(lastFilm.value, "end.label") || "Unknown";
});

// Data for a chart representing the films on a single day, containing
// information for the start and end of each film on a horizontal bar.
const dayChart = computed(() => {
	if (!havePath.value) {
		return [];
	}

	return path.value.reduce((chart, film) => {
		if (!isNonEmptyObject(film)) {
			return chart;
		}

		const start = getDayProgress(get(film, "start.value"));

		let end = getDayProgress(get(film, "end.value"));

		// If our end is less than our start, that means the film ended after
		// midnight, which we want to simplify on our chart.
		if (end < start) {
			end = 100;
		}

		// Since inset-inline-end is fully to the "end" at 0%, we need to invert
		// our number.
		end = round(100 - end, 2);

		chart.push({
			film_id: film.film_id,
			start: `${start}%`,
			end: `${end}%`,
		});

		return chart;
	}, []);
});
</script>

<style>
@reference "@/assets/css/main.css";

.film-set-metadata dd + dt {
	@apply flex items-center gap-2;

	&::before {
		content: "•";
	}
}
</style>
