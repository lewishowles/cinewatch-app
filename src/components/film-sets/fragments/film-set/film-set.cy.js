import FilmSet from "./film-set.vue";
import { createMount } from "@cypress/support/mount";

const sampleSet = {
	id: "RrxpQVE3bqFIbRCy7B7nW",
	path: [
		{
			title: "Horror Season: Corpse Bride (20th Anniversary)",
			poster: {
				url: "https://regalcdn.azureedge.net/CW/HorrorSeasonCorpseBride20thAnniversary/HO00013599/TV_SmallPosterImage/20250908-114736335.jpg",
			},
			film_id: "jtevaOo315JZ_1eE5bbtK",
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
			title: "Tron: Ares",
			poster: {
				url: "https://regalcdn.azureedge.net/CW/TronAres/HO00013436/TV_SmallPosterImage/20251006-100039583.jpg",
			},
			film_id: "Ckef-h0bdoSuQ6SQHpFXA",
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
	it("A component is rendered", () => {
		mount();

		cy.getByData("film-set").shouldBeVisible();
		cy.getByData("film-set-metadata").shouldBeVisible();
		cy.getByData("film-set-film").shouldHaveCount(2);
		cy.getByData("film-set-wait").shouldHaveCount(1);
	});
});
