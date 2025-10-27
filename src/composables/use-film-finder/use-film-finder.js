import { arrayLength, isNonEmptyArray } from "@lewishowles/helpers/array";
import { computed, ref } from "vue";
import { get as getPropertyValue, isNonEmptyObject } from "@lewishowles/helpers/object";
import { getFriendlyDisplay } from "@lewishowles/helpers/general";
import useApi from "@/composables/use-api/use-api";

// Our API helpers. These are external to our function so that they can be
// called from within Cypress tests, which doesn't seem to have a good way to
// mock or stub composables.
const { get, isLoading, isReady } = useApi();
// The raw data provided by the API.
const data = ref(null);

/**
 * Load details of the available films from a provided URL.
 */
export default function useFilmFinder() {
	// The details of the branch itself.
	const branch = computed(() => getPropertyValue(data.value, "branch"));
	// Whether we have branch details available.
	const haveBranch = computed(() => !isLoading.value && isNonEmptyObject(branch.value));
	// The details of the available films.
	const films = computed(() => getPropertyValue(data.value, "films"));
	// Whether we have film details available.
	const haveFilms = computed(() => !isLoading.value && isNonEmptyArray(films.value));

	// The total number of films available to book.
	const totalFilmsCount = computed(() => {
		if (!haveFilms.value) {
			return 0;
		}

		return arrayLength(films.value);
	});

	// The films that are currently showing.
	const showingFilms = computed(() => {
		if (!haveFilms.value) {
			return [];
		}

		return films.value.filter(film => isNonEmptyArray(getPropertyValue(film, "screenings")));
	});

	// The number of films that are currently showing.
	const showingFilmsCount = computed(() => arrayLength(showingFilms.value));
	// Whether there are any showing films.
	const haveShowingFilms = computed(() => showingFilmsCount.value > 0);

	// The films that are available to book, but have not yet released, i.e.
	// they have no screenings.
	const upcomingFilms = computed(() => {
		if (!haveFilms.value) {
			return [];
		}

		return films.value.filter(film => !isNonEmptyArray(getPropertyValue(film, "screenings")));
	});

	// The number of films that are currently showing.
	const upcomingFilmsCount = computed(() => arrayLength(upcomingFilms.value));
	// Whether there are any upcoming films.
	const haveUpcomingFilms = computed(() => upcomingFilmsCount.value > 0);

	/**
	 * Load the details of any films available to book at the given URL.
	 *
	 * @param  {string}  url
	 *     The URL from which to load data.
	 */
	async function findFilms(url) {
		try {
			// Since we're loading new data, reset any existing data.
			data.value = null;

			const response = await get("cineworld/films", { url });

			if (!isNonEmptyObject(response)) {
				throw new Error(`Expected non-empty object <response>, received ${getFriendlyDisplay(response)}`);
			}

			data.value = response;
		} catch(error) {
			console.error("use-film-finder[findFilms]: Unable to load films.", error);

			throw error;
			//throw new Error("Films couldn’t be loaded due to an error with the system. Please try again shortly.");
		}
	}

	return {
		data,
		isLoading,
		isReady,
		findFilms,
		branch,
		haveBranch,
		films,
		haveFilms,
		totalFilmsCount,
		showingFilms,
		showingFilmsCount,
		haveShowingFilms,
		upcomingFilms,
		upcomingFilmsCount,
		haveUpcomingFilms,
	};
}
