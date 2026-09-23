// Names of the days.
export const DAY_NAMES = [
    "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"
];

// Names of the months.
export const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];


// Get today's year and month.
export function getToday() {
    const today = new Date();

    return {
        year: today.getFullYear(),
        monthIndex: today.getMonth(),
    };
}
export function formatTime(time24) {
    const [hourStr, minuteStr] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minuteStr} ${period}`;
}


// Convert a number into a 2-digit string.
export function pad2(n) {
    return String(n).padStart(2, "0");
}


// Create a date in YYYY-MM-DD format.
export function toISODate(year, monthIndex, day) {
    return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`;
}


// Get the number of days in a specific month.
export function daysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
}