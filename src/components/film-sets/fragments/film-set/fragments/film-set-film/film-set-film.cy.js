import FilmSetFilm from "./film-set-film.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FilmSetFilm);

describe("film-set-film", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("film-set-film").shouldBeVisible();
	});
});
