import { isNonEmptyString } from "@lewishowles/helpers/string";
import { isNumber } from "@lewishowles/helpers/number";

const MINUTES_TO_MILLISECONDS_FACTOR = 60000;

/**
 * Parse a given time string (e.g. 16:00) to a Date object, returning null if a
 * valid time can't be parsed. We use a comparison date as our base date, rather
 * than always assuming "today".
 *
 * @param  {string}  timeString
 *     The string representing the time to parse, e.g. "16:00"
 * @param  {Date}  comparisonDate
 *     The date to use to fill in the missing parts of the final date.
 */
export function parseTimeStringToDate(timeString, comparisonDate) {
	// Our time must at least be a string with a colon.
	if (!isNonEmptyString(timeString) || !timeString.includes(":")) {
		return null;
	}

	// Our string could be between four and five characters, allowing AM times
	// to include or exclude any leading zero.
	if (![4, 5].includes(timeString.length)) {
		return null;
	}

	const [hours, minutes] = timeString.split(":").map(segment => parseInt(segment));

	if (hours < 0 || hours > 23) {
		return null;
	}

	if (minutes < 0 || minutes > 59) {
		return null;
	}

	let date = new Date();

	// If we can't find a comparison date, we default to today, but this may
	// produce undesired results.
	if (comparisonDate instanceof Date) {
		date = new Date(comparisonDate);
	}

	date.setHours(hours);
	date.setMinutes(minutes);
	date.setSeconds(0);
	date.setMilliseconds(0);

	return date;
}

/**
 * Determine the absolute number of milliseconds between two string date time
 * representations.
 *
 * @param  {string}  firstDateString
 *     The first time to compare, e.g. "2025-10-29T16:50:00.000Z"
 * @param  {string}  secondDateString
 *     The second time to compare, e.g. "2025-10-29T16:50:00.000Z"
 * @param  {boolean}  absolute
 *     Whether to determine the absolute gap between times, or as they are
 *     provided.
 */
export function getMillisecondsBetweenDateStrings(firstDateString, secondDateString, absolute = true) {
	if (!isNonEmptyString(firstDateString) || !isNonEmptyString(secondDateString)) {
		return null;
	}

	const firstTime = new Date(firstDateString);
	const secondTime = new Date(secondDateString);

	if (isNaN(firstTime.getTime()) || isNaN(secondTime.getTime())) {
		return null;
	}

	const difference = secondTime.getTime() - firstTime.getTime();

	if (!absolute) {
		return difference;
	}

	return Math.abs(difference);
}

/**
 * Determine whether two times can follow one another, by determining whether
 * the gap between them exceeds the provided minimum threshold.
 *
 * @param  {string}  firstDateString
 *     The first time to compare, e.g. "2025-10-29T16:50:00.000Z"
 * @param  {string}  secondDateString
 *     The second time to compare, e.g. "2025-10-29T16:50:00.000Z"
 * @param  {number}  minimumGapInMinutes
 *     The minimum gap expected between films, in minutes.
 */
export function isTimeAfterTime(firstDateString, secondDateString, minimumGapInMinutes) {
	if (!isNonEmptyString(firstDateString) || !isNonEmptyString(secondDateString)) {
		return false;
	}

	const gap = getMillisecondsBetweenDateStrings(firstDateString, secondDateString, false);

	if (!isNumber(gap)) {
		return false;
	}

	if (!isNumber(minimumGapInMinutes)) {
		return gap >= 0;
	}

	return gap >= minimumGapInMinutes * MINUTES_TO_MILLISECONDS_FACTOR;
}
