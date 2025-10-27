import UpcomingFilm from "./upcoming-film.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(UpcomingFilm);

describe("upcoming-film", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("upcoming-film").shouldBeVisible();
	});
});
