import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FilmFinder from "./film-finder.vue";

const mount = createMount(FilmFinder);

describe("film-finder", () => {
	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
