import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import useFilmFinder from "@/composables/use-film-finder/use-film-finder.js";
import useFilmSetCalculator from "@/composables/use-film-set-calculator/use-film-set-calculator.js";

import FilmSets from "./film-sets.vue";

const mount = createMount(FilmSets);

const sampleFilms = [
	{
		id: "1",
		screenings: [
			{
				id: "10",
				label: "2D",
				times: [
					{
						start: { label: "10:00", value: "2025-10-29T10:00:00.000Z" },
						end: { label: "12:00", value: "2025-10-29T12:00:00.000Z" },
					},
					{
						start: { label: "12:30", value: "2025-10-29T12:30:00.000Z" },
						end: { label: "14:00", value: "2025-10-29T14:00:00.000Z" },
					},
				],
			},
		],
	},
	{
		id: "2",
		screenings: [
			{
				id: "11",
				label: "IMAX",
				times: [
					{
						start: { label: "14:30", value: "2025-10-29T14:30:00.000Z" },
						end: { label: "16:00", value: "2025-10-29T16:00:00.000Z" },
					},
				],
			},
			{
				id: "12",
				label: "3D",
				times: [
					{
						start: { label: "16:30", value: "2025-10-29T16:30:00.000Z" },
						end: { label: "18:00", value: "2025-10-29T18:00:00.000Z" },
					},
				],
			},
		],
	},
];

describe("film-sets", () => {
	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("usableFilmSets", () => {
			test("Accounts for an empty film set", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.usableFilmSets).toEqual([]);
			});

			test("Excludes film sets with just one film", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, filmSets } = useFilmSetCalculator();

				data.value = { films: sampleFilms };
				filmScreeningTypes.value = { 1: { 10: true }, 2: { 11: true, 12: true } };

				const wrapper = mount();
				const vm = wrapper.vm;

				expect(filmSets.value).toHaveLength(6);
				expect(vm.usableFilmSets).toHaveLength(2);
			});
		});
	});
});
