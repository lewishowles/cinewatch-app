import FilmFinder from "./film-finder.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FilmFinder);

describe("film-finder", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("film-finder").shouldBeVisible();
	});

	it("The appropriate elements should be visible", () => {
		mount();

		cy.getByData("film-finder").shouldBeVisible();
		cy.getByData("film-finder-field").shouldBeVisible();
		cy.getByData("film-finder-button").shouldBeVisible();
	});
});
