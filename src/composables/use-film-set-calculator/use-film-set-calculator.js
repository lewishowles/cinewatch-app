import { arrayLength, isNonEmptyArray } from "@lewishowles/helpers/array";
import { computed, ref } from "vue";
import { get, isNonEmptyObject } from "@lewishowles/helpers/object";

import useFilmFinder from "@/composables/use-film-finder/use-film-finder";

const { haveFilms, availableFilms } = useFilmFinder();

// The current state of all film screening types, grouped by their associated
// film.
const filmScreeningTypes = ref({});

/**
 * Based on a list of selected screenings, calculate the best path available
 * through those films, with the shortest downtime between films.
 */
export default function useFilmSetCalculator() {
	// The selected film screening types, grouped by film.
	const selectedFilmScreeningTypes = computed(() => {
		return Object.entries(filmScreeningTypes.value).reduce((screeningTypes, [filmId, types]) => {
			const selected = Object.entries(types).reduce((screeningIds, [screeningId, isSelected]) => {
				if (isSelected === true) {
					screeningIds.push(screeningId);
				}

				return screeningIds;
			}, []);

			if (selected.length > 0) {
				screeningTypes[filmId] = selected;
			}

			return screeningTypes;
		}, {});
	});

	// A list of films that have been selected by the user, based on the
	// known-selected screenings. This contains all of the data for each film.
	const selectedFilms = computed(() => {
		if (!haveFilms.value || !isNonEmptyObject(selectedFilmScreeningTypes.value)) {
			return [];
		}

		return availableFilms.value.reduce((films, film) => {
			if (Object.hasOwn(selectedFilmScreeningTypes.value, film.id)) {
				films.push(film);
			}

			return films;
		}, []);
	});

	// The number of films selected by the user to watch.
	const selectedFilmsCount = computed(() => arrayLength(selectedFilms.value));

	// For each selected film, the list of all times (start, end, and booking
	// URL) for the selected screening types, ready for calculation.
	const selectedFilmTimes = computed(() => {
		if (!isNonEmptyArray(selectedFilms.value)) {
			return [];
		}

		const films = [];

		selectedFilms.value.forEach(film => {
			const screeningsForFilm = get(film, "screenings");
			const selectedScreeningTypesForFilm = get(selectedFilmScreeningTypes.value, film.id);

			if (!isNonEmptyArray(screeningsForFilm) || !isNonEmptyArray(selectedScreeningTypesForFilm)) {
				return;
			}

			const times = [];

			selectedScreeningTypesForFilm.forEach(screeningTypeId => {
				const screening = screeningsForFilm.find(screeningType => screeningType.id === screeningTypeId);

				if (!isNonEmptyObject(screening) || !isNonEmptyArray(screening.times)) {
					return;
				}

				screening.times.forEach(time => {
					times.push({
						...time,
						type: screening.label,
					});
				});
			});

			if (isNonEmptyArray(times)) {
				films.push({ id: film.id, times });
			}
		});

		return films;
	});

	/**
	 * Reset any selected films, especially if we're loading new data.
	 */
	function resetFilmSets() {
		filmScreeningTypes.value = {};
	}

	return {
		selectedFilmScreeningTypes,
		filmScreeningTypes,
		selectedFilmsCount,
		selectedFilms,
		selectedFilmTimes,
		resetFilmSets,
	};
}
