import FilmSets from "./film-sets.vue";
import { createMount } from "@cypress/support/mount";
import { createQuickScreening, createScreeningTime } from "@cypress/support/screenings";
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";
import useFilmSetCalculator from "@/composables/use-film-set-calculator/use-film-set-calculator";

const { data } = useFilmFinder();
const { filmScreeningTypes } = useFilmSetCalculator();

const mount = createMount(FilmSets);

describe("film-sets", () => {
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

	const sampleFilmThree = {
		id: "3",
		title: "Film three",
		poster: {
			url: "https://placehold.co/28x40/0069a8/ffffff?text=3",
		},
		screenings: [
			createQuickScreening({
				id: "13", label: "IMAX", start: "20:00", end: "22:00",
			}),
		],
	};

	const sampleFilms = [
		sampleFilmOne,
		sampleFilmTwo,
		sampleFilmThree,
	];

	beforeEach(() => {
		data.value = { films: sampleFilms };
		filmScreeningTypes.value = { 1: { 10: true }, 2: { 11: true, 12: true }, 3: { 13: true } };
	});

	it("A component is rendered with a mixture of complete and incomplete sets", () => {
		mount();

		cy.getByData("page-header").shouldBeVisible();
		cy.getByData("film-sets").shouldBeVisible();
		cy.getByData("selected-film").shouldHaveCount(3);
		cy.getByData("film-set").shouldHaveCount(2);
		cy.getByData("partial-film-set").shouldHaveCount(4);
		cy.getByData("film-sets-partial-sets-warning").shouldBeVisible();
	});

	it("If only incomplete sets exist, sets are displayed correctly", () => {
		data.value = {
			films: [
				{
					...sampleFilmOne,
					screenings: [createQuickScreening({ id: "10", start: "10:00", end: "12:00" })],
				},
				{
					...sampleFilmTwo,
					screenings: [createQuickScreening({ id: "11", start: "10:00", end: "12:00" })],
				},
				{
					...sampleFilmThree,
					screenings: [createQuickScreening({ id: "12", start: "14:00", end: "16:00" })],
				},
			],
		};

		filmScreeningTypes.value = { 1: { 10: true }, 2: { 11: true }, 3: { 12: true } };

		mount();

		cy.getByData("selected-film").shouldHaveCount(3);
		cy.getByData("film-set").should("not.exist");
		cy.getByData("partial-film-set").shouldHaveCount(2);
		cy.getByData("film-sets-partial-sets-warning").shouldBeVisible();
	});

	it("If no incomplete sets exist, no warning should be shown", () => {
		data.value = {
			films: [
				{
					...sampleFilmOne,
					screenings: [createQuickScreening({ id: "10", start: "10:00", end: "12:00" })],
				},
				{
					...sampleFilmTwo,
					screenings: [createQuickScreening({ id: "11", start: "13:00", end: "14:00" })],
				},
			],
		};

		filmScreeningTypes.value = { 1: { 10: true }, 2: { 11: true } };

		mount();

		cy.getByData("selected-film").shouldHaveCount(2);
		cy.getByData("film-set").shouldHaveCount(1);
		cy.getByData("partial-film-set").should("not.exist");
		cy.getByData("film-sets-partial-sets-warning").should("not.exist");
	});
});
