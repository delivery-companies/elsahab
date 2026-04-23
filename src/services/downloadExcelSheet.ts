import { api } from "@/api";
import { AxiosError } from "axios";
import FileSaver from "file-saver";

export const downloadExcelSheet = async () => {
  try {
    const response = await api.get(`/orders/getOrdersSheet`, {
      responseType: "arraybuffer",
    });

    const contentType = response.headers["content-type"];

    if (
      contentType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      FileSaver.saveAs(blob, `orderSheet.xlsx`);
      // const fileURL = URL.createObjectURL(blob);
      // window.open(fileURL, "_blank"); // Opens the file in a new tab
      return;
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const data = JSON.parse(new TextDecoder().decode(error.response?.data));
      throw data;
    }
  }
};
