import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createMount } from "@unit/support/mount";
import { ref } from "vue";
import PageHome from "./page-home.vue";

const mount = createMount(PageHome);
const mockGet = vi.fn();
const mockPushRoute = vi.fn();

vi.mock("@/composables/use-api/use-api", () => ({
	default: () => ({
		get: mockGet,
		isLoading: ref(false),
		isReady: ref(false),
	}),
}));

vi.mock("vue-router", async (importOriginal) => {
	const actual = await importOriginal();

	return {
		...actual,
		useRouter: () => ({
			push: mockPushRoute,
		}),
	};
});

describe("page-home", () => {
	console.error = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

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

				vm.listingUrl = url;

				await vm.getFilms();

				expect(mockGet).toHaveBeenCalledWith("cineworld/films", { url });
			});

			test("Navigates on successful `get`", async() => {
				const wrapper = mount();
				const vm = wrapper.vm;

				mockGet.mockResolvedValueOnce({ branch: {}, films: [] });

				await vm.getFilms();

				expect(mockPushRoute).toHaveBeenCalledWith({ name: "branch" });
			});

			test("Does not navigate on failed `get`", async() => {
				const wrapper = mount();
				const vm = wrapper.vm;

				mockGet.mockRejectedValueOnce(null);

				await vm.getFilms();

				expect(mockPushRoute).not.toHaveBeenCalled();
			});
		});
	});
});
