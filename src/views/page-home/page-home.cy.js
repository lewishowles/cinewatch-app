import PageHome from "./page-home.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(PageHome);

describe("page-home", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("page-home").shouldBeVisible();
	});

	it("The appropriate elements should be visible", () => {
		mount();

		cy.getByData("page-home").shouldBeVisible();
		cy.getByData("page-home-field").shouldBeVisible();
		cy.getByData("page-home-button").shouldBeVisible();
	});
});
