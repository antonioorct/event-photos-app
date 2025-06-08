import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";

dayjs.extend(duration);
dayjs.extend(utc);

dayjs.extend((_, c) => {
    c.prototype.formatDate = function () {
        return formatDate(this);
    };
});

export function getLocale() {
    if (typeof navigator !== "undefined" && navigator.language) {
        return navigator.language;
    }

    return "en-US";
}

export function formatDate(date: string | number | Date | Dayjs) {
    if (typeof date === "string") {
        const parts = date.split("-");

        if (parts.length === 1) {
            // Year only
            return parts[0];
        } else if (parts.length === 2) {
            // Year and month
            const date = dayjs(`${parts[0]}-${parts[1]}-01`);
            return date.format("MMMM YYYY");
        }

        // Full date
        return dayjs.utc(date).formatDate();
    }

    const locale = getLocale();

    const parsedDate = dayjs.utc(date);

    const formatter = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    });

    return formatter.format(parsedDate.toDate());
}

export function toInputDate(date: string) {
    return dayjs.utc(date).format("YYYY-MM-DD");
}

export default dayjs;
