import { api } from "@/api";
import { markNotificationAsReadEndpoint } from "@/api/apisUrl";

export const markNotificationAsSeenService = async ({ id }: { id: number }) => {
    const response = await api.patch(markNotificationAsReadEndpoint + id, {
        seen: true
    });
    return response.data;
};
