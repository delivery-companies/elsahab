import { api } from "@/api";
import { getRepositoryDetailsEndpoint } from "@/api/apisUrl";
import type { Repository } from "./getRepositoriesService";

export interface GetBranchesResponse {
    status: string;
    data: Repository;
}

export const getRepositoryDetailsService = async (id: number) => {
    const response = await api.get<GetBranchesResponse>(getRepositoryDetailsEndpoint + id);
    return response.data;
};
