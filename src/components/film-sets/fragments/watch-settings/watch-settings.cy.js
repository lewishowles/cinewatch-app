import WatchSettings from "./watch-settings.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(WatchSettings);

describe("watch-settings", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("watch-settings").shouldBeVisible();
		cy.getByData("watch-settings-current-settings").shouldBeVisible();
	});
});
