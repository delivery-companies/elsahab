import { api } from "@/api";
import { AxiosError } from "axios";
import FileSaver from "file-saver";

export const saveOrder = async (data: {
  storeId: number;
  orderId: string;
  companyId: number;
  type: string;
  repository: number;
}) => {
  const response = await api.post("/customerOutput", data);
  return response.data;
};

export const getCustomerOrders = async (filters: {
  repository: number;
  storeId: number;
  companyId: number;
  type: string;
  page: number;
  size: number;
}) => {
  const response = await api.get("/customerOutput", { params: filters });
  return response.data;
};

export const saveAndCreateReport = async (data: {
  companyId: number;
  type: string;
  storeId: number;
  repositoryId: number;
  repositoryName: string;
  orderIds?: string[];
}) => {
  try {
    const response = await api.post(
      "/customerOutputReport",
      {
        ...data,
      },
      {
        responseType: "arraybuffer",
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
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const data = JSON.parse(new TextDecoder().decode(error.response?.data));
      throw data;
    }
  }
};
