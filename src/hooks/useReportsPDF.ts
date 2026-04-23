import { getReportPDFService } from "@/services/getReportPDF";
import { useMutation } from "@tanstack/react-query";

export const useReportsPDF = (name: string) => {
    return useMutation({
        mutationFn: (reportID: number) => getReportPDFService(reportID, name)
    });
};
