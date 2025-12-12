import { describe, expect, test } from "vitest";
import { parseTimeStringToDate, getMillisecondsBetweenDateStrings, isTimeAfterTime } from "./helpers";

describe("helpers", () => {
	describe("parseTimeStringToDate", () => {
		describe("Detects an invalid date string", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["number (positive)", 1],
				["number (negative)", -1],
				["number (NaN)", NaN],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["array (non-empty)", [1, 2, 3]],
				["array (empty)", []],
				["null", null],
				["undefined", undefined],
			])("%s", ([, input]) => {
				expect(parseTimeStringToDate(input)).toBe(null);
			});
		});

		test("Discards a string that does not contain a colon", () => {
			expect(parseTimeStringToDate("1630")).toBe(null);
		});

		test("Discards a string of an invalid length", () => {
			expect(parseTimeStringToDate("16:300")).toBe(null);
		});

		test("Parses a valid time string", () => {
			const today = new Date();
			const date = parseTimeStringToDate("16:30");

			expect(date.getHours()).toBe(16);
			expect(date.getMinutes()).toBe(30);
			expect(date.getDate() === today.getDate());
			expect(date.getDay() === today.getDay());
			expect(date.getMonth() === today.getMonth());
			expect(date.getFullYear() === today.getFullYear());
		});

		test("Allows the leading zero on an hour to be included", () => {
			const today = new Date();
			const date = parseTimeStringToDate("05:30");

			expect(date.getHours()).toBe(5);
			expect(date.getMinutes()).toBe(30);
			expect(date.getDate() === today.getDate());
			expect(date.getDay() === today.getDay());
			expect(date.getMonth() === today.getMonth());
			expect(date.getFullYear() === today.getFullYear());
		});

		test("Allows the leading zero on an hour to be excluded", () => {
			const today = new Date();
			const date = parseTimeStringToDate("5:30");

			expect(date.getHours()).toBe(5);
			expect(date.getMinutes()).toBe(30);
			expect(date.getDate()).toBe(today.getDate());
			expect(date.getDay()).toBe(today.getDay());
			expect(date.getMonth()).toBe(today.getMonth());
			expect(date.getFullYear()).toBe(today.getFullYear());
		});

		test("Uses a provided comparison date", () => {
			const date = parseTimeStringToDate("16:30", new Date("2000-01-01T00:00:00Z"));

			expect(date.getHours()).toBe(16);
			expect(date.getMinutes()).toBe(30);
			expect(date.getDate()).toBe(1);
			expect(date.getDay()).toBe(6);
			expect(date.getMonth()).toBe(0);
			expect(date.getFullYear()).toBe(2000);
		});

		test("Detects an invalid hour", () => {
			expect(parseTimeStringToDate("32:30")).toBe(null);
		});

		test("Detects an invalid minute", () => {
			expect(parseTimeStringToDate("16:75")).toBe(null);
		});
	});

	describe("getMillisecondsBetweenDateStrings", () => {
		const firstDateString = "2000-01-01T00:00:00.000Z";
		const secondDateString = "2000-01-01T02:00:00.000Z";

		test("Determines the total wait time between two times in milliseconds", () => {
			expect(getMillisecondsBetweenDateStrings(firstDateString, secondDateString)).toBe(7200000);
		});

		test("The order of times is irrelevant", () => {
			expect(getMillisecondsBetweenDateStrings(secondDateString, firstDateString)).toBe(7200000);
		});

		test("The order of times is relevant when absolute is disallowed", () => {
			expect(getMillisecondsBetweenDateStrings(secondDateString, firstDateString, false)).toBe(-7200000);
		});

		test("Handles times that match", () => {
			expect(getMillisecondsBetweenDateStrings(firstDateString, firstDateString)).toBe(0);
		});

		test("Handles an invalid date string", () => {
			expect(getMillisecondsBetweenDateStrings("invalid", secondDateString)).toBe(null);
			expect(getMillisecondsBetweenDateStrings(firstDateString, "invalid")).toBe(null);
			expect(getMillisecondsBetweenDateStrings("invalid", "invalid")).toBe(null);
		});

		describe("Anything but a non-empty string is handled", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["number (positive)", 1],
				["number (negative)", -1],
				["number (NaN)", NaN],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["array (non-empty)", [1, 2, 3]],
				["array (empty)", []],
				["null", null],
				["undefined", undefined],
			])("%s", ([, input]) => {
				expect(getMillisecondsBetweenDateStrings(input, secondDateString)).toBe(null);
				expect(getMillisecondsBetweenDateStrings(firstDateString, input)).toBe(null);
				expect(getMillisecondsBetweenDateStrings(input, input)).toBe(null);
			});
		});
	});

	describe("isTimeAfterTime", () => {
		const firstDateString = "2000-01-01T00:00:00.000Z";
		const secondDateString = "2000-01-01T02:00:00.000Z";

		test("Two times can follow each other", () => {
			expect(isTimeAfterTime(firstDateString, secondDateString, 20)).toBe(true);
		});

		test("The order of times is relevant", () => {
			expect(isTimeAfterTime(secondDateString, firstDateString, 20)).toBe(false);
		});

		test("The minimum gap affects time suitability", () => {
			expect(isTimeAfterTime(firstDateString, secondDateString, 121)).toBe(false);
		});

		test("Handles an invalid date string", () => {
			expect(isTimeAfterTime("invalid", secondDateString, 20)).toBe(false);
			expect(isTimeAfterTime(firstDateString, "invalid", 20)).toBe(false);
			expect(isTimeAfterTime("invalid", "invalid", 20)).toBe(false);
		});

		describe("Anything but a non-empty date string is handled", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["number (positive)", 1],
				["number (negative)", -1],
				["number (NaN)", NaN],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["array (non-empty)", [1, 2, 3]],
				["array (empty)", []],
				["null", null],
				["undefined", undefined],
			])("%s", ([, input]) => {
				expect(isTimeAfterTime(input, secondDateString, 20)).toBe(false);
				expect(isTimeAfterTime(firstDateString, input, 20)).toBe(false);
				expect(isTimeAfterTime(input, input, 20)).toBe(false);
			});
		});
	});
});
