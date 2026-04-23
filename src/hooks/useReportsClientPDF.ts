import { getReportClientsPDF } from "@/services/getReportClientsPDF";
import { useMutation } from "@tanstack/react-query";

export const useReportsClientPDF = (name: string) => {
  return useMutation({
    mutationFn: (reportID: number) => getReportClientsPDF(reportID, name),
  });
};
