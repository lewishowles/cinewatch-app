import FilmSet from "./film-set.vue";
import { createMount } from "@cypress/support/mount";
import { createQuickScreening, createScreeningTime } from "@cypress/support/screenings";
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";
import useFilmSetCalculator from "@/composables/use-film-set-calculator/use-film-set-calculator";

const sampleSet = {
	id: "RrxpQVE3bqFIbRCy7B7nW",
	path: [
		{
			title: "Film 1",
			poster: {
				url: "https://placehold.co/28x40/0069a8/ffffff?text=1",
			},
			film_id: "1",
			start: {
				label: "14:40",
				value: "2025-10-29T14:40:00.000Z",
			},
			end: {
				label: "15:57",
				value: "2025-10-29T15:57:00.000Z",
			},
			booking_url: "https://experience.cineworld.co.uk/select-tickets?sitecode=068&site=068&id=280364&lang=en",
			type: "4DX 2D",
		},
		{
			title: "Film 2",
			poster: {
				url: "https://placehold.co/28x40/0069a8/ffffff?text=2",
			},
			film_id: "2",
			start: {
				label: "20:40",
				value: "2025-10-29T20:40:00.000Z",
			},
			end: {
				label: "22:39",
				value: "2025-10-29T22:39:00.000Z",
			},
			booking_url: "https://experience.cineworld.co.uk/select-tickets?sitecode=068&site=068&id=280503&lang=en",
			type: "2D",
		},
	],
	films_seen: 2,
	total_wait: 16980000,
};

const mount = createMount(FilmSet, { set: sampleSet });

describe("film-set", () => {
	const sampleFilmOne = {
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

	const sampleFilmTwo = {
		id: "2",
		title: "Film two",
		poster: {
			url: "https://placehold.co/28x40/0069a8/ffffff?text=2",
		},
		screenings: [
			createQuickScreening({
				id: "11", label: "IMAX", start: "14:30", end: "16:00",
			}),
			createQuickScreening({
				id: "12", label: "3D", start: "16:30", end: "18:00",
			}),
		],
	};

	const sampleFilms = [
		sampleFilmOne,
		sampleFilmTwo,
	];

	beforeEach(() => {
		const { data } = useFilmFinder();
		const { filmScreeningTypes } = useFilmSetCalculator();

		data.value = { films: sampleFilms };
		filmScreeningTypes.value = { 1: { 10: true }, 2: { 11: true } };
	});

	it("A component is rendered", () => {
		mount();

		cy.getByData("film-set").shouldBeVisible();
		cy.getByData("film-set-metadata").shouldBeVisible();
		cy.getByData("film-set-chart").shouldBeVisible();
		cy.getByData("film-set-film").shouldHaveCount(2);
		cy.getByData("film-set-wait").shouldHaveCount(1);
	});
});
