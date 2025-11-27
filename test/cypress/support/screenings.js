
/**
 * Create a sample screening with one time, minimising boilerplate for sample
 * data.
 *
 * @param  {string}  id
 *     The ID of this screening, which should be unique amongst screenings
 * @param  {string}  label
 *     The type of screening (e.g. 2D)
 * @param  {string}  start
 *     The start time of the screening, in hh:mm format
 * @param  {string}  end
 *     The end time of the screening, in hh:mm format
 */
export function createQuickScreening({ id = "1", label = "2D", start = "10:00", end = "12:00" } = {}) {
	return {
		id,
		label,
		times: [createScreeningTime(start, end)],
	};
}

/**
 * Create a sample time for a screening, minimising boilerplate for sample data.
 *
 * @param  {string}  start
 *     The start time of the screening, in hh:mm format
 * @param  {string}  end
 *     The end time of the screening, in hh:mm format
 */
export function createScreeningTime(start, end) {
	return {
		start: { label: start, value: `2025-10-29T${start}:00.000Z` },
		end: { label: end, value: `2025-10-29T${end}:00.000Z` },
	};
}
