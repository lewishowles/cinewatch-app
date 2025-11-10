import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FilmSet from "./film-set.vue";

const mount = createMount(FilmSet);

describe("film-set", () => {
	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("pathWithWaitTimes", () => {
			describe("Handles an invalid path", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["array (empty)", []],
					["object (empty)", {}],
					["null", null],
					["undefined", undefined],
				])("%s", ([, path]) => {
					const wrapper = mount({ set: { path } });
					const vm = wrapper.vm;

					expect(vm.pathWithWaitTimes).toEqual([]);
				});
			});

			test("Adds wait times and types to path", () => {
				const path = [
					{
						film_id: "44IJsO0aFQ53fe_0HVWUC",
						start: {
							label: "16:50",
							value: "2025-10-29T16:50:00.000Z",
						},
						end: {
							label: "18:31",
							value: "2025-10-29T18:31:00.000Z",
						},
					},
					{
						film_id: "vXrkaTUeIDx1wqDZscrXu",
						start: {
							label: "20:20",
							value: "2025-10-29T20:20:00.000Z",
						},
						end: {
							label: "22:14",
							value: "2025-10-29T22:14:00.000Z",
						},
					},
				];

				const wrapper = mount({ set: { path } });
				const vm = wrapper.vm;

				expect(vm.pathWithWaitTimes).toEqual([
					{
						end: {
							label: "18:31",
							value: "2025-10-29T18:31:00.000Z",
						},
						film_id: expect.any(String),
						start: {
							label: "16:50",
							value: "2025-10-29T16:50:00.000Z",
						},
						type: "film",
					},
					{
						id: expect.any(String),
						type: "wait",
						wait_time: "1h 49m",
					},
					{
						end: {
							label: "22:14",
							value: "2025-10-29T22:14:00.000Z",
						},
						film_id: expect.any(String),
						start: {
							label: "20:20",
							value: "2025-10-29T20:20:00.000Z",
						},
						type: "film",
					},
				]);
			});

			test("Does not add a wait time for a single item", () => {
				const path = [
					{
						film_id: "44IJsO0aFQ53fe_0HVWUC",
						start: {
							label: "16:50",
							value: "2025-10-29T16:50:00.000Z",
						},
						end: {
							label: "18:31",
							value: "2025-10-29T18:31:00.000Z",
						},
					},
				];

				const wrapper = mount({ set: { path } });
				const vm = wrapper.vm;

				expect(vm.pathWithWaitTimes).toEqual([
					{
						end: {
							label: "18:31",
							value: "2025-10-29T18:31:00.000Z",
						},
						film_id: expect.any(String),
						start: {
							label: "16:50",
							value: "2025-10-29T16:50:00.000Z",
						},
						type: "film",
					},
				]);
			});
		});
	});

	describe("Methods", () => {
		describe("getWaitBetweenFilms", () => {
			const sampleFirstFilm = { end: { value: "2025-01-01T03:00:00.000Z" } };
			const sampleSecondFilm = { start: { value: "2025-01-01T06:27:00.000Z" } };

			test("Handles two invalid dates", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.getWaitBetweenFilms()).toBe("Unknown");
			});

			test("Handles a single invalid date", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.getWaitBetweenFilms(sampleFirstFilm)).toBe("Unknown");
				expect(vm.getWaitBetweenFilms(undefined, sampleSecondFilm)).toBe("Unknown");
			});

			test("Handles null", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.getWaitBetweenFilms(sampleFirstFilm, null)).toBe("Unknown");
				expect(vm.getWaitBetweenFilms(null, sampleSecondFilm)).toBe("Unknown");
			});

			test("Calculates the wait time between two times", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.getWaitBetweenFilms(sampleFirstFilm, sampleSecondFilm)).toBe("3h 27m");
			});
		});
	});
});
