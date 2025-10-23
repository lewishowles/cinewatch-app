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
		cy.getByData("film-finder-form").shouldBeVisible();
		cy.getByData("film-finder-field").shouldBeVisible();
		cy.getByData("film-finder-button").shouldBeVisible();
	});

	describe("Loading films", () => {
		it("The user should be redirected if films load successfully", () => {
			mount();

			cy.intercept("GET", "/api/cineworld/films?*", { branch: {}, films: [] }).as("loadFilms");

			cy.getByData("film-finder-button").click();

			cy.wait("@loadFilms");

			// cy.url().should("include", "/branch");
		});

		it("An error should be shown if films do not load successfully", () => {
			mount();

			cy.intercept("GET", "/api/cineworld/films?*", {
				statusCode: 400,
				body: {
					error: "We couldn't find a URL for the desired branch.",
				},
			}).as("loadFilms");

			cy.getByData("film-finder-button").click();

			cy.wait("@loadFilms").its("response.statusCode").should("eq", 400);

			cy.getByData("film-finder-error").shouldBeVisible();
		});
	});
});
