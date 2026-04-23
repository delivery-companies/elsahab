import { getNotificationsService } from "@/services/getNotifications";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useNotifications = () => {
    return useInfiniteQuery(
        ["notifications"],
        ({ pageParam = 1 }) => {
            return getNotificationsService(pageParam);
        },
        {
            getNextPageParam: (lastPage) => {
                if (lastPage.page < lastPage.pagesCount) {
                    return lastPage.page + 1;
                }
                return undefined;
            }
        }
    );
};
