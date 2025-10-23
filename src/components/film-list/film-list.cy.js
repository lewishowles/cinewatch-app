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
		cy.getByData("film-list-warning").should("not.exist");
		cy.getByData("film-list-list").should("not.exist");
	});

	it("Displays a warning if no data is found", () => {
		mount();

		cy.getByData("film-list-loading").should("not.exist");
		cy.getByData("film-list-warning").shouldBeVisible();
		cy.getByData("film-list-list").should("not.exist");
	});

	it("Displays a film list if films are found", () => {
		data.value = {
			films: [{ title: "Tron: Ares" }],
		};

		mount();

		cy.getByData("film-list-loading").should("not.exist");
		cy.getByData("film-list-warning").should("not.exist");
		cy.getByData("film-list-list").shouldBeVisible();
	});
});
