import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import UpcomingFilm from "./upcoming-film.vue";

const mount = createMount(UpcomingFilm);

describe("upcoming-film", () => {
	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
