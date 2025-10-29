import { describe, expect, test } from "vitest";
import useStageManager from "./use-stage-manager.js";

describe("use-stage-manager", () => {
	test("A composable should exist", () => {
		const response = useStageManager();

		expect(response).toBeTypeOf("object");
		expect(response).toHaveProperty("isSearch");
		expect(response).toHaveProperty("isList");
		expect(response).toHaveProperty("isSets");
		expect(response).toHaveProperty("goToSearch");
		expect(response).toHaveProperty("goToList");
		expect(response).toHaveProperty("goToSets");
	});

	test("Initial state is \"search\"", () => {
		const { isSearch, isList, isSets } = useStageManager();

		expect(isSearch.value).toBe(true);
		expect(isList.value).toBe(false);
		expect(isSets.value).toBe(false);
	});

	describe("Methods", () => {
		describe("goToList", () => {
			test("Switches to the list stage", () => {
				const { isSearch, isList, isSets, goToList } = useStageManager();

				goToList();

				expect(isSearch.value).toBe(false);
				expect(isList.value).toBe(true);
				expect(isSets.value).toBe(false);
			});
		});

		describe("goToSets", () => {
			test("Switches to the sets stage", () => {
				const { isSearch, isList, isSets, goToSets } = useStageManager();

				goToSets();

				expect(isSearch.value).toBe(false);
				expect(isList.value).toBe(false);
				expect(isSets.value).toBe(true);
			});
		});

		describe("goToSearch", () => {
			test("Switches back to the search stage", () => {
				const { isSearch, isList, isSets, goToList, goToSearch } = useStageManager();

				goToList();

				expect(isList.value).toBe(true);

				goToSearch();

				expect(isSearch.value).toBe(true);
				expect(isList.value).toBe(false);
				expect(isSets.value).toBe(false);
			});
		});

		describe("reset", () => {
			test("Switches back to the initial stage", () => {
				const { isSearch, isList, isSets, goToSets, reset } = useStageManager();

				goToSets();

				expect(isSets.value).toBe(true);

				reset();

				expect(isSearch.value).toBe(true);
				expect(isList.value).toBe(false);
				expect(isSets.value).toBe(false);
			});
		});
	});
});
