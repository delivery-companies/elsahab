export const reduceUnusedReportsFilters = <T>(params?: T) => {
    const minifiedParams =
        params &&
        Object.keys(params).reduce((acc, key) => {
            if (
                params &&
                params[key as keyof T] !== "" &&
                params[key as keyof T] !== undefined &&
                params[key as keyof T] !== 0 &&
                key !== "page" &&
                key !== "size"
            ) {
                if (key === "statuses") {
                    return {
                        ...acc,
                        statuses: (params[key as keyof T] as string[])?.length
                            ? (params[key as keyof T] as string[]).join(",")
                            : undefined
                    };
                }
                if (
                    key === "branch_report" ||
                    key === "client_report" ||
                    key === "company_report" ||
                    key === "delivery_agent_report" ||
                    key === "governorate_report" ||
                    key === "repository_report"
                ) {
                    return {
                        ...acc,
                        [key]: params[key as keyof T] === "1"
                    };
                }
                if (key === "confirmed") {
                    return {
                        ...acc,
                        confirmed: !!(params[key as keyof T] as boolean)
                    };
                }

                return {
                    ...acc,
                    [key]: params[key as keyof T]
                };
            }
            return acc;
        }, {});

    return params ? minifiedParams : undefined;
};
