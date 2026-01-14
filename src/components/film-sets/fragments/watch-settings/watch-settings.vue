<template>
	<div class="flex flex-wrap items-center space-between gap-x-4 gap-y-2 bg-grey-50 border border-grey-300 px-6 py-4 rounded-md text-sm watch-settings" data-test="watch-settings">
		<ul class="contents" data-test="watch-settings-current-settings">
			<li>{{ minimumFilmGapMinutes }} minute gap</li>
			<li>Earliest start: {{ earliestStartTime || "Any" }}</li>
			<li>Latest end: {{ latestEndTime || "Any" }}</li>
		</ul>

		<ui-button class="button--muted md:ms-auto" icon-start="icon-cog" @click="openModal(WatchSettingsDialog)">
			Update preferences
		</ui-button>
	</div>
</template>

<script setup>
import useFilmSetCalculator from "@/composables/use-film-set-calculator/use-film-set-calculator";
import { useModalDialog } from "@lewishowles/components";

import WatchSettingsDialog from "./dialogs/watch-settings-dialog/watch-settings-dialog.vue";

const { minimumFilmGapMinutes, earliestStartTime, latestEndTime } = useFilmSetCalculator();
const { openModal } = useModalDialog();
</script>

<style>
@reference "../../../../assets/css/main.css";

.watch-settings li + li {
	@apply flex items-center gap-4;

	&::before {
		content: "•";
	}
}
</style>
