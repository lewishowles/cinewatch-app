import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import ShowingFilm from "./showing-film.vue";

const mount = createMount(ShowingFilm);

describe("showing-film", () => {
	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
