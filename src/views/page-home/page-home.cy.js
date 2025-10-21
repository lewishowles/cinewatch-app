describe("page-home", () => {
	it("A view is rendered", () => {
		cy.visit("/");

		cy.getByData("film-finder").shouldBeVisible();
	});

	it("The appropriate elements should be visible", () => {
		cy.visit("/");

		cy.getByData("film-finder").shouldBeVisible();
		cy.getByData("film-finder-field").shouldBeVisible();
		cy.getByData("film-finder-button").shouldBeVisible();
	});

	describe("Loading films", () => {
		it("The user should be redirected if films load successfully", () => {
			cy.visit("/");

			cy.intercept("GET", "/api/cineworld/films?*", { branch: {}, films: [] }).as("loadFilms");

			cy.getByData("film-finder-button").click();

			cy.wait("@loadFilms");

			cy.url().should("include", "/branch");
		});

		it.only("An error should be shown if films do not load successfully", () => {
			cy.visit("/");

			cy.intercept("GET", "/api/cineworld/films?*", {
				statusCode: 400,
				body: {
					error: "We couldn't find a URL for the desired branch.",
				},
			}).as("loadFilms");

			cy.getByData("film-finder-button").click();

			cy.wait("@loadFilms").its("response.statusCode").should("eq", 400);

			cy.url().should("not.include", "/branch");
			cy.getByData("film-finder-error").shouldBeVisible();
		});
	});
});
