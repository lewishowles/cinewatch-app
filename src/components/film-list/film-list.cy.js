import FilmList from "./film-list.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FilmList);

describe("film-list", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("film-list").shouldBeVisible();
	});
});
