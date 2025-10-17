import FilmFinder from "./film-finder.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FilmFinder);

describe("film-finder", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("film-finder").shouldBeVisible();
	});
});
