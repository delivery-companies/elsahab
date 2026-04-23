import { api } from "@/api";
import { getNotificationsEndpoint } from "@/api/apisUrl";

export interface Notification {
    id: number;
    title: string;
    content: string;
    seen: boolean;
    createdAt: string;
}

export interface GetNotificationsResponse {
    status: string;
    page: number;
    pagesCount: number;
    data: Notification[];
}

export const getNotificationsService = async (page = 1) => {
    const response = await api.get<GetNotificationsResponse>(getNotificationsEndpoint, {
        params: {
            page,
            seen: true
        }
    });
    return response.data;
};
