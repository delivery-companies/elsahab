import { api } from "@/api";
import { getUsersLoginHistoryEndpoint } from "@/api/apisUrl";

export interface GetUsersLoginHistoryResponse {
    status: string;
    data: {
        id: number;
        ip: string;
        device: string;
        platform: string;
        browser: string;
        location: string;
        createdAt: string;
        user: {
            id: number;
            name: string;
            username: string;
            role: string;
        };
    }[];
    pagesCount: number;
    page: number;
}

export interface UsersLoginHistory {
    id: number;
    ip: string;
    device: string;
    platform: string;
    browser: string;
    location: string;
    createdAt: string;
    user: {
        id: number;
        name: string;
        username: string;
        role: string;
    };
}

export interface UsersLoginHistoryFilters {
    user_id?: number;
    page?: number;
    size?: number;
    pagesCount?: number;
}

export const getUsersLoginHistoryService = async ({
    user_id,
    page = 1,
    size = 10
}: UsersLoginHistoryFilters) => {
    const response = await api.get<GetUsersLoginHistoryResponse>(getUsersLoginHistoryEndpoint, {
        params: {
            user_id,
            page,
            size
        }
    });
    return response.data;
};
