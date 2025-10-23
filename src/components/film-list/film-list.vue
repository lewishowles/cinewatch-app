<template>
	<page-header v-if="haveBranch">
		{{ branch.name }}

		<template #introduction>
			{{ branch.description }}
		</template>

		<template #actions>
			<ui-button icon-start="icon-arrow-left" class="button--muted" @click="goToSearch">
				Choose another branch
			</ui-button>
		</template>
	</page-header>

	<pre>{{ haveFilms }}</pre>
	<pre>{{ films }}</pre>
</template>

<script setup>
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";
import useStageManager from "@/composables/use-stage-manager/use-stage-manager";


import PageHeader from "@/components/layout/page-header/page-header.vue";

// The branch and film details retrieved by our film finder.
const { branch, haveBranch, films, haveFilms } = useFilmFinder();
// Allow the user to go back and pick another branch.
const { goToSearch } = useStageManager();
</script>
