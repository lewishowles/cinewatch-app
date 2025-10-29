<template>
	<div v-if="haveScreenings" class="flex flex-col gap-4" data-test="film-screenings">
		<div v-for="screening in screenings" :key="screening.id">
			<form-field v-model="selectedScreenings[screening.id]" type="checkbox" class="font-semibold">
				{{ screening.label }}

				<template v-if="screening.subtitled">
					(Subtitled)
				</template>
			</form-field>

			<div class="text-sm flex flex-wrap gap-1 ps-7 text-grey-500">
				<template v-for="(time, index) in screening.times" :key="index">
					<span v-if="index > 0">•</span>

					<span>
						{{ time.start.label }}
					</span>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";

const props = defineProps({
	/**
	 * The screenings available for a particular film.
	 */
	screenings: {
		type: Array,
		default: () => [],
	},
});

// Any screening types that are selected.
const selectedScreenings = defineModel({
	type: Object,
	default: {},
});

// Whether any screenings have been provided.
const haveScreenings = computed(() => isNonEmptyArray(props.screenings));

// Initialise our selected screenings.
if (haveScreenings.value) {
	props.screenings.forEach(screening => {
		selectedScreenings.value[screening.id] = false;
	});
}
</script>
