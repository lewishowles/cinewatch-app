import { arrayLength, isNonEmptyArray } from "@lewishowles/helpers/array";
import { computed, ref } from "vue";
import { get as getPropertyValue, isNonEmptyObject } from "@lewishowles/helpers/object";
import { getFriendlyDisplay } from "@lewishowles/helpers/general";
import { isNonEmptyString } from "@lewishowles/helpers/string";
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
	// Any user-selected date.
	const selectedDate = computed(() => getPropertyValue(data.value, "selected_date"));
	// Whether a selected date has been provided.
	const haveSelectedDate = computed(() => isNonEmptyString(selectedDate.value));
	// The details of the available dates.
	const dates = computed(() => getPropertyValue(branch.value, "dates"));
	// Whether we have date details available.
	const haveDates = computed(() => !isLoading.value && isNonEmptyArray(dates.value));

	// The total number of films available to book.
	const totalFilmsCount = computed(() => {
		if (!haveFilms.value) {
			return 0;
		}

		return arrayLength(films.value);
	});

	// The films that are currently showing.
	const availableFilms = computed(() => {
		if (!haveFilms.value) {
			return [];
		}

		return films.value.filter(film => isNonEmptyArray(getPropertyValue(film, "screenings")));
	});

	// The number of films that are currently showing.
	const availableFilmsCount = computed(() => arrayLength(availableFilms.value));
	// Whether there are any showing films.
	const haveAvailableFilms = computed(() => availableFilmsCount.value > 0);

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
	 *
	 * @param  {string}  date
	 *     The date to select when choosing films.
	 */
	async function findFilms(url, date) {
		try {
			// Since we're loading new data, reset any existing data.
			data.value = null;

			const parameters = { url };

			if (isNonEmptyString(date)) {
				parameters.date = date;
			}

			const response = await get("cineworld/films", parameters);

			if (!isNonEmptyObject(response)) {
				throw new Error(`Expected non-empty object <response>, received ${getFriendlyDisplay(response)}`);
			}

			data.value = response;
		} catch(error) {
			console.error("use-film-finder[findFilms]: Unable to load films.", error);

			throw new Error("Films couldn’t be loaded due to an error with the system. Please try again shortly.");
		}
	}

	return {
		availableFilms,
		availableFilmsCount,
		branch,
		data,
		dates,
		films,
		findFilms,
		haveAvailableFilms,
		haveBranch,
		haveDates,
		haveFilms,
		haveSelectedDate,
		haveUpcomingFilms,
		isLoading,
		isReady,
		selectedDate,
		totalFilmsCount,
		upcomingFilms,
		upcomingFilmsCount,
	};
}
