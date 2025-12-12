import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import WatchSettings from "./watch-settings.vue";

const mount = createMount(WatchSettings);

describe("watch-settings", () => {
	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
