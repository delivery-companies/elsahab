import { api } from "@/api";
import { deleteReportEndpoint } from "@/api/apisUrl";

export const activateReportService = async ({ id }: { id: number }) => {
    const response = await api.patch(`${deleteReportEndpoint + id}/reactivate`);
    return response.data;
};
