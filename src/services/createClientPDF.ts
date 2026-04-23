import { api } from "@/api";
import { exportClientReportEndpoint } from "@/api/apisUrl";
import { AxiosError, type AxiosResponse } from "axios";
import FileSaver from "file-saver";
import type { ReportsFilters } from "./getReports";

type CreateAllClientReportPDFPayload = {
    reportsIDs: "*";
    type: "CLIENT";
    params: ReportsFilters;
};

export type CreateClientReportPDFByIDsPayload = {
    reportsIDs: number[];
    type: "CLIENT";
};

export type CreateAllTreasuryReportPDFPayload = {
    reportsIDs: "*";
    params: ReportsFilters;
};

export type CreateTreasuryReportPDFByIDsPayload = {
    reportsIDs: number[];
    params: ReportsFilters;
};

export type CreateClientReportPDFPayload =
    | CreateAllClientReportPDFPayload
    | CreateClientReportPDFByIDsPayload
    | CreateAllTreasuryReportPDFPayload
    | CreateTreasuryReportPDFByIDsPayload;

export const createClientPDFService = async (data: CreateClientReportPDFPayload) => {
    try {
        const response = await api.post<CreateClientReportPDFPayload, AxiosResponse<never>>(
            exportClientReportEndpoint,
            data,
            {
                responseType: "arraybuffer",
                params: data.reportsIDs === "*" ? data.params : undefined
            }
        );

        const contentType = response.headers["content-type"];

        if (contentType === "application/pdf") {
            const blob = new Blob([response.data], { type: "application/pdf" });
            FileSaver.saveAs(blob, "كشف.pdf");
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL, "_blank"); // Opens the file in a new tab
            return;
        }
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const data = JSON.parse(new TextDecoder().decode(error.response?.data));
            throw data;
        }
    }
};
