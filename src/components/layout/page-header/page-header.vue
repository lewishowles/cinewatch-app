<template>
	<div class="flex flex-col gap-4" data-test="page-header">
		<h1 class="text-4xl font-bold text-purple-800" data-test="page-header-title">
			<slot />
		</h1>

		<p v-if="haveIntroduction" class="max-w-prose" data-test="page-header-introduction">
			<slot name="introduction" />
		</p>
	</div>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";

const slots = useSlots();
//
const haveIntroduction = computed(() => isNonEmptySlot(slots.introduction));
</script>
