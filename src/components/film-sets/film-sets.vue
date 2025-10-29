<template>
	<pre>{{ selectedFilmTimes }}</pre>
</template>

<script setup>
import useFilmSetCalculator from "@/composables/use-film-set-calculator/use-film-set-calculator";

const { selectedFilmTimes } = useFilmSetCalculator();
</script>
