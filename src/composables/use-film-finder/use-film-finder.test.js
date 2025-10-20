import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { ref } from "vue";

// Create a mutable mock for the `get` method so tests can update its behaviour.
const mockGet = vi.fn();

vi.mock("@/composables/use-api/use-api", () => ({
	default: () => ({
		get: mockGet,
		isLoading: ref(false),
		isReady: ref(false),
	}),
}));

import useFilmFinder from "./use-film-finder.js";

describe("use-film-finder", () => {
	console.error = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("Initialises", () => {
		const response = useFilmFinder();

		expect(response).toBeTypeOf("object");
	});

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

			await findFilms("/bad/url");
			await flushPromises();

			expect(branch.value).toEqual(null);
			expect(haveBranch.value).toBe(false);
			expect(films.value).toBeNull();
			expect(haveFilms.value).toBe(false);
		});
	});
});
