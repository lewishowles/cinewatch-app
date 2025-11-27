import FilmSetMetadata from "./film-set-metadata.vue";
import { createMount } from "@cypress/support/mount";
import { createQuickScreening, createScreeningTime } from "@cypress/support/screenings";
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";
import useFilmSetCalculator from "@/composables/use-film-set-calculator/use-film-set-calculator";

const mount = createMount(FilmSetMetadata);

describe("film-set-metadata", () => {
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

	const set = {
		path: [
			{
				film_id: "1",
				start: {
					label: "16:50",
					value: "2025-10-29T16:50:00.000Z",
				},
				end: {
					label: "18:31",
					value: "2025-10-29T18:31:00.000Z",
				},
			},
			{
				film_id: "2",
				start: {
					label: "20:20",
					value: "2025-10-29T20:20:00.000Z",
				},
				end: {
					label: "22:14",
					value: "2025-10-29T22:14:00.000Z",
				},
			},
		],
		films_seen: 2,
		total_wait: 6540000,
	};

	beforeEach(() => {
		const { data } = useFilmFinder();
		const { filmScreeningTypes } = useFilmSetCalculator();

		data.value = { films: sampleFilms };
		filmScreeningTypes.value = { 1: { 10: true }, 2: { 11: true } };
	});

	it("A component is rendered", () => {
		mount({ set });

		cy.getByData("film-set-metadata").shouldBeVisible();
	});

	it("A component is not rendered without a set", () => {
		mount();

		cy.getByData("film-set-metadata").should("not.exist");
	});

	it("Appropriate set metadata is displayed", () => {
		mount({ set });

		cy.getByData("film-set-metadata-total-time-value").shouldHaveText("5h 24m");
		cy.getByData("film-set-metadata-starts-value").shouldHaveText("16:50");
		cy.getByData("film-set-metadata-ends-value").shouldHaveText("22:14");
		cy.getByData("film-set-metadata-total-wait-value").shouldHaveText("1h 49m");
		cy.getByData("film-set-metadata-films-seen-value").should("not.exist");
	});

	it("Metadata can indicate an incomplete set", () => {
		mount({ set: { ...set, films_seen: 1 } });

		cy.getByData("film-set-metadata-films-seen-value").shouldHaveText("1 / 2");
	});
});
