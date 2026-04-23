import type { orderStatusArabicNames } from "./orderStatusArabicNames";

interface RepositoryEntriesStatus {
    label: string;
    value: keyof typeof orderStatusArabicNames;
}

export const repositoryEntriesStatuses: RepositoryEntriesStatus[] = [
    {
        label: "راجع كلي",
        value: "RETURNED"
    },
    {
        label: "راجع جزئياً",
        value: "PARTIALLY_RETURNED"
    },
    {
        label: "استبدال",
        value: "REPLACED"
    }
];
