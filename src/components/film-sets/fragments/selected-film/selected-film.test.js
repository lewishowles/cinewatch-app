import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import useFilmSetCalculator from "@/composables/use-film-set-calculator/use-film-set-calculator.js";
import SelectedFilm from "./selected-film.vue";

const mount = createMount(SelectedFilm);

describe("selected-film", () => {
	const sampleFilm = {
		id: "1",
		title: "Sample film",
		poster: {
			url: "path/to/poster",
		},
		screenings: [
			{
				id: "10",
				label: "2D",
			},
			{
				id: "11",
				label: "3D",
			},
			{
				id: "12",
				label: "IMAX 2D",
			},
		],
	};

	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount({ film: sampleFilm });

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("selectedScreeningTypeIDs", () => {
			test("Returns the selected screening type IDs for the current film", () => {
				const { filmScreeningTypes } = useFilmSetCalculator();

				const wrapper = mount({ film: sampleFilm });
				const vm = wrapper.vm;

				filmScreeningTypes.value = { 1: { 10: true }, 2: { 11: false, 12: true } };

				expect(vm.selectedScreeningTypeIDs).toEqual(["10"]);
			});
		});

		describe("selectedScreeningTypes", () => {
			test("Returns the selected screening type labels for the current film", () => {
				const { filmScreeningTypes } = useFilmSetCalculator();

				const wrapper = mount({ film: sampleFilm });
				const vm = wrapper.vm;

				filmScreeningTypes.value = { 1: { 10: true, 12: true }, 2: { 11: false } };

				expect(vm.selectedScreeningTypes).toEqual("2D • IMAX 2D");
			});
		});
	});
});
