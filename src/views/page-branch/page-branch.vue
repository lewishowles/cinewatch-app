<template>
	<loading-indicator v-if="isLoading" v-bind="{ large: true }">
		Loading films…
	</loading-indicator>

	<template v-else>
		<page-header v-if="haveBranch">
			{{ branch.name }}

			<template #introduction>
				{{ branch.description }}
			</template>

			<template #actions>
				<router-link v-slot="{ href, navigate }" v-bind="{ to: { name: 'home' } }" custom>
					<link-tag :href="href" icon-start="icon-arrow-left" class="button--muted" @click="navigate">
						Choose another branch
					</link-tag>
				</router-link>
			</template>
		</page-header>
	</template>

	<pre>{{ haveFilms }}</pre>
	<pre>{{ films }}</pre>
</template>

<script setup>
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";

import PageHeader from "@/components/layout/page-header/page-header.vue";

const { isLoading, branch, haveBranch, films, haveFilms } = useFilmFinder();
</script>
