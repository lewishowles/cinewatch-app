import FilmSets from "./film-sets.vue";
import { createMount } from "@cypress/support/mount";
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";
import useFilmSetCalculator from "@/composables/use-film-set-calculator/use-film-set-calculator";

const { data } = useFilmFinder();
const { filmScreeningTypes } = useFilmSetCalculator();

const sampleFilms = [
	{
		id: "1",
		screenings: [
			{
				id: "10",
				label: "2D",
				times: [
					{
						start: { label: "10:00", value: "2025-10-29T10:00:00.000Z" },
						end: { label: "12:00", value: "2025-10-29T12:00:00.000Z" },
					},
					{
						start: { label: "12:30", value: "2025-10-29T12:30:00.000Z" },
						end: { label: "14:00", value: "2025-10-29T14:00:00.000Z" },
					},
				],
			},
		],
	},
	{
		id: "2",
		screenings: [
			{
				id: "11",
				label: "IMAX",
				times: [
					{
						start: { label: "14:30", value: "2025-10-29T14:30:00.000Z" },
						end: { label: "16:00", value: "2025-10-29T16:00:00.000Z" },
					},
				],
			},
			{
				id: "12",
				label: "3D",
				times: [
					{
						start: { label: "16:30", value: "2025-10-29T16:30:00.000Z" },
						end: { label: "18:00", value: "2025-10-29T18:00:00.000Z" },
					},
				],
			},
		],
	},
];

const mount = createMount(FilmSets);

describe("film-sets", () => {
	beforeEach(() => {
		data.value = { films: sampleFilms };
		filmScreeningTypes.value = { 1: { 10: true }, 2: { 11: true, 12: true } };
	});

	it("A component is rendered", () => {
		mount();

		cy.getByData("page-header").shouldBeVisible();
		cy.getByData("film-sets").shouldBeVisible();
		cy.getByData("selected-film").shouldHaveCount(2);
		cy.getByData("film-set").shouldHaveCount(2);
	});
});
