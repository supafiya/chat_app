module.exports = function (type, style="1") {

	let dateObj = new Date();

	let year = dateObj.getFullYear();
	let month = dateObj.getMonth() + 1;
	let dayN = dateObj.getDay();
	let day = dateObj.getDate();
	let hours = dateObj.getHours();
	let minutes = dateObj.getMinutes();
	let seconds = dateObj.getSeconds();
	let millisec = dateObj.getMilliseconds();

	// get the name of the current day.
	let getDayName = (input) => {
		switch (input) {
			case 0:
				return 'Sunday';
				break;
			case 1:
				return 'Monday';
				break;
			case 2:
				return 'Tuesday';
				break;
			case 3:
				return 'Wednesday';
				break;
			case 4:
				return 'Thursday';
				break;
			case 5:
				return 'Friday';
				break;
			case 6:
				return 'Saturday';
				break;
			default:
				return 'Invalid day.';
				break;
		}
	};

	// get the name of the current month
	let getMonthName = (input) => {
		switch (input) {
			case 1:
				return 'January';
				break;
			case 2:
				return 'February';
				break;
			case 3:
				return 'March';
				break;
			case 4:
				return 'April';
				break;
			case 5:
				return 'May';
				break;
			case 6:
				return 'June';
				break;
			case 7:
				return 'July';
				break;
			case 8:
				return 'August';
				break;
			case 9:
				return 'September';
				break;
			case 10:
				return 'October';
				break;
			case 11:
				return 'November';
				break;
			case 12:
				return 'December';
				break;
			default:
				return 'Invalid month.';
				break;
		}
	};

	let dayPrefix = (day) => {
		switch (day) {
			case 1:
				return 'st';
			case 2:
				return 'nd';
			case 3:
				return 'rd';
			default:
				return 'th';
		}
	};

	let americanHours = (num) => {
		switch (num) {
			case 0:
				return [12, 'am'];
				break;
			case 1:
				return [1, 'am'];
				break;
			case 2:
				return [2, 'am'];
				break;
			case 3:
				return [3, 'am'];
				break;
			case 4:
				return [4, 'am'];
				break;
			case 5:
				return [5, 'am'];
				break;
			case 6:
				return [6, 'am'];
				break;
			case 7:
				return [7, 'am'];
				break;
			case 8:
				return [8, 'am'];
				break;
			case 9:
				return [9, 'am'];
				break;
			case 10:
				return [10, 'am'];
				break;
			case 11:
				return [11, 'am'];
				break;
			case 12:
				return [12, 'pm'];
				break;
			case 13:
				return [1, 'pm'];
				break;
			case 14:
				return [2, 'pm'];
				break;
			case 15:
				return [3, 'pm'];
				break;
			case 16:
				return [4, 'pm'];
				break;
			case 17:
				return [5, 'pm'];
				break;
			case 18:
				return [6, 'pm'];
				break;
			case 19:
				return [7, 'pm'];
				break;
			case 20:
				return [8, 'pm'];
				break;
			case 21:
				return [9, 'pm'];
				break;
			case 22:
				return [10, 'pm'];
				break;
			case 23:
				return [11, 'pm'];
				break;
			default:
				return 'Invalid time.';
				break;
		}
	};

	let prefixNumber = (num) => {
		if (num <= 9) {
			return `0${num}`;
		} else {
			return num;
		}
	};

	let getFullDate = (style) => {
		if (style === 1) {	// ex: Friday, September 29th
			return `${getDayName(dayN)}, ${getMonthName(month)} ${day}${dayPrefix(day)}`;
		} else if (style === 2) { // ex: 9/28/2018
			return `${month}/${day}/${year}`
		}
	};

	let getTimeOfDay = (style) => {
		let minPrefix = prefixNumber(minutes);
		let secPrefix = prefixNumber(seconds);

		if (style === 1) { // ex: 1:43pm
			return `${americanHours(hours)[0]}:${minPrefix}${americanHours(hours)[1]}`;
		} else if (style === 2) { // ex: 13:43pm
			return `${hours}:${minPrefix}`;
		}	else if (style === 3) { // ex: 13:43:03 / h:m:s
			return `${hours}:${minPrefix}:${secPrefix}`
		} else if (style === 4) { // ex: 13:43:03:220 / h:m:s:ms
			return `${hours}:${minPrefix}:${secPrefix}:${millisec}`
		} else {
			return 'Time style needs to be defined!';
		}
	};


if (type === 'month') {
		return month;

	} else if (type === 'day') {
		return day;

	} else if (type === 'dayName') {
		return getDayName(dayN);

	}	else if (type === 'fullDate') {
		return getFullDate(style);

	} else if (type === 'ms') {
		return ms;

	}	else if (type === 'timeOfDay') {
		return getTimeOfDay(style);
	}




}; // end of main function


