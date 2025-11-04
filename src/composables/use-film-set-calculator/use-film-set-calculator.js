import { arrayLength, isNonEmptyArray } from "@lewishowles/helpers/array";
import { computed, ref } from "vue";
import { get, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNumber } from "@lewishowles/helpers/number";

import useFilmFinder from "@/composables/use-film-finder/use-film-finder";

const { haveFilms, availableFilms } = useFilmFinder();

// Our minimum gap between films, allowing for breaks, trailers, etc.
const MINIMUM_FILM_GAP_MINUTES = 20;

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

	// Build a graph of all possible film screenings and valid transitions
	// between them.
	// - Each node is one film screening at a specific time
	// - Each edge is a valid "hop" from one screening to another, with a wait
	//   time
	// - Edges is a map of all possible nodes following a given node, that is,
	//   "given a `node`, where can I go from here that is valid?"
	const filmGraph = computed(() => {
		if (!isNonEmptyArray(selectedFilmTimes.value)) {
			return [];
		}

		// Flatten all selected films into a list of screening nodes
		const nodes = selectedFilmTimes.value.flatMap(film =>
			film.times.map(time => ({ filmId: film.id, ...time })),
		);

		// Build an adjacency list. For each node, which screenings can follow
		// it?
		const edges = new Map();

		nodes.forEach(node => {
			const nextNodes = nodes.filter(
				other => other.filmId !== node.filmId && canFilmFollow(node, other),
			);

			edges.set(node, nextNodes.map(next => ({
				node: next,
				waitTime: getWaitBetweenTimes(node, next),
			})));
		});

		return { nodes, edges };
	});

	// Our film sets. These are the list of all sets that we can create from the
	// selected films and times.
	const filmSets = computed(() => {
		if (!isNonEmptyArray(get(filmGraph.value, "nodes"))) {
			return [];
		}

		const results = [];

		// Start our search from each possible node.
		filmGraph.value.nodes.forEach(startNode => {
			explorePaths(startNode, new Set(), [], 0, get(filmGraph.value, "edges"), results);
		});

		return results.sort((a, b) => {
			// Maximum number of films seen takes priority, given we're allowing
			// partial sets.
			if (b.filmsSeen !== a.filmsSeen) {
				return b.filmsSeen - a.filmsSeen;
			}

			// The wait time between films is secondary.
			return a.totalWait - b.totalWait;
		});
	});

	/**
	 * Determine the wait time between two "times", e.g.
	 * "start": { "label": "16:50", "value": "2025-10-29T16:50:00.000Z" }
	 *
	 * @param  {object}  firstFilmTime
	 *     The time of the first film screening.
	 * @param  {object}  secondFilmTime
	 *     The time of the second film screening.
	 */
	function getWaitBetweenTimes(firstFilmTime, secondFilmTime) {
		const start = new Date(get(secondFilmTime, "start.value"));
		const end = new Date(get(firstFilmTime, "end.value"));

		if (isNaN(start.getTime()) || isNaN(end.getTime())) {
			return null;
		}

		return start.getTime() - end.getTime();
	}

	/**
	 * Determine whether a film screening can follow another, by determining
	 * whether the gap between them exceeds the minimum threshold set by the
	 * user.
	 *
	 * @param  {object}  firstFilmTime
	 *     The time of the first film screening.
	 * @param  {object}  secondFilmTime
	 *     The time of the second film screening.
	 */
	function canFilmFollow(firstFilmTime, secondFilmTime) {
		const gap = getWaitBetweenTimes(firstFilmTime, secondFilmTime);

		return gap >= MINIMUM_FILM_GAP_MINUTES * 60 * 1000;
	}

	/**
	 * A depth‑first search to explore all possible paths through the graph.
	 * Starting with a given film, determine the path that allows us to watch
	 * all films, where each new film starts after the previous film, accounting
	 * for the user-defined minimum wait time.
	 *
	 * @param  {object}  startFilm
	 *     The film to start with.
	 * @param  {array}  visitedFilms
	 *     The list of films already visited.
	 * @param  {array}  path
	 *     The path containing the film sequence so far.
	 * @param  {type}  totalWaitTime
	 *     The total wait time, in milliseconds, between films in our path so far.
	 * @param  {Map}  edges
	 *     The edges of our film graph.
	 * @param  {array}  results
	 *     An array of results that is built up when a film sequence is complete.
	 */
	// Depth‑first search to explore all possible film sequences.
	// Guards against invalid inputs so we don't recurse into bad data.
	function explorePaths(startFilm, visitedFilms, path, totalWaitTime, edges, results) {
		const startFilmId = get(startFilm, "filmId");

		if (!startFilmId) {
			return;
		}

		const visitedFilmSet = visitedFilms instanceof Set
			? visitedFilms
			: new Set(visitedFilms);

		visitedFilmSet.add(startFilmId);

		const newPath = [...path, startFilm];

		// Always push the current path, even if it's partial. This allows us to
		// track partial sequences, in case the full sequence is unobtainable or
		// contains too much waiting, for example.
		results.push({
			path: newPath,
			filmsSeen: visitedFilmSet.size,
			totalWait: totalWaitTime,
		});

		// Get all possible next edges.
		const nextEdges = edges?.get(startFilm) || [];

		nextEdges.forEach(({ node: nextFilm, waitTime }) => {
			const nextFilmId = get(nextFilm, "filmId");

			if (!nextFilmId) {
				return;
			}

			if (!isNumber(waitTime)) {
				return;
			}

			// Skip a film that we've already seen.
			if (visitedFilmSet.has(nextFilmId)) {
				return;
			}

			explorePaths(
				nextFilm,
				visitedFilmSet,
				newPath,
				totalWaitTime + waitTime,
				edges,
				results,
			);
		});
	}

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
		filmGraph,
		filmSets,
		resetFilmSets,
	};
}
