import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import {{PASCAL_CASE_NAME}} from "./{{COMPONENT_NAME}}.vue";

const mount = createMount({{PASCAL_CASE_NAME}});

describe("{{COMPONENT_NAME}}", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
