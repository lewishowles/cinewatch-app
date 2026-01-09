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

	describe("Methods", () => {
		describe("isDateSelected", () => {
			describe("An invalid date is always false", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (empty)", ""],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["array (non-empty)", [1, 2, 3]],
					["array (empty)", []],
					["null", null],
					["undefined", undefined],
				])("%s", ([, input]) => {
					expect(vm.isDateSelected(input, 0)).toBe(false);
				});
			});

			test("A date matches the selected date", () => {
				const { data } = useFilmFinder();

				data.value = {
					selected_date: "2000-01-01",
				};

				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.isDateSelected("2000-01-01", 0)).toBe(true);
			});

			test("A date does not match the selected date", () => {
				const { data } = useFilmFinder();

				data.value = {
					selected_date: "2000-01-01",
				};

				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.isDateSelected("2000-01-02", 0)).toBe(false);
			});

			test("No selected date is present and we choose the first date", () => {
				const { data } = useFilmFinder();

				data.value = {
					selected_date: null,
				};

				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.isDateSelected("2000-01-01", 0)).toBe(true);
			});

			test("No selected date is present and we choose a date after the first", () => {
				const { data } = useFilmFinder();

				data.value = {
					selected_date: null,
				};

				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.isDateSelected("2000-01-01", 2)).toBe(false);
			});
		});
	});
});
