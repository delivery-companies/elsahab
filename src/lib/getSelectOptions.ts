export const getSelectOptions = <T extends { id: number; name: string }>(
    data: T[]
): { value: string; label: string }[] => {
    return data.map((item) => ({
        value: item.id.toString(),
        label: item.name
    }));
};
