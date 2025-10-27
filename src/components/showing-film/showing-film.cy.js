import ShowingFilm from "./showing-film.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(ShowingFilm);

describe("showing-film", () => {
	it("A component is rendered", () => {
		mount({
			film: {
				title: "Tron: Ares",
			},
		});

		cy.getByData("showing-film").shouldBeVisible();
	});

	describe("Render", () => {
		describe("Title", () => {
			it("A title is shown when present", () => {
				mount({
					film: {
						title: "Tron: Ares",
					},
				});

				cy.getByData("showing-film-title").shouldBeVisible();
			});

			it("A title is not shown when not present", () => {
				mount({
					film: {
						title: null,
					},
				});

				cy.getByData("showing-film-title").should("not.exist");
			});
		});

		describe("Rating", () => {
			it("A rating is shown when present", () => {
				mount({
					film: {
						rating: {
							url: "/",
							alt: "15",
						},
					},
				});

				cy.getByData("showing-film-rating").shouldBeVisible();
			});

			it("A rating is not shown when not present", () => {
				mount({
					film: {
						rating: null,
					},
				});

				cy.getByData("showing-film-rating").should("not.exist");
			});
		});

		describe("Genre", () => {
			it("A genre is shown when present", () => {
				mount({
					film: {
						genre: "Action",
					},
				});

				cy.getByData("showing-film-genre").shouldBeVisible();
			});

			it("A genre is not shown when not present", () => {
				mount({
					film: {
						genre: null,
					},
				});

				cy.getByData("showing-film-genre").should("not.exist");
			});
		});

		describe("Duration", () => {
			it("A duration is shown when present", () => {
				mount({
					film: {
						duration_minutes: 112,
					},
				});

				cy.getByData("showing-film-duration").shouldBeVisible();
			});

			it("A duration is not shown when not present", () => {
				mount({
					film: {
						duration_minutes: null,
					},
				});

				cy.getByData("showing-film-duration").should("not.exist");
			});
		});
	});
});
