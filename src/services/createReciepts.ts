import { api } from "@/api";
import { AxiosError } from "axios";
import FileSaver from "file-saver";

export interface CreateOrderReceiptItem {
  storeId: number;
  branchId: number;
  notes: string;
}

export type CreateOrderReceiptPayload = CreateOrderReceiptItem[];

export const createReceiptsService = async (
  data: CreateOrderReceiptPayload
) => {
  try {
    const response = await api.post("/generate-receipts", data, {
      responseType: "arraybuffer",
    });

    const contentType = response.headers["content-type"];

    if (contentType === "application/pdf") {
      const blob = new Blob([response.data], { type: "application/pdf" });
      FileSaver.saveAs(blob, `ملصقات العميل.pdf`);
      response.config.responseType = "blob";
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, "_blank"); // Opens the file in a new tab
      return response.data;
    }
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const data = JSON.parse(new TextDecoder().decode(error.response?.data));
      throw data;
    }
  }
};
