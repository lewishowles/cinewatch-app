import FilmSets from "./film-sets.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FilmSets);

describe("film-sets", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("film-sets").shouldBeVisible();
	});
});
