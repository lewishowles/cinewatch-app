import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import PageBranch from "./page-branch.vue";

const mount = createMount(PageBranch);

describe("page-branch", () => {
	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
