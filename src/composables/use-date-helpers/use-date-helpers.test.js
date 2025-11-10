import { describe, expect, test } from "vitest";
import useDateHelpers from "./use-date-helpers.js";

describe("use-date-helpers", () => {
	const startDate = new Date("2025-10-29T18:31:00.000Z");
	const endDate = new Date("2025-10-29T20:20:00.000Z");

	test("A composable should exist", () => {
		const response = useDateHelpers();

		expect(response).toBeTypeOf("object");
	});

	describe("Methods", () => {
		describe("dateDifference", () => {
			describe("Handles an invalid date", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["array (non-empty)", [1, 2, 3]],
					["array (empty)", []],
					["null", null],
					["undefined", undefined],
				])("%s", ([, input]) => {
					const { dateDifference } = useDateHelpers();

					expect(dateDifference(startDate, input)).toBe("Unknown");
					expect(dateDifference(input, endDate)).toBe("Unknown");
					expect(dateDifference(input, input)).toBe("Unknown");
				});
			});

			test("Determines the difference between two dates", () => {
				const { dateDifference } = useDateHelpers();

				expect(dateDifference(startDate, endDate)).toBe("1h 49m");
			});

			test("Allows dates to be passed in the incorrect order", () => {
				const { dateDifference } = useDateHelpers();

				expect(dateDifference(endDate, startDate)).toBe("1h 49m");
			});
		});

		describe("millisecondsToHumanTime", () => {
			describe("Handles an invalid input", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["array (non-empty)", [1, 2, 3]],
					["array (empty)", []],
					["null", null],
					["undefined", undefined],
				])("%s", ([, input]) => {
					const { millisecondsToHumanTime } = useDateHelpers();

					expect(millisecondsToHumanTime(input)).toBe("Unknown");
				});
			});

			test("Converts a millisecond value to a human-readable time", () => {
				const { millisecondsToHumanTime } = useDateHelpers();

				expect(millisecondsToHumanTime(6540000)).toBe("1h 49m");
			});

			test("Only includes minutes if necessary", () => {
				const { millisecondsToHumanTime } = useDateHelpers();

				expect(millisecondsToHumanTime(3600000)).toBe("1h");
			});

			test("Only includes hours if necessary", () => {
				const { millisecondsToHumanTime } = useDateHelpers();

				expect(millisecondsToHumanTime(2940000)).toBe("49m");
			});
		});
	});
});
