import { isNonEmptyString } from "@lewishowles/helpers/string";
import { isNumber, round } from "@lewishowles/helpers/number";

/**
 *
 */
export default function useDateHelpers() {
	/**
	 * Determine the difference between two dates in a human-readable format.
	 *
	 * @param  {Date}  startDate
	 *     The start date
	 * @param  {Date}  endDate
	 *     The end date
	 *
	 * @returns  {string}
	 */
	function dateDifference(startDate, endDate) {
		if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
			return "Unknown";
		}

		const difference = Math.abs(startDate.getTime() - endDate.getTime());

		return millisecondsToHumanTime(difference);
	}

	/**
	 * Convert a provided milliseconds value to a human-readable time with hours
	 * and minutes.
	 *
	 * @param  {number}  milliseconds
	 *     The milliseconds to convert
	 *
	 * @returns  {string}
	 */
	function millisecondsToHumanTime(milliseconds) {
		if (!isNumber(milliseconds)) {
			return "Unknown";
		}

		const totalMinutes = Math.floor(milliseconds / (1000 * 60));
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;

		const parts = [];

		if (hours > 0) {
			parts.push(`${hours}h`);
		}

		if (minutes > 0) {
			parts.push(`${minutes}m`);
		}

		return parts.join(" ") || "0m";
	}

	/**
	 * Given a date, get a percentage representing how far through its day the
	 * time of that date is, e.g. 50% for 12:00.
	 *
	 * We allow for a Date object, or a string representing a date.
	 *
	 * @param  {Date}  date
	 *     The date to convert.
	 *
	 * @returns  {string}
	 */
	function getDayProgress(date) {
		if (!(date instanceof Date) && !isNonEmptyString(date)) {
			return 0;
		}

		if (!(date instanceof Date)) {
			date = new Date(date);
		}

		if (isNaN(date)) {
			return 0;
		}

		const millisecondsInDay = 86400000;

		const millisecondsSinceMidnight =
			date.getHours() * 60 * 60 * 1000 +
			date.getMinutes() * 60 * 1000 +
			date.getSeconds() * 1000 +
			date.getMilliseconds();

		return round((millisecondsSinceMidnight / millisecondsInDay) * 100, 2);
	}

	return {
		dateDifference,
		getDayProgress,
		millisecondsToHumanTime,
	};
}
