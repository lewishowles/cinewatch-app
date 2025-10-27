import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { ref } from "vue";

import useFilmFinder from "./use-film-finder.js";

const { mockGet } = vi.hoisted(() => {
	return { mockGet: vi.fn() };
});

vi.mock("@/composables/use-api/use-api", () => ({
	default: () => ({
		get: mockGet,
		isLoading: ref(false),
		isReady: ref(false),
	}),
}));

describe("use-film-finder", () => {
	console.error = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();

		const { data } = useFilmFinder();

		data.value = null;
	});

	test("Initialises", () => {
		const response = useFilmFinder();

		expect(response).toBeTypeOf("object");
	});

	describe("Computed", () => {
		describe("totalFilmsCount", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["number (positive)", 1],
				["number (negative)", -1],
				["number (NaN)", NaN],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["array (empty)", []],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["null", null],
				["undefined", undefined],
			])("%s", ([, films]) => {
				const { data, totalFilmsCount } = useFilmFinder();

				data.value = { films };

				expect(totalFilmsCount.value).toBe(0);
			});

			test("Appropriately counts films", () => {
				const sampleFilms = [{ id: 1 }, { id: 2 }, { id: 3 }];
				const { data, totalFilmsCount } = useFilmFinder();

				data.value = { films: sampleFilms };

				expect(totalFilmsCount.value).toBe(3);
			});
		});

		describe("showingFilms", () => {
			test("Discards films with no screenings", () => {
				const sampleFilms = [
					{ id: 1, screenings: [{}] },
					{ id: 2, screenings: [] },
					{ id: 3 },
				];

				const { data, showingFilms } = useFilmFinder();

				data.value = { films: sampleFilms };

				expect(showingFilms.value).toEqual([{ id: 1, screenings: [{}] }]);
			});
		});

		describe("showingFilmsCount", () => {
			test("Counts films that have screenings", () => {
				const sampleFilms = [
					{ id: 1, screenings: [{}] },
					{ id: 2, screenings: [] },
					{ id: 3 },
				];

				const { data, showingFilmsCount } = useFilmFinder();

				data.value = { films: sampleFilms };

				expect(showingFilmsCount.value).toBe(1);
			});

			test("Allows for films that have no screenings", () => {
				const sampleFilms = [
					{ id: 2, screenings: [] },
					{ id: 3 },
				];

				const { data, showingFilmsCount } = useFilmFinder();

				data.value = { films: sampleFilms };

				expect(showingFilmsCount.value).toBe(0);
			});
		});

		describe("haveShowingFilms", () => {
			test("Counts films that have screenings", () => {
				const sampleFilms = [
					{ id: 1, screenings: [{}] },
					{ id: 2, screenings: [] },
					{ id: 3 },
				];

				const { data, haveShowingFilms } = useFilmFinder();

				data.value = { films: sampleFilms };

				expect(haveShowingFilms.value).toBe(true);
			});

			test("Allows for films that have no screenings", () => {
				const sampleFilms = [
					{ id: 2, screenings: [] },
					{ id: 3 },
				];

				const { data, haveShowingFilms } = useFilmFinder();

				data.value = { films: sampleFilms };

				expect(haveShowingFilms.value).toBe(false);
			});
		});

		describe("upcomingFilms", () => {
			test("Discards films with screenings", () => {
				const sampleFilms = [
					{ id: 1, screenings: [{}] },
					{ id: 2, screenings: [] },
					{ id: 3 },
					{ id: 4, screenings: null },
				];

				const { data, upcomingFilms } = useFilmFinder();

				data.value = { films: sampleFilms };

				expect(upcomingFilms.value).toEqual([
					{ id: 2, screenings: [] },
					{ id: 3 },
					{ id: 4, screenings: null },
				]);
			});
		});

		describe("upcomingFilmsCount", () => {
			test("Counts films that do not have screenings", () => {
				const sampleFilms = [
					{ id: 1, screenings: [{}] },
					{ id: 2, screenings: [] },
					{ id: 3 },
					{ id: 4, screenings: null },
				];

				const { data, upcomingFilmsCount } = useFilmFinder();

				data.value = { films: sampleFilms };

				expect(upcomingFilmsCount.value).toBe(3);
			});

			test("Allows for films that have screenings", () => {
				const sampleFilms = [{ id: 1, screenings: [{}] }];

				const { data, upcomingFilmsCount } = useFilmFinder();

				data.value = { films: sampleFilms };

				expect(upcomingFilmsCount.value).toBe(0);
			});
		});

		describe("haveUpcomingFilms", () => {
			test("Counts films that do not have screenings", () => {
				const sampleFilms = [
					{ id: 1, screenings: [{}] },
					{ id: 2, screenings: [] },
					{ id: 3 },
					{ id: 4, screenings: null },
				];

				const { data, haveUpcomingFilms } = useFilmFinder();

				data.value = { films: sampleFilms };

				expect(haveUpcomingFilms.value).toBe(true);
			});

			test("Allows for films that have screenings", () => {
				const sampleFilms = [{ id: 1, screenings: [{}] }];

				const { data, haveUpcomingFilms } = useFilmFinder();

				data.value = { films: sampleFilms };

				expect(haveUpcomingFilms.value).toBe(false);
			});
		});
	});

	describe("Methods", () => {
		describe("findFilms", () => {
			const sampleResponse = {
				branch: {
					name: "Test Branch",
					description: "A description",
					dates: [
						{
							day: "Today",
							date: "2025-10-20",
						},
					],
				},
				films: [{ id: 1, title: "Film One" }],
			};

			test("Calls the appropriate API and populates branch and films", async () => {
				mockGet.mockResolvedValueOnce(sampleResponse);

				const { findFilms, branch, films, haveBranch, haveFilms } = useFilmFinder();

				expect(branch.value).toEqual(null);
				expect(haveBranch.value).toBe(false);
				expect(films.value).toBeNull();
				expect(haveFilms.value).toBe(false);

				await findFilms("/some/url");
				await flushPromises();

				expect(mockGet).toHaveBeenCalledWith("cineworld/films", { url: "/some/url" });

				expect(branch.value).toEqual(sampleResponse.branch);
				expect(films.value).toEqual(sampleResponse.films);
				expect(haveBranch.value).toBe(true);
				expect(haveFilms.value).toBe(true);
			});

			test("Handles an API error", async () => {
				mockGet.mockResolvedValueOnce(null);

				const { findFilms, films, haveFilms, branch, haveBranch } = useFilmFinder();

				await expect(findFilms("/bad/url")).rejects.toThrow();
				await flushPromises();

				expect(branch.value).toEqual(null);
				expect(haveBranch.value).toBe(false);
				expect(films.value).toBeNull();
				expect(haveFilms.value).toBe(false);
			});
		});
	});
});
