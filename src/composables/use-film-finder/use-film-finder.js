import useApi from "@/composables/use-api/use-api";
import { computed, ref } from "vue";
import { get as getPropertyValue, isNonEmptyObject } from "@lewishowles/helpers/object";
import { getFriendlyDisplay } from "@lewishowles/helpers/general";
import { isNonEmptyArray } from "@lewishowles/helpers/array";

// The raw data provided by the API.
const data = ref(null);
// The details of the branch itself.
const branch = computed(() => getPropertyValue(data.value, "branch"));
// Whether we have branch details available.
const haveBranch = computed(() => isNonEmptyObject(branch.value));
// The details of the available films.
const films = computed(() => getPropertyValue(data.value, "films"));
// Whether we have film details available.
const haveFilms = computed(() => isNonEmptyArray(films.value));

/**
 * Load details of the available films from a provided URL.
 */
export default function useFilmFinder() {
	const { get, isLoading, isReady } = useApi();

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
		}
	}

	return {
		branch,
		haveBranch,
		films,
		haveFilms,
		findFilms,
		isLoading,
		isReady,
	};
}
