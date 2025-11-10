<template>
	<dl v-if="haveSet" class="film-set-metadata flex items-center text-sm gap-2 mb-6" data-test="film-set-metadata">
		<dt>Total time</dt>
		<dd>{{ totalTime }}</dd>

		<dt>Starts</dt>
		<dd>{{ startTime }}</dd>

		<dt>Ends</dt>
		<dd>{{ endTime }}</dd>

		<dt>Total wait time</dt>
		<dd>{{ totalWaitTime }}</dd>
	</dl>
</template>

<script setup>
import { computed } from "vue";
import { firstDefined, isNonEmptyArray, lastDefined } from "@lewishowles/helpers/array";
import { get, isNonEmptyObject } from "@lewishowles/helpers/object";
import useDateHelpers from "@/composables/use-date-helpers/use-date-helpers";

const props = defineProps({
	/**
	 * The film set, from which we determine our metadata.
	 */
	set: {
		type: Object,
		default: () => ({}),
	},
});

const { dateDifference, millisecondsToHumanTime } = useDateHelpers();
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

// The total time, from the start of the first film, to the end of the last.
const totalTime = computed(() => {
	if (!havePath.value) {
		return "Unknown";
	}

	const start = get(firstFilm.value, "start.value");
	const startDate = new Date(start);
	const end = get(lastFilm.value, "end.value");
	const endDate = new Date(end);

	if (start === null || end === null) {
		return "Unknown";
	}

	return dateDifference(startDate, endDate);
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
</script>

<style>
@reference "@/assets/css/main.css";

.film-set-metadata dd {
	@apply font-bold;
}

.film-set-metadata dd + dt {
	@apply flex items-center gap-2;

	&::before {
		content: "•";
	}
}
</style>
