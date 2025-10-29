import { computed, ref } from "vue";

// The current, internal, stage.
const stage = ref("search");

/**
 * Manage the current stage of the user journey. Since the process of finding,
 * selecting, and displaying the results for our films isn't really conducive to
 * individual pages in a router, we keep track of the user's stage in the
 * journey here. The components can't really be used as views as, given the
 * transient nature of the data, the results and details pages cannot be visited
 * directly with any information that the user would either know or that we can
 * be reasonably sure still exists.
 */
export default function useStageManager() {
	// Whether we're currently on the search stage.
	const isSearch = computed(() => stage.value === "search");
	// Whether we're currently on the results stage.
	const isList = computed(() => stage.value === "results");
	// Whether we're currently on the details stage.
	const isSets = computed(() => stage.value === "sets");

	/**
	 * Set the current stage to results.
	 */
	function goToSearch() {
		stage.value = "search";
	}

	/**
	 * Set the current stage to results.
	 */
	function goToList() {
		stage.value = "results";
	}

	/**
	 * Set the current stage to details.
	 */
	function goToSets() {
		stage.value = "sets";
	}

	/**
	 * Reset the stage manager to its internal default state.
	 */
	function reset() {
		goToSearch();
	}

	return {
		isSearch,
		isList,
		isSets,
		goToSearch,
		goToList,
		goToSets,
		reset,
	};
}
