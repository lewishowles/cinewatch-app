import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FilmSetMetadata from "./film-set-metadata.vue";

const mount = createMount(FilmSetMetadata);

describe("film-set-metadata", () => {
	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
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
				film_id: "1r7BXv4aEpabCT40jGdgT",
				start: {
					label: "19:00",
					value: "2025-10-29T19:00:00.000Z",
				},
				end: {
					label: "19:50",
					value: "2025-10-29T19:50:00.000Z",
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

		describe("totalTime", () => {
			test("Handles an invalid path", () => {
				const wrapper = mount({ set: { path: null } });
				const vm = wrapper.vm;

				expect(vm.totalTime).toBe("Unknown");
			});

			test("Handles an invalid start time", () => {
				const wrapper = mount({ set: { path: [null, { end: { value: "2025-10-29T22:14:00.000Z" } }] } });
				const vm = wrapper.vm;

				expect(vm.totalTime).toBe("Unknown");
			});

			test("Handles an invalid end time", () => {
				const wrapper = mount({ set: { path: [{ start: { value: "2025-10-29T22:14:00.000Z" } }, null] } });
				const vm = wrapper.vm;

				expect(vm.totalTime).toBe("Unknown");
			});

			test("Determines the total time of a given set", () => {
				const wrapper = mount({ set: { path } });
				const vm = wrapper.vm;

				expect(vm.totalTime).toBe("5h 24m");
			});
		});

		describe("startTime", () => {
			test("Handles an invalid path", () => {
				const wrapper = mount({ set: { path: null } });
				const vm = wrapper.vm;

				expect(vm.startTime).toBe("Unknown");
			});

			test("Handles an invalid start time", () => {
				const wrapper = mount({ set: { path: [null, { end: { label: "14:00" } }] } });
				const vm = wrapper.vm;

				expect(vm.startTime).toBe("Unknown");
			});

			test("Gets the appropriate start time", () => {
				const wrapper = mount({ set: { path } });
				const vm = wrapper.vm;

				expect(vm.startTime).toBe("16:50");
			});
		});

		describe("endTime", () => {
			test("Handles an invalid path", () => {
				const wrapper = mount({ set: { path: null } });
				const vm = wrapper.vm;

				expect(vm.endTime).toBe("Unknown");
			});

			test("Handles an invalid end time", () => {
				const wrapper = mount({ set: { path: [{ start: { label: "14:00" } }, null] } });
				const vm = wrapper.vm;

				expect(vm.endTime).toBe("Unknown");
			});

			test("Gets the appropriate end time", () => {
				const wrapper = mount({ set: { path } });
				const vm = wrapper.vm;

				expect(vm.endTime).toBe("22:14");
			});
		});
	});
});
