import { format, parseISO } from "date-fns";

export const convertDateFormat = (date: Date | null): string | null => {
    if (date) {
        const parsedDate = parseISO(date.toISOString());
        return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    }
    return null;
};
