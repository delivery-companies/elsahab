import { api } from "@/api";
import { markNotificationAsReadEndpoint } from "@/api/apisUrl";

export const markAllNotificationsAsReadService = async () => {
    const response = await api.patch(markNotificationAsReadEndpoint, {
        seen: true
    });
    return response.data;
};
