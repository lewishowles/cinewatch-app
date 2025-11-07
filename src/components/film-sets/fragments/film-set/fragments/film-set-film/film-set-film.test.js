import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FilmSetFilm from "./film-set-film.vue";

const mount = createMount(FilmSetFilm);

describe("film-set-film", () => {
	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
