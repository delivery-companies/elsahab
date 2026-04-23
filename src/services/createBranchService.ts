import { api } from "@/api";
import { createBranchEndpoint } from "@/api/apisUrl";

export interface CreateBranchPayload {
  name: string;
  governorate: string;
}

export const createBranchService = async (data: CreateBranchPayload) => {
  const response = await api.post<CreateBranchPayload>(
    createBranchEndpoint,
    data
  );
  return response.data;
};
