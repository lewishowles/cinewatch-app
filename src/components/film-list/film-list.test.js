import { afterEach, describe, expect, test, vi } from "vitest";
import { createMount } from "@unit/support/mount";
import useFilmFinder from "@/composables/use-film-finder/use-film-finder.js";

import FilmList from "./film-list.vue";

const mount = createMount(FilmList);

describe("film-list", () => {
	const sampleFilms = [
		{ id: "1", screenings: [{ id: "10" }] },
		{ id: "2", screenings: [{ id: "11" }, { id: "12" }] },
	];

	afterEach(() => {
		vi.restoreAllMocks();

		const { data } = useFilmFinder();

		data.value = null;
	});

	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});

		test("Selected screenings are initialised", () => {
			const { data } = useFilmFinder();

			data.value = { films: sampleFilms };

			const wrapper = mount();
			const vm = wrapper.vm;

			expect(vm.filmScreeningTypes).toEqual({
				1: {},
				2: {},
			});
		});
	});
});
