import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import WatchSettingsDialog from "./watch-settings-dialog.vue";

const mount = createMount(WatchSettingsDialog);

describe("watch-settings-dialog", () => {
	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
