import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FilmSets from "./film-sets.vue";

const mount = createMount(FilmSets);

describe("film-sets", () => {
	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
