import FilmSetFilm from "./film-set-film.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FilmSetFilm);

describe("film-set-film", () => {
	const film = {
		id: "1",
		title: "Film one",
		poster: {
			url: "https://placehold.co/28x40/0069a8/ffffff?text=1",
		},
		start: {
			label: "10:00",
		},
		end: {
			label: "12:00",
		},
		screening_type: "2D",
	};

	it("A component is rendered", () => {
		mount({ film });

		cy.getByData("film-set-film").shouldBeVisible();
		cy.getByData("film-set-film-poster").shouldBeVisible();
		cy.getByData("film-set-film-title").shouldBeVisible();
		cy.getByData("film-set-film-times").shouldBeVisible().shouldHaveText("10:00–12:00");
		cy.getByData("film-set-film-screening-type").shouldBeVisible().shouldHaveText("2D");
	});
});
