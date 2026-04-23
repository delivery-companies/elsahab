import { api } from "@/api";
import { getBranchDetailsEndpoint } from "@/api/apisUrl";

export interface Branch {
  id: number;
  name: string;
  email: string;
  phone: string;
  governorate: string;
  branchCLient: number;
  branchOrder: number;
}

export interface GetBranchesResponse {
  status: string;
  data: Branch;
}

export const getBranchDetails = async (id: number) => {
  const response = await api.get<GetBranchesResponse>(
    getBranchDetailsEndpoint + id
  );
  return response.data;
};
