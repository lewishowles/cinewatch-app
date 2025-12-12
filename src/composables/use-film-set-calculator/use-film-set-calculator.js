import { arrayLength, isNonEmptyArray } from "@lewishowles/helpers/array";
import { computed, ref } from "vue";
import { firstDefined } from "@lewishowles/helpers/array";
import { get, isNonEmptyObject, keyBy, pick } from "@lewishowles/helpers/object";
import { getMillisecondsBetweenDateStrings, isTimeAfterTime, parseTimeStringToDate } from "./helpers";
import { isNumber, isNumeric } from "@lewishowles/helpers/number";
import { nanoid } from "nanoid";
import { validateOrFallback } from "@lewishowles/helpers/general";

import useFilmFinder from "@/composables/use-film-finder/use-film-finder";

const { haveFilms, availableFilms } = useFilmFinder();

// The default gap between films.
const defaultFilmGapMinutes = 20;
// Our minimum gap between films, allowing for breaks, trailers, etc.
const minimumFilmGapMinutes = ref(defaultFilmGapMinutes);
// The earliest start time for our sets.
const earliestStartTime = ref(null);
// The latest end time for our sets.
const latestEndTime = ref(null);
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

	// Our selected films, keyed by their film ID
	const selectedFilmsById = computed(() => {
		if (!isNonEmptyArray(selectedFilms.value)) {
			return {};
		}

		return keyBy(selectedFilms.value, "id");
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
						screening_type: screening.label,
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
			return null;
		}

		// Flatten all selected films into a list of screening nodes
		let nodes = selectedFilmTimes.value.flatMap(film =>
			film.times.map(time => ({ film_id: film.id, ...time })),
		);

		// We assume all films occur on the same day, so we will use the date of
		// the first film in our node list as a baseline for our earliest start
		// and latest end times.
		const firstNode = firstDefined(nodes);
		const baseDate = get(firstNode, "start.value");
		// Parse the user's earliest start time.
		const earliestStartDate = parseTimeStringToDate(earliestStartTime.value, new Date(baseDate));
		// Parse the user's latest end time.
		const latestEndDate = parseTimeStringToDate(latestEndTime.value, new Date(baseDate));

		// Filter our nodes to those that fit within the defined constraints,
		// that is, earliest start time and latest end time.
		nodes = nodes.filter(node => {
			const filmStart = new Date(get(node, "start.value"));
			const filmEnd = new Date(get(node, "end.value"));

			return (earliestStartDate === null || filmStart >= earliestStartDate) && (latestEndDate === null || filmEnd <= latestEndDate);
		});

		// Build an adjacency list. For each node, which screenings can follow
		// it?
		const edges = new Map();

		// Define our film gap.
		const filmGap = validateOrFallback(minimumFilmGapMinutes.value, isNumeric, defaultFilmGapMinutes);

		nodes.forEach(node => {
			const firstTimeString = get(node, "end.value");

			const nextNodes = nodes.filter(otherFilm => {
				const secondTimeString = get(otherFilm, "start.value");

				return otherFilm.film_id !== node.film_id &&
					isTimeAfterTime(firstTimeString, secondTimeString, parseInt(filmGap));
			});

			edges.set(node, nextNodes.map(nextFilm => {
				const secondTimeString = get(nextFilm, "start.value");

				return {
					node: nextFilm,
					waitTime: getMillisecondsBetweenDateStrings(firstTimeString, secondTimeString),
				};
			}));
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

		// Sort our sets.
		results.sort((a, b) => {
			// Maximum number of films seen takes priority, given we're allowing
			// partial sets.
			if (b.films_seen !== a.films_seen) {
				return b.films_seen - a.films_seen;
			}

			// The wait time between films is secondary.
			return a.total_wait - b.total_wait;
		});

		return results.map((result, index) => {
			result.continuous_index = index + 1;

			return result;
		});
	});

	// Whether any film sets could be found.
	const haveFilmSets = computed(() => isNonEmptyArray(filmSets.value));

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
		const filmId = get(startFilm, "film_id");

		if (!filmId) {
			return;
		}

		const visitedFilmSet = visitedFilms instanceof Set
			? visitedFilms
			: new Set(visitedFilms);

		visitedFilmSet.add(filmId);

		const newPath = [
			...path,
			{
				...pick(selectedFilmsById.value[filmId], ["title", "poster"]),
				...startFilm,
			},
		];

		// Always push the current path, even if it's partial. This allows us to
		// track partial sequences, in case the full sequence is unobtainable or
		// contains too much waiting, for example.
		results.push({
			id: nanoid(),
			path: newPath,
			films_seen: newPath.length,
			total_wait: totalWaitTime,
		});

		// Get all possible next edges.
		const nextEdges = edges?.get(startFilm) || [];

		nextEdges.forEach(({ node: nextFilm, waitTime }) => {
			const nextFilmId = get(nextFilm, "film_id");

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
		earliestStartTime,
		filmGraph,
		filmScreeningTypes,
		filmSets,
		haveFilmSets,
		latestEndTime,
		minimumFilmGapMinutes,
		resetFilmSets,
		selectedFilmScreeningTypes,
		selectedFilmTimes,
		selectedFilms,
		selectedFilmsCount,
	};
}
