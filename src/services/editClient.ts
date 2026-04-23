import { api } from "@/api";
import { editClientEndpoint } from "@/api/apisUrl";
import type { clientTypeArabicNames } from "@/lib/clientTypeArabicNames";

export interface EditClientPayload {
  name: string;
  phone: string;
  role: keyof typeof clientTypeArabicNames;
  token: string;
  password?: string;
  branchID: number;
  showNumbers: boolean;
}

export const editClientService = async ({
  data,
  id,
}: {
  data: FormData;
  id: number;
}) => {
  const response = await api.patch<FormData>(editClientEndpoint + id, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
