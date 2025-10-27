import FilmList from "./film-list.vue";
import { createMount } from "@cypress/support/mount";
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";

const { data, isLoading } = useFilmFinder();

const mount = createMount(FilmList);

describe("film-list", () => {
	afterEach(() => {
		data.value = {};
		isLoading.value = false;
	});

	it("A component is rendered", () => {
		mount();

		cy.getByData("film-list").shouldBeVisible();
	});

	it("Displays a loading indicator if data is loading", () => {
		isLoading.value = true;

		mount();

		cy.getByData("film-list-loading").shouldBeVisible();
		cy.getByData("film-list-not-found").should("not.exist");
		cy.getByData("film-list-list").should("not.exist");
	});

	it("Displays a warning if no data is found", () => {
		mount();

		cy.getByData("film-list-loading").should("not.exist");
		cy.getByData("film-list-not-found").shouldBeVisible();
		cy.getByData("film-list-list").should("not.exist");
	});

	it("Displays a film list if films are found", () => {
		data.value = {
			films: [{ title: "Tron: Ares", id: 1, screenings: [{}] }],
		};

		mount();

		cy.getByData("film-list-loading").should("not.exist");
		cy.getByData("film-list-not-found").should("not.exist");
		cy.getByData("film-list-list").shouldBeVisible();
	});

	it("Shows the correct number of films", () => {
		data.value = {
			films: [
				{ title: "Tron: Ares", id: 1, screenings: [{}] },
				{ title: "One Battle After Another", id: 2, screenings: [{}] },
				{ title: "Good Fortune", id: 3, screenings: [{}] },
				{ title: "Upcoming Pixar Film", id: 4 },
				{ title: "Upcoming Marvel Film", id: 5 },
			],
		};

		mount();

		cy.getByData("film-list-loading").should("not.exist");
		cy.getByData("film-list-not-found").should("not.exist");
		cy.getByData("film-list-list").shouldBeVisible();
		cy.getByData("showing-film").shouldHaveCount(3);
		cy.getByData("upcoming-film").shouldHaveCount(2);
	});
});
