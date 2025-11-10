import FilmSetMetadata from "./film-set-metadata.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FilmSetMetadata);

describe("film-set-metadata", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("film-set-metadata").shouldBeVisible();
	});
});
