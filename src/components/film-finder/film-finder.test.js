import mockApi from "@unit/support/mock-api";
import { describe, expect, test, vi } from "vitest";
import { createMount } from "@unit/support/mount";

import FilmFinder from "./film-finder.vue";

const mount = createMount(FilmFinder);

describe("film-finder", () => {
	console.error = vi.fn();

	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Methods", () => {
		describe("getFilms", () => {
			test("Performs the appropriate API call", async() => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const url = "/some/url";

				vm.url = url;

				await vm.getFilms();

				expect(mockApi.get).toHaveBeenCalledWith("cineworld/films", { url });
			});

			test("Navigates on successful `get`", async() => {
				const wrapper = mount();
				const vm = wrapper.vm;

				mockApi.get.mockResolvedValueOnce({ branch: {}, films: [] });

				await vm.getFilms();

				// expect(mockRouter.push).toHaveBeenCalledWith({ name: "branch" });
			});

			test("Does not navigate on failed `get`", async() => {
				const wrapper = mount();
				const vm = wrapper.vm;

				mockApi.get.mockRejectedValueOnce({ error: "Message" });

				await vm.getFilms();

				// expect(mockRouter.push).not.toHaveBeenCalled();
			});
		});
	});
});
