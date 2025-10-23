<template>
	<div class="flex flex-col gap-4" data-test="page-header">
		<conditional-wrapper v-bind="{ wrap: haveActions }" class="flex items-center justify-between gap-6">
			<h1 class="text-4xl font-bold text-purple-800" data-test="page-header-title">
				<slot />
			</h1>

			<div v-if="haveActions">
				<slot name="actions" />
			</div>
		</conditional-wrapper>

		<p v-if="haveIntroduction" class="max-w-prose" data-test="page-header-introduction">
			<slot name="introduction" />
		</p>
	</div>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";

const slots = useSlots();
// Whether any content has been provided for the introduction slot.
const haveIntroduction = computed(() => isNonEmptySlot(slots.introduction));
// Whether any content has been provided for the actions slot.
const haveActions = computed(() => isNonEmptySlot(slots.actions));
</script>
