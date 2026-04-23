import { getUsersLoginHistoryService, type UsersLoginHistoryFilters } from "@/services/getUsersLoginHistory";
import { useQuery } from "@tanstack/react-query";

export const useUsersLoginHistory = (
    { page = 1, size = 10, user_id }: UsersLoginHistoryFilters = {
        page: 1,
        size: 10
    }
) => {
    return useQuery({
        queryKey: ["users-login-history", { page, size, user_id }],
        queryFn: () =>
            getUsersLoginHistoryService({
                page,
                size,
                user_id
            })
    });
};
