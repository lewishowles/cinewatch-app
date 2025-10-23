import { describe, expect, test } from "vitest";
import { createMount } from "@unit/support/mount";

import FilmList from "./film-list.vue";

const mount = createMount(FilmList);

describe("film-list", () => {
	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
