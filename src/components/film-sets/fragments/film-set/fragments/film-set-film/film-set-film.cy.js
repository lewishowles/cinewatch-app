import FilmSetFilm from "./film-set-film.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FilmSetFilm);

describe("film-set-film", () => {
	const film = {
		film_id: "44IJsO0aFQ53fe_0HVWUC",
		start: {
			label: "16:50",
			value: "2025-10-29T16:50:00.000Z",
		},
		end: {
			label: "18:31",
			value: "2025-10-29T18:31:00.000Z",
		},
	};

	it("A component is rendered", () => {
		mount({ film });

		cy.getByData("film-set-film").shouldBeVisible();
	});
});
