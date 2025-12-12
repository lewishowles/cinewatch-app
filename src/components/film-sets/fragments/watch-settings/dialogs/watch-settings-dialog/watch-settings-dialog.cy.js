import WatchSettingsDialog from "./watch-settings-dialog.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(WatchSettingsDialog);

describe("watch-settings-dialog", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("watch-settings-dialog").shouldBeVisible();
	});
});
