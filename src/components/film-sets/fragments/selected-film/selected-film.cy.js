import SelectedFilm from "./selected-film.vue";
import { createMount } from "@cypress/support/mount";
import { createScreeningTime } from "@cypress/support/screenings";
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";
import useFilmSetCalculator from "@/composables/use-film-set-calculator/use-film-set-calculator";

const sampleFilm = {
	id: "1",
	title: "Film one",
	poster: {
		url: "https://placehold.co/28x40/0069a8/ffffff?text=1",
	},
	screenings: [
		{
			id: "10",
			label: "2D",
			times: [
				createScreeningTime("10:00", "12:00"),
				createScreeningTime("12:30", "14:00"),
			],
		},
	],
};

const mount = createMount(SelectedFilm, { props: { film: sampleFilm } });

describe("selected-film", () => {
	beforeEach(() => {
		const { data } = useFilmFinder();
		const { filmScreeningTypes } = useFilmSetCalculator();

		data.value = { films: [sampleFilm] };
		filmScreeningTypes.value = { 1: { 10: true }, 2: { 11: true } };
	});

	it("A component is rendered", () => {
		mount();

		cy.getByData("selected-film").shouldBeVisible();
		cy.getByData("selected-film-poster").shouldBeVisible();
		cy.getByData("selected-film-title").shouldBeVisible();
		cy.getByData("selected-film-screening-types").shouldHaveText("2D");
	});
});
