import { isNumber } from "@lewishowles/helpers/number";

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
	 * @returns {string}
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
	 * @param  {Number}  milliseconds
	 *     The milliseconds to convert
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

	return {
		dateDifference,
		millisecondsToHumanTime,
	};
}
