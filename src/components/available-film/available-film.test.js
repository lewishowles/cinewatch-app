import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import AvailableFilm from "./available-film.vue";

const mount = createMount(AvailableFilm);

describe("available-film", () => {
	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
