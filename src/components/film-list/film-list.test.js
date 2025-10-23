import mockApi from "@unit/support/mock-api";
import mockRouter from "@unit/support/mock-router";
import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
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
