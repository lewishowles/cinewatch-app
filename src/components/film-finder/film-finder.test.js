import mockApi from "@unit/support/mock-api";
import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";

import FilmFinder from "./film-finder.vue";

const mockgoToList = vi.fn();

vi.mock("@/composables/use-stage-manager/use-stage-manager", () => ({
	default: () => ({
		goToList: mockgoToList,
	}),
}));

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

				expect(mockgoToList).toHaveBeenCalled();
			});

			test("Does not navigate on failed `get`", async() => {
				const wrapper = mount();
				const vm = wrapper.vm;

				mockApi.get.mockRejectedValueOnce({ error: "Message" });

				await vm.getFilms();

				expect(mockgoToList).not.toHaveBeenCalled();
			});
		});
	});
});
