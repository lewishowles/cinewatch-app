import FilmSetMetadata from "./film-set-metadata.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FilmSetMetadata);

describe("film-set-metadata", () => {
	const path = [
		{
			film_id: "44IJsO0aFQ53fe_0HVWUC",
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
			film_id: "vXrkaTUeIDx1wqDZscrXu",
			start: {
				label: "20:20",
				value: "2025-10-29T20:20:00.000Z",
			},
			end: {
				label: "22:14",
				value: "2025-10-29T22:14:00.000Z",
			},
		},
	];

	it("A component is rendered", () => {
		mount({ set: { path } });

		cy.getByData("film-set-metadata").shouldBeVisible();
	});

	it("A component is not rendered without a set", () => {
		mount();

		cy.getByData("film-set-metadata").should("not.exist");
	});
});
