<template>
	<div v-if="havePath" data-test="film-set">
		<h2 v-if="haveTitle" class="text-lg font-bold text-grey-950 mb-2">
			<slot name="title" />
		</h2>

		<dl class="film-set-metadata flex items-center text-sm gap-2 mb-6">
			<dt>Total time</dt>
			<dd>?h ?m</dd>

			<dt>Starts</dt>
			<dd>??:??</dd>

			<dt>Ends</dt>
			<dd>??:??</dd>

			<dt>Total wait time</dt>
			<dd>?h ?m</dd>
		</dl>

		<ul class="film-set-films flex flex-col gap-6">
			<li v-for="film in set.path" :key="film.id">
				<film-set-film v-bind="{ film }" />
			</li>
		</ul>
	</div>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";

import FilmSetFilm from "./fragments/film-set-film/film-set-film.vue";

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

const slots = useSlots();
// Whether a title has been provided. This is provided by the parent, as the
// parent controls how sets are displayed, and can provide an index to
// differentiate sets.
const haveTitle = computed(() => isNonEmptySlot(slots.title));
// Whether we have a path for this set.
const havePath = computed(() => isNonEmptyArray(props.set.path));
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

.film-set-films {
	@apply relative;

	&::before {
		@apply w-px absolute start-0 inset-y-0 my-5 bg-grey-200 ms-1 -z-1;

		content: "";
	}

	li {
		@apply flex items-center;

		&::before {
			@apply size-[9px] bg-grey-500 rounded-full me-8;

			content: "";
		}
	}
}
</style>
