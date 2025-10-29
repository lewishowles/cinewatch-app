import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FilmScreenings from "./film-screenings.vue";

const mount = createMount(FilmScreenings);

describe("film-screenings", () => {
	const screenings = [
		{ id: "1" },
		{ id: "2" },
	];

	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});

		test("selectedScreenings is initialised", () => {
			const wrapper = mount({ screenings });
			const vm = wrapper.vm;

			expect(vm.selectedScreenings).toEqual({
				1: false,
				2: false,
			});
		});
	});
});
