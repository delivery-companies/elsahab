import { api } from "@/api";
import { changeReportStatusEndpoint } from "@/api/apisUrl";
import type { reportStatusArabicNames } from "@/lib/reportStatusArabicNames";

export interface ChangeReportStatusPayload {
    status?: keyof typeof reportStatusArabicNames;
    repositoryID?: number;
}

export const editReportService = async (reportId: number, payload: ChangeReportStatusPayload) => {
    const response = await api.patch(`${changeReportStatusEndpoint}${reportId}`, payload);
    return response.data;
};
