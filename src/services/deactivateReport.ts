import { api } from "@/api";
import { deleteReportEndpoint } from "@/api/apisUrl";

export const deactivateReportService = async ({ id }: { id: number }) => {
    const response = await api.patch(`${deleteReportEndpoint + id}/deactivate`);
    return response.data;
};
