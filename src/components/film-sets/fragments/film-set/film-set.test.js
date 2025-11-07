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
});
