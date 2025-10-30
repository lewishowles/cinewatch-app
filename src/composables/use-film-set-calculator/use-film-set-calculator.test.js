import { afterEach, describe, expect, test } from "vitest";
import useFilmSetCalculator from "./use-film-set-calculator.js";
import useFilmFinder from "@/composables/use-film-finder/use-film-finder.js";

describe("use-film-set-calculator", () => {
	const sampleFilms = [
		{
			id: "1",
			screenings: [
				{
					id: "10",
					label: "2D",
					times: [
						{ start: { label: "10:00" }, end: { label: "12:00" } },
						{ start: { label: "12:00" }, end: { label: "14:00" } },
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
					times: [{ start: { label: "14:00" }, end: { label: "16:00" } }],
				},
				{
					id: "12",
					label: "3D",
					times: [
						{ start: { label: "10:00" }, end: { label: "12:00" } },
						{ start: { label: "13:00" }, end: { label: "15:00" } },
					],
				},
			],
		},
	];

	afterEach(() => {
		const { filmScreeningTypes } = useFilmSetCalculator();

		filmScreeningTypes.value = {};
	});

	test("A composable should exist", () => {
		const response = useFilmSetCalculator();

		expect(response).toBeTypeOf("object");
	});

	describe("Computed", () => {
		describe("selectedFilmScreeningTypes", () => {
			test("Selected screening types are returned", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, selectedFilmScreeningTypes } = useFilmSetCalculator();

				data.value = { films: sampleFilms };
				filmScreeningTypes.value = { 1: { 10: true }, 2: { 11: false, 12: true } };

				expect(selectedFilmScreeningTypes.value).toEqual({ 1: ["10"], 2: ["12"] });
			});

			test("No types are returned if no types are selected", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, selectedFilmScreeningTypes } = useFilmSetCalculator();

				data.value = { films: sampleFilms };
				filmScreeningTypes.value = { 1: { 10: false }, 2: { 11: false, 12: false } };

				expect(selectedFilmScreeningTypes.value).toEqual({});
			});
		});

		describe("selectedFilms", () => {
			test("Selected films are returned", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, selectedFilms } = useFilmSetCalculator();

				data.value = { films: sampleFilms };
				filmScreeningTypes.value = { 1: { 10: true }, 2: { 11: false, 12: true } };

				expect(selectedFilms.value).toEqual(sampleFilms);
			});

			test("No films are returned if no screenings are selected", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, selectedFilms } = useFilmSetCalculator();

				data.value = { films: sampleFilms };
				filmScreeningTypes.value = {};

				expect(selectedFilms.value).toEqual([]);
			});
		});

		describe("selectedFilmsCount", () => {
			test("Counts selected films", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, selectedFilmsCount } = useFilmSetCalculator();

				data.value = { films: sampleFilms };
				filmScreeningTypes.value = { 1: { 10: true }, 2: { 11: false, 12: true } };

				expect(selectedFilmsCount.value).toEqual(2);
			});

			test("Ignores films that are not selected", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, selectedFilmsCount } = useFilmSetCalculator();

				data.value = { films: sampleFilms };
				filmScreeningTypes.value = {};

				expect(selectedFilmsCount.value).toEqual(0);
			});
		});

		describe("selectedFilmTimes", () => {
			test("Returns appropriate times for the selected films", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, selectedFilmTimes } = useFilmSetCalculator();

				data.value = { films: sampleFilms };
				filmScreeningTypes.value = { 1: { 10: true }, 2: { 12: true } };

				expect(selectedFilmTimes.value).toEqual([
					{
						id: "1",
						times: [
							{ start: { label: "10:00" }, end: { label: "12:00" }, type: "2D" },
							{ start: { label: "12:00" }, end: { label: "14:00" }, type: "2D" },
						],
					},
					{
						id: "2",
						times: [
							{ start: { label: "10:00" }, end: { label: "12:00" }, type: "3D" },
							{ start: { label: "13:00" }, end: { label: "15:00" }, type: "3D" },
						],
					},
				]);
			});

			test("Returns an empty array if no films are selected", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, selectedFilmTimes } = useFilmSetCalculator();

				data.value = { films: sampleFilms };
				filmScreeningTypes.value = {};

				expect(selectedFilmTimes.value).toEqual([]);
			});

			test("Ignores screenings with an invalid screening ID", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, selectedFilmTimes } = useFilmSetCalculator();

				data.value = { films: sampleFilms };
				filmScreeningTypes.value = { 1: { 99: true } };

				expect(selectedFilmTimes.value).toEqual([]);
			});

			test("Ignores screenings with no times", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, selectedFilmTimes } = useFilmSetCalculator();

				data.value = {
					films: [
						{
							id: "1",
							screenings: [{ id: "10", label: "Empty", times: [] }],
						},
					],
				};

				filmScreeningTypes.value = { 1: { 10: true } };

				expect(selectedFilmTimes.value).toEqual([]);
			});

			test("Ignores films with no screenings", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, selectedFilmTimes } = useFilmSetCalculator();

				data.value = {
					films: [{ id: "1" }],
				};

				filmScreeningTypes.value = { 1: { 10: true } };

				expect(selectedFilmTimes.value).toEqual([]);
			});
		});
	});

	describe("Methods", () => {
		describe("resetFilmSets", () => {
			test("Should reset film screening types", () => {
				const { filmScreeningTypes, resetFilmSets } = useFilmSetCalculator();

				filmScreeningTypes.value = { 1: { 10: true } };

				resetFilmSets();

				expect(filmScreeningTypes.value).toEqual({});
			});
		});
	});
});
