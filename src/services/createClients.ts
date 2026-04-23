import { api } from "@/api";
import { createClientEndpoint } from "@/api/apisUrl";
import type { clientTypeArabicNames } from "@/lib/clientTypeArabicNames";
import type { AxiosResponse } from "axios";

export interface CreateClientPayload {
  name: string;
  phone: string;
  role: keyof typeof clientTypeArabicNames;
  token: string;
  password: string;
  branchID: number;
  username: string;
  showNumbers: boolean;
  showDeliveryNumber: boolean;
}

interface CreateClientServiceResponse {
  status: string;
  data: {
    id: number;
    name: string;
    username: string;
    showNumbers: boolean;
    phone: string;
    role: keyof typeof clientTypeArabicNames;
  };
}

export const createClientsService = async (data: FormData) => {
  const response = await api.post<
    FormData,
    AxiosResponse<CreateClientServiceResponse>
  >(createClientEndpoint, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const generateApiKey = async (id: number) => {
  const response = await api.post<
    FormData,
    AxiosResponse<{ status: string; apiKey: string }>
  >("/clients/api-key", {
    id: id,
  });
  return response.data;
};
