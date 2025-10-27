import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FilmScreenings from "./film-screenings.vue";

const mount = createMount(FilmScreenings);

describe("film-screenings", () => {
	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
