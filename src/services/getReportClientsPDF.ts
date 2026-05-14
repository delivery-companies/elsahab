import { api } from "@/api";
import { AxiosError } from "axios";
import FileSaver from "file-saver";
export const getReportClientsPDF = async (reportID: number, name: string) => {
  try {
    const response = await api.get(`/reports/clients/${reportID}/pdf`, {
      responseType: "blob", // blob is better than arraybuffer
    });

    const contentType = response.headers["content-type"];

    // Only when content-type is PDF
    if (contentType === "application/pdf") {
      const blob = new Blob([response.data], { type: "application/pdf" });

      // 👉 1. Open PDF in a new window first
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, "_blank"); // works without popup block

      // 👉 2. Then save it
      FileSaver.saveAs(blob, `${name}.pdf`);

      return;
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const text = await error.response?.data.text();
      throw JSON.parse(text);
    }
  }
};
