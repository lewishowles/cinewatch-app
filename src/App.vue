<template>
	<header class="mb-18">
		<img src="/logo.svg" alt="Cinewatch" class="h-5" />
	</header>

	<main class="max-w-3xl mx-auto">
		<h1 class="text-4xl text-purple-800 font-bold mb-4">
			Cinewatch
		</h1>

		<p class="max-w-prose">
			Look up listings from your favourite branch of Cineworld, select the films you want to see, and let Cinewatch work out the most efficient way to watch them.
		</p>

		<div class="flex gap-4 items-start mt-10">
			<form-field placeholder="e.g. https://www.cineworld.co.uk/cinemas/ashton-under-lyne/068">
				Cinema listing URL

				<template #help>
					The URL of the page that lists the film times at your chosen cinema, e.g.
					<link-tag href="https://www.cineworld.co.uk/cinemas/ashton-under-lyne/068" :external="true">
						https://www.cineworld.co.uk/cinemas/ashton-under-lyne/068
					</link-tag>
				</template>
			</form-field>

			<ui-button class="button--primary shrink-0 mt-7">
				Find films
			</ui-button>
		</div>
	</main>
</template>

<script setup>
</script>
