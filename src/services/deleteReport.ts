import { api } from "@/api";
import { deleteReportEndpoint } from "@/api/apisUrl";

export const deleteReportService = async ({ id }: { id: number }) => {
    const response = await api.delete(deleteReportEndpoint + id);
    return response.data;
};
