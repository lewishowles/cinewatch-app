import { afterEach, describe, expect, test } from "vitest";
import { createMount } from "@unit/support/mount";
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
						start: { label: "20:30", value: "2025-10-29T20:30:00.000Z" },
						end: { label: "22:00", value: "2025-10-29T22:00:00.000Z" },
					},
				],
			},
		],
	},
	{
		id: "3",
		screenings: [
			{
				id: "13",
				label: "2D",
				times: [
					{
						start: { label: "12:30", value: "2025-10-29T12:30:00.000Z" },
						end: { label: "14:00", value: "2025-10-29T14:00:00.000Z" },
					},
				],
			},
		],
	},
	{
		id: "4",
		screenings: [
			{
				id: "14",
				label: "2D",
				times: [
					{
						start: { label: "08:30", value: "2025-10-29T08:30:00.000Z" },
						end: { label: "10:00", value: "2025-10-29T10:00:00.000Z" },
					},
				],
			},
		],
	},
];

describe("film-sets", () => {
	afterEach(() => {
		const { filmScreeningTypes } = useFilmSetCalculator();

		filmScreeningTypes.value = {};
	});

	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("fullFilmSets", () => {
			test("Accounts for an empty film set", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.fullFilmSets).toEqual([]);
			});

			test("Only includes sets with all films", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, filmSets } = useFilmSetCalculator();

				data.value = { films: sampleFilms };

				filmScreeningTypes.value = {
					1: { 10: true }, 2: { 11: true, 12: true }, 4: { 14: true },
				};

				const wrapper = mount();
				const vm = wrapper.vm;

				expect(filmSets.value).toHaveLength(7);
				expect(vm.fullFilmSets).toHaveLength(1);
			});
		});

		describe("partialFilmSets", () => {
			test("Accounts for an empty film set", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.partialFilmSets).toEqual([]);
			});

			test("Excludes film sets with all films, and those with just one film", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, filmSets } = useFilmSetCalculator();

				data.value = { films: sampleFilms };

				filmScreeningTypes.value = {
					1: { 10: true }, 2: { 11: true, 12: true }, 3: { 13: true }, 4: { 14: true },
				};

				const wrapper = mount();
				const vm = wrapper.vm;

				expect(filmSets.value).toHaveLength(10);
				expect(vm.partialFilmSets).toHaveLength(5);
			});
		});
	});
});
