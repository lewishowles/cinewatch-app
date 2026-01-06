import FilmListHelp from "./film-list-help-dialog.vue";
import { createMount } from "@unit/support/mount";
import { beforeEach, describe, expect, test } from "vitest";
import filmData from "@test/data/film-data.json";
import useFilmFinder from "@/composables/use-film-finder/use-film-finder";

const { data } = useFilmFinder();

const mount = createMount(FilmListHelp);

describe("film-list-help", () => {
	beforeEach(() => {
		data.value = filmData;
	});

	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
