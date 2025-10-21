import PageHeader from "./page-header.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(PageHeader);

describe("page-header", () => {
	it("A component is rendered", () => {
		mount({
			slots: {
				default: "Title",
				introduction: "Introduction",
			},
		});

		cy.getByData("page-header").shouldBeVisible();
		cy.getByData("page-header-title").shouldBeVisible();
		cy.getByData("page-header-introduction").shouldBeVisible();
	});

	it("An introduction is not included if not provided", () => {
		mount({
			slots: {
				default: "Title",
			},
		});

		cy.getByData("page-header").shouldBeVisible();
		cy.getByData("page-header-title").shouldBeVisible();
		cy.getByData("page-header-introduction").should("not.exist");
	});
});
