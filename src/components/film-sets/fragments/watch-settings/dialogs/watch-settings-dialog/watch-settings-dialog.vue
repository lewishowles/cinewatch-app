<template>
	<modal-dialog-title>
		Preferences
	</modal-dialog-title>

	<form-layout>
		<form-field v-model="minimumFilmGapMinutes" placeholder="e.g. 20">
			Minimum time between films

			<template #introduction>
				This allows time between films for things like trailers (which make a film end later than advertised).
			</template>

			<template #help>
				A number in minutes, e.g. 20.
			</template>
		</form-field>

		<form-field v-model="earliestStartTime" placeholder="e.g. 14:00">
			Earliest start time

			<template #introduction>
				Films that start after this time will be ignored.
			</template>

			<template #help>
				Enter a 24-hour time (HH:MM). Empty means no preference.
			</template>
		</form-field>

		<form-field v-model="latestEndTime" placeholder="e.g. 22:00">
			Latest end time

			<template #introduction>
				Films that end after this time will be ignored. Note that this does not include the time between films mentioned above, so with trailers a film may finish a little later than listed.
			</template>

			<template #help>
				Enter a 24-hour time (HH:MM). Empty means no preference.
			</template>
		</form-field>
	</form-layout>

	<modal-dialog-actions>
		<ui-button class="button--primary" @click="closeTopModal">
			Save
		</ui-button>
	</modal-dialog-actions>
</template>

<script setup>
import useFilmSetCalculator from "@/composables/use-film-set-calculator/use-film-set-calculator";
import { useModalDialog } from "@lewishowles/components";

const { minimumFilmGapMinutes, earliestStartTime, latestEndTime } = useFilmSetCalculator();
const { closeTopModal } = useModalDialog();
</script>
