import FilmScreenings from "./film-screenings.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(FilmScreenings);

const sampleScreenings = [
	{ label: "2D", id: "IVlMo4twUo3y3aURIO91O" },
	{ label: "IMAX 2D", id: "D6DYe9Jz5im2Gi2Ame8kM" },
	{ label: "IMAX 3D", id: "WzEeBOqbMducBQqmERDCF" },
];

describe("film-screenings", () => {
	it("A component is rendered", () => {
		mount({ screenings: sampleScreenings });

		cy.getByData("film-screenings").shouldBeVisible();
	});

	describe("Render", () => {
		it("The appropriate number of checkboxes are displayed", () => {
			mount({ screenings: sampleScreenings });

			cy.getByData("form-checkbox").shouldHaveCount(3);
		});
	});
});
