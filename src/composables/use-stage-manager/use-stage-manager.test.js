import { describe, expect, test } from "vitest";
import useStageManager from "./use-stage-manager.js";

describe("use-stage-manager", () => {
	test("A composable should exist", () => {
		const response = useStageManager();

		expect(response).toBeTypeOf("object");
		expect(response).toHaveProperty("isSearch");
		expect(response).toHaveProperty("isResults");
		expect(response).toHaveProperty("isDetails");
		expect(response).toHaveProperty("goToSearch");
		expect(response).toHaveProperty("goToResults");
		expect(response).toHaveProperty("goToDetails");
	});

	test("Initial state is \"search\"", () => {
		const { isSearch, isResults, isDetails } = useStageManager();

		expect(isSearch.value).toBe(true);
		expect(isResults.value).toBe(false);
		expect(isDetails.value).toBe(false);
	});

	describe("Methods", () => {
		describe("goToResults", () => {
			test("Switches to the results stage", () => {
				const { isSearch, isResults, isDetails, goToResults } = useStageManager();

				goToResults();

				expect(isSearch.value).toBe(false);
				expect(isResults.value).toBe(true);
				expect(isDetails.value).toBe(false);
			});
		});

		describe("goToDetails", () => {
			test("Switches to the details stage", () => {
				const { isSearch, isResults, isDetails, goToDetails } = useStageManager();

				goToDetails();

				expect(isSearch.value).toBe(false);
				expect(isResults.value).toBe(false);
				expect(isDetails.value).toBe(true);
			});
		});

		describe("goToSearch", () => {
			test("Switches back to the search stage", () => {
				const { isSearch, isResults, isDetails, goToResults, goToSearch } = useStageManager();

				goToResults();

				expect(isResults.value).toBe(true);

				goToSearch();

				expect(isSearch.value).toBe(true);
				expect(isResults.value).toBe(false);
				expect(isDetails.value).toBe(false);
			});
		});

		describe("reset", () => {
			test("Switches back to the initial stage", () => {
				const { isSearch, isResults, isDetails, goToDetails, reset } = useStageManager();

				goToDetails();

				expect(isDetails.value).toBe(true);

				reset();

				expect(isSearch.value).toBe(true);
				expect(isResults.value).toBe(false);
				expect(isDetails.value).toBe(false);
			});
		});
	});
});
