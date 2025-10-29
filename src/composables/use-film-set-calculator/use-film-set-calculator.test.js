import { afterEach, describe, expect, test } from "vitest";
import useFilmSetCalculator from "./use-film-set-calculator.js";
import useFilmFinder from "@/composables/use-film-finder/use-film-finder.js";

describe("use-film-set-calculator", () => {
	const sampleFilms = [
		{ id: "1", screenings: [{ id: "10" }] },
		{ id: "2", screenings: [{ id: "11" }, { id: "12" }] },
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
	});
});
