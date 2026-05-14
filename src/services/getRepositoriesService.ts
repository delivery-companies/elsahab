import { api } from "@/api";
import { getRepositoriesEndpoint } from "@/api/apisUrl";
import type { Filters } from "./getEmployeesService";

export interface Repository {
  id: number;
  name: string;
  mainRepository: boolean;
  type: string;
  branch: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    phone: string;
    governorate: string;
    companyId: number;
  };
  company: {
    id: number;
    name: string;
  };
}

export interface GetRepositoriesResponse {
  status: string;
  page: number;
  pagesCount: number;
  data: Repository[];
}

export const getRepositoriesService = async (
  { page = 1, size = 10, minified, type, branchId }: Filters = {
    page: 1,
    size: 10,
  }
) => {
  const response = await api.get<GetRepositoriesResponse>(
    getRepositoriesEndpoint,
    {
      params: {
        page,
        size,
        minified,
        type,
        branchId,
      },
    }
  );
  return response.data;
};
