import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FilmFinder from "./film-finder.vue";

const mount = createMount(FilmFinder);

describe("film-finder", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
