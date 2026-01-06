import FilmListHelp from "./film-list-help-dialog.vue";
import { createMount } from "@cypress/support/mount";
import filmData from "@test/data/film-data.json";
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";

const { data } = useFilmFinder();

const mount = createMount(FilmListHelp);

describe("film-list-help", () => {
	beforeEach(() => {
		data.value = filmData;
	});

	it("A component is rendered", () => {
		mount();

		cy.getByData("film-list-help-dialog").shouldBeVisible();
	});
});
