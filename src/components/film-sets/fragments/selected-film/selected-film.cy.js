import SelectedFilm from "./selected-film.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(SelectedFilm);

describe("selected-film", () => {
	it("A component is rendered", () => {
		mount({
			film: {
				title: "Tron: Ares",
			},
		});

		cy.getByData("selected-film").shouldBeVisible();
	});
});
