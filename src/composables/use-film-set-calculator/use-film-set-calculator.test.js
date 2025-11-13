import { afterEach, describe, expect, test } from "vitest";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import useFilmSetCalculator from "./use-film-set-calculator.js";
import useFilmFinder from "@/composables/use-film-finder/use-film-finder.js";

/**
 * Calculate the total wait time for a given path.
 */
function calculateTotalWaitTimeForSet(set) {
	return set.path.slice(1).reduce((accumulator, current, i) => {
		const previous = set.path[i];

		const start = new Date(previous.end.value);
		const end = new Date(current.start.value);

		return accumulator + (end.getTime() - start.getTime());
	}, 0);
}

describe("use-film-set-calculator", () => {
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
							{
								start: { label: "10:00", value: "2025-10-29T10:00:00.000Z" },
								end: { label: "12:00", value: "2025-10-29T12:00:00.000Z" },
								screening_type: "2D",
							},
							{
								start: { label: "12:30", value: "2025-10-29T12:30:00.000Z" },
								end: { label: "14:00", value: "2025-10-29T14:00:00.000Z" },
								screening_type: "2D",
							},
						],
					},
					{
						id: "2",
						times: [
							{
								start: { label: "16:30", value: "2025-10-29T16:30:00.000Z" },
								end: { label: "18:00", value: "2025-10-29T18:00:00.000Z" },
								screening_type: "3D",
							},
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

		describe("filmGraph", () => {
			test("Builds nodes and edges correctly for selected films", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, filmGraph } = useFilmSetCalculator();

				data.value = { films: sampleFilms };
				filmScreeningTypes.value = { 1: { 10: true }, 2: { 12: true } };

				// Should flatten into nodes
				expect(Array.isArray(filmGraph.value.nodes)).toBe(true);
				expect(filmGraph.value.nodes.length).toBeGreaterThan(0);

				// Each node should have a film_id
				filmGraph.value.nodes.forEach(node => {
					expect(isNonEmptyString(node.film_id)).toBe(true);
				});

				// Edges should be a Map keyed by node
				expect(filmGraph.value.edges instanceof Map).toBe(true);
			});

			test("Returns an empty array if no films are selected", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, filmGraph } = useFilmSetCalculator();

				data.value = { films: sampleFilms };
				filmScreeningTypes.value = {};

				expect(filmGraph.value).toEqual([]);
			});

			test("Returns an empty array invalid films are selected", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, filmGraph } = useFilmSetCalculator();

				data.value = { films: [] };
				filmScreeningTypes.value = { 1: { 10: true }, 2: { 12: true } };

				expect(filmGraph.value).toEqual([]);
			});
		});

		describe("filmSets", () => {
			test("Generates valid paths across films with correct wait times", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, filmSets } = useFilmSetCalculator();

				data.value = { films: sampleFilms };
				// Select screenings that can follow each other
				filmScreeningTypes.value = { 1: { 10: true }, 2: { 11: true, 12: true } };

				// Should generate multiple paths
				expect(filmSets.value.length).toBe(6);

				filmSets.value.forEach((set, index) => {
					expect(set).toHaveProperty("films_seen");
					expect(set).toHaveProperty("path");
					expect(set).toHaveProperty("total_wait");
					expect(set.films_seen).toBe(set.path.length);
					expect(set.continuous_index).toBe(index + 1);

					// Check for chronological order of films.
					for (let i = 1; i < set.path.length; i++) {
						const previous = set.path[i - 1];
						const current = set.path[i];

						expect((new Date(current.start.value)) >= (new Date(previous.end.value))).toBe(true);
					}

					// Check for wait time consistency.
					expect(set.total_wait).toBe(calculateTotalWaitTimeForSet(set));
				});

				// Find a path that goes Film 1 (12:30–14:00) → Film 2
				// (14:30–16:00)
				const path = filmSets.value.find(r =>
					r.path.some(p => p.film_id === "1" && p.start.label === "12:30") &&
					r.path.some(p => p.film_id === "2" && p.start.label === "14:30"),
				);

				expect(path).toBeDefined();
				expect(path.films_seen).toBe(2);

				// Check wait time between 14:00 and 14:30 = 30 minutes
				expect(path.total_wait).toBe(30 * 60 * 1000);
			});

			test("Returns single-film paths when no valid transitions exist", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, filmSets } = useFilmSetCalculator();

				data.value = { films: sampleFilms };
				// Only select Film 1
				filmScreeningTypes.value = { 1: { 10: true } };

				const sets = filmSets.value;

				expect(sets.length).toBeGreaterThan(0);

				sets.forEach(result => {
					expect(result.films_seen).toEqual(1);
				});
			});

			test("Handles empty films gracefully", () => {
				const { data } = useFilmFinder();
				const { filmScreeningTypes, filmSets } = useFilmSetCalculator();

				data.value = { films: [] };
				filmScreeningTypes.value = {};

				expect(filmSets.value).toEqual([]);
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
