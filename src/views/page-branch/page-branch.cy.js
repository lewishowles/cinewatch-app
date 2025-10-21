import PageBranch from "./page-branch.vue";
import { createMount } from "@cypress/support/mount";

const mount = createMount(PageBranch);

describe("page-branch", () => {
	it("A view is rendered", () => {
		mount();

		cy.getByData("page-branch").shouldBeVisible();
	});
});
